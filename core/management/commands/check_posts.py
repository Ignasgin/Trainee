from django.core.management.base import BaseCommand
from core.models import Post
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Check all posts and their visibility status'

    def handle(self, *args, **kwargs):
        posts = Post.objects.all().order_by('-created_at')
        
        self.stdout.write(self.style.SUCCESS(f'\n=== Total Posts: {posts.count()} ===\n'))
        
        for post in posts:
            status = []
            if post.is_public:
                status.append('PUBLIC')
            else:
                status.append('PRIVATE')
            
            if post.is_approved:
                status.append('APPROVED')
            else:
                status.append('PENDING')
            
            status_str = ' | '.join(status)
            
            self.stdout.write(
                f"ID: {post.id:3d} | {post.type:7s} | {status_str:20s} | "
                f"User: {post.user.username:15s} | Title: {post.title[:40]}"
            )
        
        # Summary
        self.stdout.write('\n=== Summary ===')
        self.stdout.write(f"Total: {posts.count()}")
        self.stdout.write(f"Public + Approved: {posts.filter(is_public=True, is_approved=True).count()}")
        self.stdout.write(f"Public + Pending: {posts.filter(is_public=True, is_approved=False).count()}")
        self.stdout.write(f"Private + Approved: {posts.filter(is_public=False, is_approved=True).count()}")
        self.stdout.write(f"Private + Pending: {posts.filter(is_public=False, is_approved=False).count()}")
        
        # Show all users
        self.stdout.write('\n=== All Users ===')
        users = User.objects.all().order_by('username')
        for user in users:
            post_count = Post.objects.filter(user=user).count()
            active_status = 'ACTIVE' if user.is_active else 'INACTIVE'
            role = 'ADMIN' if user.is_staff else 'USER'
            self.stdout.write(
                f"ID: {user.id:3d} | {user.username:15s} | {active_status:8s} | {role:5s} | Posts: {post_count}"
            )
