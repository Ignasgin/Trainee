from django.urls import path
from . import views

urlpatterns = [
    # ========== HIERARCHICAL URLS (Section → Post → Comment) ==========
    
    # Level 1: Sections
    path('sections/', views.SectionListView.as_view(), name='section-list'),
    path('sections/<int:pk>/', views.SectionDetailView.as_view(), name='section-detail'),
    
    # Level 2: Posts within Sections
    path('sections/<int:section_id>/posts/', views.SectionPostsView.as_view(), name='section-posts'),
    path('sections/<int:section_id>/posts/<int:pk>/', views.PostDetailView.as_view(), name='section-post-detail'),
    path('sections/<int:section_id>/posts/create/', views.PostCreateView.as_view(), name='section-post-create'),
    
    # Level 3: Comments within Section Posts
    path('sections/<int:section_id>/posts/<int:post_id>/comments/', views.CommentListView.as_view(), name='section-post-comments'),
    path('sections/<int:section_id>/posts/<int:post_id>/comments/create/', views.CommentCreateView.as_view(), name='section-post-comment-create'),
    
    # ========== FLAT URLS (for convenience and backward compatibility) ==========
    
    # User URLs
    path('users/', views.UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),
    path('users/<int:pk>/posts/', views.UserPostsView.as_view(), name='user-posts'),
    path('users/register/', views.UserCreateView.as_view(), name='user-create'),
    path('users/profile/', views.UserUpdateView.as_view(), name='user-update'),
    path('users/<int:pk>/delete/', views.UserDeleteView.as_view(), name='user-delete'),
    
    # Admin URLs
    path('admin/pending-users/', views.pending_users, name='admin-pending-users'),
    path('admin/users/<int:pk>/approve/', views.approve_user, name='admin-approve-user'),
    path('admin/pending-posts/', views.pending_posts, name='admin-pending-posts'),
    path('admin/debug/all-posts/', views.all_posts_debug, name='admin-debug-posts'),
    
    # Post URLs (flat access)
    path('posts/', views.PostListView.as_view(), name='post-list'),
    path('posts/public/', views.PublicPostsView.as_view(), name='public-posts'),
    path('posts/<int:pk>/', views.PostDetailView.as_view(), name='post-detail'),
    path('posts/create/', views.PostCreateView.as_view(), name='post-create'),
    path('posts/<int:pk>/update/', views.PostUpdateView.as_view(), name='post-update'),  # PATCH only
    path('posts/<int:pk>/replace/', views.PostReplaceView.as_view(), name='post-replace'),  # PUT only
    path('posts/<int:pk>/delete/', views.PostDeleteView.as_view(), name='post-delete'),
    path('posts/<int:pk>/publish/', views.publish_post, name='post-publish'),
    path('posts/<int:pk>/approve/', views.approve_post, name='post-approve'),
    
    # Comment URLs (flat access)
    path('posts/<int:post_id>/comments/', views.CommentListView.as_view(), name='comment-list'),
    path('comments/<int:pk>/', views.CommentDetailView.as_view(), name='comment-detail'),
    path('posts/<int:post_id>/comments/create/', views.CommentCreateView.as_view(), name='comment-create'),
    path('comments/<int:pk>/update/', views.CommentUpdateView.as_view(), name='comment-update'),  # PATCH only
    path('comments/<int:pk>/replace/', views.CommentReplaceView.as_view(), name='comment-replace'),  # PUT only
    path('comments/<int:pk>/delete/', views.CommentDeleteView.as_view(), name='comment-delete'),
    
    # Rating URLs
    path('posts/<int:post_id>/ratings/', views.RatingListView.as_view(), name='rating-list'),
    path('ratings/<int:pk>/', views.RatingDetailView.as_view(), name='rating-detail'),
    path('posts/<int:post_id>/ratings/create/', views.RatingCreateView.as_view(), name='rating-create'),
    path('ratings/<int:pk>/update/', views.RatingUpdateView.as_view(), name='rating-update'),  # PATCH only
    path('ratings/<int:pk>/replace/', views.RatingReplaceView.as_view(), name='rating-replace'),  # PUT only
    path('ratings/<int:pk>/delete/', views.RatingDeleteView.as_view(), name='rating-delete'),
]