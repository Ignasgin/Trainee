from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from core.models import Post, Comment, Rating
from django.utils import timezone
import random

class Command(BaseCommand):
    help = 'Create test data for API demonstration'

    def handle(self, *args, **options):
        self.stdout.write('Creating test data...')
        
        # Create test users
        self.create_users()
        
        # Create test posts
        self.create_posts()
        
        # Create test comments
        self.create_comments()
        
        # Create test ratings
        self.create_ratings()
        
        self.stdout.write(
            self.style.SUCCESS('Successfully created test data!')
        )

    def create_users(self):
        """Create test users with different roles"""
        
        # Create regular users
        users_data = [
            {
                'username': 'john_fitness',
                'email': 'john@example.com',
                'first_name': 'John',
                'last_name': 'Smith',
                'password': 'testpass123'
            },
            {
                'username': 'sarah_healthy',
                'email': 'sarah@example.com',
                'first_name': 'Sarah',
                'last_name': 'Johnson',
                'password': 'testpass123'
            },
            {
                'username': 'mike_trainer',
                'email': 'mike@example.com',
                'first_name': 'Mike',
                'last_name': 'Wilson',
                'password': 'testpass123'
            },
            {
                'username': 'emma_nutritionist',
                'email': 'emma@example.com',
                'first_name': 'Emma',
                'last_name': 'Davis',
                'password': 'testpass123'
            },
            {
                'username': 'alex_beginner',
                'email': 'alex@example.com',
                'first_name': 'Alex',
                'last_name': 'Brown',
                'password': 'testpass123'
            }
        ]

        for user_data in users_data:
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults={
                    'email': user_data['email'],
                    'first_name': user_data['first_name'],
                    'last_name': user_data['last_name'],
                }
            )
            if created:
                user.set_password(user_data['password'])
                user.save()
                self.stdout.write(f'Created user: {user.username}')

    def create_posts(self):
        """Create test posts - both meal and workout plans"""
        
        users = User.objects.all()
        
        meal_plans = [
            {
                'title': 'High Protein Breakfast Plan',
                'description': '''Perfect breakfast plan for muscle building:
                
Morning (7:00 AM):
- 3 whole eggs + 2 egg whites scrambled
- 1 slice whole grain toast
- 1/2 avocado
- 1 cup Greek yogurt with berries

Calories: ~450
Protein: ~35g
Carbs: ~30g
Fat: ~20g

Great for post-workout recovery!''',
                'type': 'meal',
                'is_public': True
            },
            {
                'title': 'Mediterranean Diet Weekly Plan',
                'description': '''7-day Mediterranean diet plan:

Day 1: Grilled salmon with quinoa and vegetables
Day 2: Greek salad with chickpeas and feta
Day 3: Lentil soup with whole grain bread
Day 4: Baked chicken with roasted vegetables
Day 5: Tuna and white bean salad
Day 6: Vegetable paella with brown rice
Day 7: Grilled vegetables with hummus

Focus on olive oil, fish, vegetables, and whole grains.''',
                'type': 'meal',
                'is_public': True
            },
            {
                'title': 'Vegan Weight Loss Meal Plan',
                'description': '''Plant-based 1500 calorie meal plan:

Breakfast: Oatmeal with banana and almond butter
Snack: Apple with peanut butter
Lunch: Quinoa Buddha bowl with tahini dressing
Snack: Hummus with vegetables
Dinner: Lentil curry with brown rice

All meals are nutrient-dense and satisfying!''',
                'type': 'meal',
                'is_public': True
            },
            {
                'title': 'Keto Beginner Meal Plan',
                'description': '''Simple keto meal plan for beginners:

Breakfast: Keto scrambled eggs with bacon
Lunch: Avocado chicken salad
Dinner: Grilled steak with asparagus
Snacks: Cheese, nuts, olives

Macros: 70% fat, 25% protein, 5% carbs
Stay hydrated and track your ketones!''',
                'type': 'meal',
                'is_public': False
            },
            {
                'title': 'Post-Workout Nutrition Guide',
                'description': '''Optimal post-workout meals:

Within 30 minutes:
- Protein shake with banana
- Chocolate milk
- Greek yogurt with fruit

Within 2 hours:
- Chicken and rice
- Tuna sandwich
- Egg omelet with toast

Hydration is key - drink plenty of water!''',
                'type': 'meal',
                'is_public': True
            }
        ]

        workout_plans = [
            {
                'title': 'Beginner Full Body Workout',
                'description': '''Perfect for fitness beginners - 3x per week:

Day 1 - Full Body:
- Squats: 3 sets x 10 reps
- Push-ups: 3 sets x 8-12 reps
- Bent-over rows: 3 sets x 10 reps
- Plank: 3 sets x 30 seconds
- Walking: 20 minutes

Rest between sets: 60-90 seconds
Start with bodyweight, progress gradually!''',
                'type': 'workout',
                'is_public': True
            },
            {
                'title': 'Advanced Upper Body Strength',
                'description': '''Intensive upper body workout:

Warm-up: 10 minutes dynamic stretching

Main workout:
- Bench Press: 4 sets x 6-8 reps
- Pull-ups: 4 sets x 8-10 reps
- Overhead Press: 3 sets x 8-10 reps
- Barbell Rows: 3 sets x 8-10 reps
- Dips: 3 sets x 10-12 reps
- Face pulls: 3 sets x 15 reps

Cool-down: 10 minutes stretching''',
                'type': 'workout',
                'is_public': True
            },
            {
                'title': 'HIIT Cardio Blast',
                'description': '''20-minute high-intensity workout:

Warm-up: 5 minutes light jogging

HIIT Circuit (repeat 4 times):
- Burpees: 30 seconds
- Rest: 30 seconds
- Mountain climbers: 30 seconds
- Rest: 30 seconds
- Jump squats: 30 seconds
- Rest: 30 seconds

Cool-down: 5 minutes walking and stretching

Burns calories for hours after workout!''',
                'type': 'workout',
                'is_public': True
            },
            {
                'title': 'Home Yoga Flow',
                'description': '''30-minute morning yoga routine:

1. Sun Salutation A (5 rounds)
2. Warrior I & II sequence
3. Triangle pose
4. Downward dog to plank flow
5. Seated forward fold
6. Spinal twist
7. Savasana (5 minutes)

Great for flexibility and stress relief!''',
                'type': 'workout',
                'is_public': True
            },
            {
                'title': 'Powerlifting Program',
                'description': '''3-day powerlifting split:

Day 1 - Squat Focus:
- Back Squat: 5 sets x 3-5 reps
- Romanian Deadlift: 3 sets x 8 reps
- Bulgarian Split Squats: 3 sets x 10 each leg
- Leg Curls: 3 sets x 12 reps

Day 2 - Bench Focus:
- Bench Press: 5 sets x 3-5 reps
- Incline Dumbbell Press: 3 sets x 8 reps
- Tricep Dips: 3 sets x 10 reps

Day 3 - Deadlift Focus:
- Deadlift: 5 sets x 3-5 reps
- Bent-over Rows: 3 sets x 8 reps
- Pull-ups: 3 sets x 8 reps''',
                'type': 'workout',
                'is_public': False
            }
        ]

        # Create meal plan posts
        for i, post_data in enumerate(meal_plans):
            user = users[i % len(users)]
            post, created = Post.objects.get_or_create(
                title=post_data['title'],
                user=user,
                defaults={
                    'description': post_data['description'],
                    'type': post_data['type'],
                    'is_public': post_data['is_public'],
                    'is_approved': True,  # Approve some posts for demo
                    'calories': post_data.get('calories', 400 + (i * 50)),  # Sample calories
                    'recommendations': f'Perfect for {user.first_name}\'s fitness goals!'
                }
            )
            if created:
                self.stdout.write(f'Created meal plan: {post.title}')

        # Create workout plan posts
        for i, post_data in enumerate(workout_plans):
            user = users[i % len(users)]
            post, created = Post.objects.get_or_create(
                title=post_data['title'],
                user=user,
                defaults={
                    'description': post_data['description'],
                    'type': post_data['type'],
                    'is_public': post_data['is_public'],
                    'is_approved': True,  # Approve some posts
                    'calories': post_data.get('calories', 200 + (i * 75)),  # Sample calories burned
                    'recommendations': f'Great workout by {user.first_name}. Try it!'
                }
            )
            if created:
                self.stdout.write(f'Created workout plan: {post.title}')

    def create_comments(self):
        """Create realistic comments on posts"""
        
        users = User.objects.all()
        posts = Post.objects.all()

        comments_data = [
            "This plan looks amazing! I've been looking for something exactly like this.",
            "Thanks for sharing! I tried this yesterday and it was perfect.",
            "Great detailed instructions. Very helpful for beginners.",
            "I love the Mediterranean approach. So much variety!",
            "This workout kicked my butt! Definitely going to do it again.",
            "Perfect for my fitness level. Thanks for the modifications.",
            "The nutrition info is really helpful. Appreciate the macro breakdown.",
            "I've been following this for a week and already seeing results!",
            "Simple but effective. Love that it doesn't require gym equipment.",
            "Could you add some vegetarian alternatives?",
            "This is exactly what my trainer recommended. Great minds think alike!",
            "The progression is perfect. Started easy and building up nicely.",
            "Tried this today - harder than it looks but so worth it!",
            "Love the scientific approach. Clear explanations make all the difference.",
            "Perfect for busy schedules. Quick but effective!",
            "Been doing this for a month - game changer for my energy levels.",
            "Great for meal prep! Made everything on Sunday for the week.",
            "The flexibility tips at the end are gold. Thank you!",
            "Challenging but doable. Exactly what I needed to push myself.",
            "Clear instructions and great photos. Very professional!"
        ]

        for post in posts:
            # Each post gets 2-5 random comments
            num_comments = random.randint(2, 5)
            selected_comments = random.sample(comments_data, num_comments)
            
            for comment_text in selected_comments:
                # Don't let users comment on their own posts
                available_users = [u for u in users if u != post.user]
                if available_users:
                    user = random.choice(available_users)
                    comment, created = Comment.objects.get_or_create(
                        post=post,
                        user=user,
                        text=comment_text
                    )
                    if created:
                        self.stdout.write(f'Created comment on "{post.title}"')

    def create_ratings(self):
        """Create realistic ratings for posts"""
        
        users = User.objects.all()
        posts = Post.objects.all()

        for post in posts:
            # Each post gets 3-8 random ratings
            num_ratings = random.randint(3, 8)
            available_users = [u for u in users if u != post.user]
            
            # Select random users to rate this post
            rating_users = random.sample(available_users, min(num_ratings, len(available_users)))
            
            for user in rating_users:
                # Create realistic rating distribution (more 4s and 5s)
                rating_choices = [3, 4, 4, 4, 5, 5, 5, 5]
                rating_value = random.choice(rating_choices)
                
                rating, created = Rating.objects.get_or_create(
                    post=post,
                    user=user,
                    defaults={'rating': rating_value}
                )
                if created:
                    self.stdout.write(f'Created {rating_value}-star rating for "{post.title}"')

        # Show statistics
        self.show_statistics()

    def show_statistics(self):
        """Display created data statistics"""
        
        users_count = User.objects.count()
        posts_count = Post.objects.count()
        meal_plans_count = Post.objects.filter(type='meal').count()
        workout_plans_count = Post.objects.filter(type='workout').count()
        public_posts_count = Post.objects.filter(is_public=True).count()
        comments_count = Comment.objects.count()
        ratings_count = Rating.objects.count()

        self.stdout.write('\n' + '='*50)
        self.stdout.write('TEST DATA STATISTICS:')
        self.stdout.write('='*50)
        self.stdout.write(f'Users created: {users_count}')
        self.stdout.write(f'Posts created: {posts_count}')
        self.stdout.write(f'  - Meal plans: {meal_plans_count}')
        self.stdout.write(f'  - Workout plans: {workout_plans_count}')
        self.stdout.write(f'  - Public posts: {public_posts_count}')
        self.stdout.write(f'Comments created: {comments_count}')
        self.stdout.write(f'Ratings created: {ratings_count}')
        self.stdout.write('='*50)
        
        # Show average ratings for each post
        self.stdout.write('\nPOST RATINGS:')
        for post in Post.objects.all():
            ratings = post.rating_set.all()
            if ratings:
                avg_rating = sum(r.rating for r in ratings) / len(ratings)
                self.stdout.write(f'{post.title}: {avg_rating:.1f}/5 ({len(ratings)} ratings)')
        
        self.stdout.write('\nUser credentials for testing:')
        self.stdout.write('Username: john_fitness, Password: testpass123')
        self.stdout.write('Username: sarah_healthy, Password: testpass123')
        self.stdout.write('Username: mike_trainer, Password: testpass123')
        self.stdout.write('Username: emma_nutritionist, Password: testpass123')
        self.stdout.write('Username: alex_beginner, Password: testpass123')