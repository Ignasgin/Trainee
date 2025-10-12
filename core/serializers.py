from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Post, Comment, Rating

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']
        read_only_fields = ['id', 'date_joined']

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name']  # username ir date_joined nekeičiami

class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    average_rating = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = ['id', 'user', 'title', 'type', 'description', 'is_public', 'is_approved', 
                 'calories', 'recommendations', 'created_at', 'updated_at', 'average_rating', 'comment_count']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'is_approved']
    
    def validate_title(self, value):
        if not value or len(value.strip()) == 0:
            raise serializers.ValidationError("Title cannot be empty")
        if len(value) < 3:
            raise serializers.ValidationError("Title must be at least 3 characters long")
        return value
    
    def validate_description(self, value):
        if not value or len(value.strip()) == 0:
            raise serializers.ValidationError("Description cannot be empty")
        if len(value) < 10:
            raise serializers.ValidationError("Description must be at least 10 characters long")
        return value
    
    def validate_calories(self, value):
        if value is not None and (value < 0 or value > 10000):
            raise serializers.ValidationError("Calories must be between 0 and 10000")
        return value
    
    def get_average_rating(self, obj):
        ratings = obj.rating_set.all()
        if ratings:
            return sum(rating.rating for rating in ratings) / len(ratings)
        return None
    
    def get_comment_count(self, obj):
        return obj.comment_set.count()

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'post', 'user', 'text', 'created_at']
        read_only_fields = ['id', 'user', 'created_at', 'post']  # post read-only nes nustatomas per URL
    
    def validate_text(self, value):
        if not value or len(value.strip()) == 0:
            raise serializers.ValidationError("Comment text cannot be empty")
        if len(value) < 5:
            raise serializers.ValidationError("Comment must be at least 5 characters long")
        if len(value) > 1000:
            raise serializers.ValidationError("Comment cannot exceed 1000 characters")
        return value

class RatingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Rating
        fields = ['id', 'post', 'user', 'rating', 'created_at']
        read_only_fields = ['id', 'user', 'created_at', 'post']  # post read-only nes nustatomas per URL
    
    def validate_rating(self, value):
        if value not in [1, 2, 3, 4, 5]:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value