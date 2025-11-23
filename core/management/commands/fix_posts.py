from django.core.management.base import BaseCommand
from core.models import Post
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Fix posts that are private - make them public'

    def add_arguments(self, parser):
        parser.add_argument(
            '--make-public',
            action='store_true',
            help='Make all posts public',
        )
        parser.add_argument(
            '--delete-private',
            action='store_true',
            help='Delete all private unapproved posts',
        )

    def handle(self, *args, **options):
        # Show current status
        total = Post.objects.count()
        private_posts = Post.objects.filter(is_public=False)
        
        self.stdout.write(self.style.SUCCESS(f'\n=== Post Status ==='))
        self.stdout.write(f"Total posts: {total}")
        self.stdout.write(f"Private posts: {private_posts.count()}")
        
        if private_posts.exists():
            self.stdout.write('\nPrivate posts:')
            for post in private_posts:
                approved = 'APPROVED' if post.is_approved else 'PENDING'
                self.stdout.write(
                    f"  ID: {post.id} | {post.user.username} | {post.title[:40]} | {approved}"
                )
        
        if options['make_public']:
            count = private_posts.update(is_public=True)
            self.stdout.write(self.style.SUCCESS(f'\n✓ Made {count} posts public'))
        
        if options['delete_private']:
            private_unapproved = Post.objects.filter(is_public=False, is_approved=False)
            count = private_unapproved.count()
            private_unapproved.delete()
            self.stdout.write(self.style.SUCCESS(f'\n✓ Deleted {count} private unapproved posts'))
        
        if not options['make_public'] and not options['delete_private']:
            self.stdout.write('\nOptions:')
            self.stdout.write('  --make-public      Make all posts public')
            self.stdout.write('  --delete-private   Delete all private unapproved posts')
