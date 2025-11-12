from django.contrib import admin
from .models import Post, Comment, Section, Rating

@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description', 'created_at', 'updated_at')
    search_fields = ('name',)

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'section', 'user', 'title', 'type', 'is_public', 'is_approved', 'created_at')
    list_filter = ('section', 'type', 'is_public', 'is_approved')
    search_fields = ('title', 'description')

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'post', 'user', 'text', 'created_at')
    search_fields = ('text',)

@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ('id', 'post', 'user', 'rating', 'created_at')
    list_filter = ('rating',)

