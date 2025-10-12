from django.urls import path
from . import views

urlpatterns = [
    # Authentication URLs
    path('auth/logout/', views.logout_view, name='logout'),
    
    # User URLs
    path('users/', views.UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),
    path('users/register/', views.UserCreateView.as_view(), name='user-create'),
    path('users/profile/', views.UserUpdateView.as_view(), name='user-update'),
    path('users/<int:pk>/delete/', views.UserDeleteView.as_view(), name='user-delete'),
    
    # Post URLs
    path('posts/', views.PostListView.as_view(), name='post-list'),
    path('posts/public/', views.PublicPostsView.as_view(), name='public-posts'),
    path('posts/<int:pk>/', views.PostDetailView.as_view(), name='post-detail'),
    path('posts/create/', views.PostCreateView.as_view(), name='post-create'),
    path('posts/<int:pk>/update/', views.PostUpdateView.as_view(), name='post-update'),
    path('posts/<int:pk>/delete/', views.PostDeleteView.as_view(), name='post-delete'),
    path('posts/<int:pk>/publish/', views.publish_post, name='post-publish'),
    path('posts/<int:pk>/approve/', views.approve_post, name='post-approve'),
    
    # Comment URLs (hierarchical)
    path('posts/<int:post_id>/comments/', views.CommentListView.as_view(), name='comment-list'),
    path('comments/<int:pk>/', views.CommentDetailView.as_view(), name='comment-detail'),
    path('posts/<int:post_id>/comments/create/', views.CommentCreateView.as_view(), name='comment-create'),
    path('comments/<int:pk>/update/', views.CommentUpdateView.as_view(), name='comment-update'),
    path('comments/<int:pk>/delete/', views.CommentDeleteView.as_view(), name='comment-delete'),
    
    # Rating URLs (hierarchical)
    path('posts/<int:post_id>/ratings/', views.RatingListView.as_view(), name='rating-list'),
    path('ratings/<int:pk>/', views.RatingDetailView.as_view(), name='rating-detail'),
    path('posts/<int:post_id>/ratings/create/', views.RatingCreateView.as_view(), name='rating-create'),
    path('ratings/<int:pk>/update/', views.RatingUpdateView.as_view(), name='rating-update'),
    path('ratings/<int:pk>/delete/', views.RatingDeleteView.as_view(), name='rating-delete'),
]