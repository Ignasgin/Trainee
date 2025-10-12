from django.db import models
from django.contrib.auth.models import User

class Post(models.Model):
    TYPE_CHOICES = [
        ('meal', 'Meal Plan'),
        ('workout', 'Workout Plan'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    description = models.TextField()
    
    # Status laukai
    is_public = models.BooleanField(default=False)  # Ar viešas
    is_approved = models.BooleanField(default=False)  # Ar patvirtintas admin
    
    # Papildoma informacija
    calories = models.IntegerField(null=True, blank=True, help_text="Estimated calories")
    recommendations = models.TextField(blank=True, help_text="Additional recommendations")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Comment by {self.user.username} on {self.post.title}'

class Rating(models.Model):
    RATING_CHOICES = [
        (1, '1 Star'),
        (2, '2 Stars'),
        (3, '3 Stars'),
        (4, '4 Stars'),
        (5, '5 Stars'),
    ]
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=RATING_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('post', 'user')  # Vienas vartotojas gali įvertinti postą tik vieną kartą

    def __str__(self):
        return f'{self.user.username} rated {self.post.title}: {self.rating}'