from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.db.models import Avg, Count
from drf_spectacular.utils import extend_schema, OpenApiResponse
from .models import Post, Comment, Rating, Section
from .serializers import UserSerializer, UserCreateSerializer, UserUpdateSerializer, PostSerializer, CommentSerializer, RatingSerializer, SectionSerializer

# Section views
@extend_schema(tags=['Sections'])
class SectionListView(generics.ListCreateAPIView):
    """List all sections or create a new section (admin only for creation)"""
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

@extend_schema(tags=['Sections'])
class SectionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update or delete a section (admin only for update/delete)"""
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

@extend_schema(tags=['Sections', 'Posts'])
class SectionPostsView(generics.ListAPIView):
    """List all posts in a specific section"""
    serializer_class = PostSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        section_id = self.kwargs['section_id']
        # Show only approved public posts for non-authenticated users
        if not self.request.user.is_authenticated:
            return Post.objects.filter(section_id=section_id, is_public=True, is_approved=True)
        # Show all public posts for authenticated users
        return Post.objects.filter(section_id=section_id, is_public=True)

# User views
@extend_schema(tags=['Users'])
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

@extend_schema(tags=['Users'])
class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

@extend_schema(tags=['Users'])
class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [permissions.AllowAny]
    
    def perform_create(self, serializer):
        user = serializer.save()
        return user
    
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        if response.status_code == 201:
            # Return user data with ID using UserSerializer
            user = User.objects.get(username=response.data['username'])
            user_serializer = UserSerializer(user)
            response.data = user_serializer.data
        return response

@extend_schema(tags=['Users'])
class UserUpdateView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserUpdateSerializer  # Changed to UserUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user

@extend_schema(tags=['Users'])
class UserDeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

@extend_schema(
    tags=['Users'],
    summary="Get user's posts",
    description="Retrieve all posts created by a specific user"
)
class UserPostsView(generics.ListAPIView):
    """Get all posts by a specific user"""
    serializer_class = PostSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        user_id = self.kwargs['pk']
        # If viewing own profile, show ALL posts (including pending/private)
        if self.request.user.is_authenticated and str(self.request.user.id) == str(user_id):
            return Post.objects.filter(user_id=user_id)
        # Show only approved public posts for non-authenticated users
        if not self.request.user.is_authenticated:
            return Post.objects.filter(user_id=user_id, is_public=True, is_approved=True)
        # Show all approved public posts for other authenticated users
        return Post.objects.filter(user_id=user_id, is_public=True, is_approved=True)

@extend_schema(
    tags=['Admin'],
    summary="Get pending users (admin only)",
    description="List all inactive users pending admin approval"
)
@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def pending_users(request):
    """Admin: get all inactive users waiting for approval"""
    users = User.objects.filter(is_active=False)
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@extend_schema(
    request=None,
    responses={
        200: UserSerializer,
        404: OpenApiResponse(description='User not found'),
    },
    tags=['Admin'],
    summary="Approve user (admin only)",
    description="Activate a user account"
)
@api_view(['PUT'])
@permission_classes([permissions.IsAdminUser])
def approve_user(request, pk):
    """Admin: approve/activate a user"""
    try:
        user = User.objects.get(pk=pk)
        user.is_active = True
        user.save()
        serializer = UserSerializer(user)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

# Post views
@extend_schema(tags=['Posts'])
class PostListView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        # Show only approved public posts for unauthenticated users
        if self.request.user.is_authenticated:
            return Post.objects.all()
        return Post.objects.filter(is_public=True, is_approved=True)

@extend_schema(tags=['Posts'])
class PostDetailView(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.AllowAny]

@extend_schema(tags=['Posts'])
class PostCreateView(generics.CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@extend_schema(
    tags=['Posts'],
    summary='Partial update of post (PATCH only)',
    description='Update specific fields of a post. Only the fields provided in the request will be updated.'
)
class PostUpdateView(generics.UpdateAPIView):
    """PATCH only - partial update of post fields"""
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['patch']  # Only allow PATCH
    
    def get_queryset(self):
        return Post.objects.filter(user=self.request.user)

@extend_schema(
    tags=['Posts'],
    summary='Full replacement of post (PUT only)',
    description='Replace entire post with new data. All required fields must be provided.',
    responses={
        200: PostSerializer,
        422: OpenApiResponse(description='Unprocessable Entity - missing required fields')
    }
)
class PostReplaceView(generics.UpdateAPIView):
    """PUT only - full replacement of post"""
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['put']  # Only allow PUT
    
    def get_queryset(self):
        return Post.objects.filter(user=self.request.user)
    
    def update(self, request, *args, **kwargs):
        # Required fields for PUT (full replacement)
        required_fields = ['title', 'type', 'description']
        missing_fields = [field for field in required_fields if field not in request.data]
        
        if missing_fields:
            return Response(
                {
                    'error': 'PUT requires all required fields',
                    'missing_fields': missing_fields,
                    'required_fields': required_fields,
                    'message': 'Use PATCH for partial updates',
                    'detail': 'PUT replaces the entire resource and requires all mandatory fields. Use PATCH to update specific fields only.'
                },
                status=status.HTTP_422_UNPROCESSABLE_ENTITY
            )
        
        return super().update(request, *args, **kwargs)

@extend_schema(tags=['Posts'])
class PostDeleteView(generics.DestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Post.objects.all()
        return Post.objects.filter(user=self.request.user)

# Post management views
@extend_schema(
    request=None,
    responses={
        200: PostSerializer,
        404: OpenApiResponse(description='Post not found'),
    },
    description='User publishes their own post (makes it public)',
    tags=['Posts']
)
@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def publish_post(request, pk):
    """User publishes their own post"""
    try:
        post = Post.objects.get(pk=pk, user=request.user)
        post.is_public = True
        post.save()
        serializer = PostSerializer(post)
        return Response(serializer.data)
    except Post.DoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

@extend_schema(
    request=None,
    responses={
        200: PostSerializer,
        404: OpenApiResponse(description='Post not found'),
    },
    description='Admin approves a post (makes it visible to guests)',
    tags=['Posts', 'Admin']
)
@api_view(['PUT'])
@permission_classes([permissions.IsAdminUser])
def approve_post(request, pk):
    """Admin approves a post"""
    try:
        post = Post.objects.get(pk=pk)
        post.is_approved = True
        post.save()
        serializer = PostSerializer(post)
        return Response(serializer.data)
    except Post.DoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

@extend_schema(tags=['Posts'])
class PublicPostsView(generics.ListAPIView):
    """List only approved public posts"""
    serializer_class = PostSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        return Post.objects.filter(is_public=True, is_approved=True)

@extend_schema(
    tags=['Admin'],
    summary="Get pending posts (admin only)",
    description="List all public posts waiting for admin approval"
)
@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def pending_posts(request):
    """Admin: get all posts waiting for approval"""
    posts = Post.objects.filter(is_public=True, is_approved=False)
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

# Comment views
@extend_schema(tags=['Comments'])
class CommentListView(generics.ListAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        post_id = self.kwargs['post_id']
        return Comment.objects.filter(post_id=post_id)

@extend_schema(tags=['Comments'])
class CommentDetailView(generics.RetrieveAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.AllowAny]

@extend_schema(tags=['Comments'])
class CommentCreateView(generics.CreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        post_id = self.kwargs['post_id']
        post = get_object_or_404(Post, id=post_id)
        serializer.save(user=self.request.user, post=post)

@extend_schema(
    tags=['Comments'],
    summary='Partial update of comment (PATCH only)',
    description='Update specific fields of a comment. Only provided fields will be updated.'
)
class CommentUpdateView(generics.UpdateAPIView):
    """PATCH only - partial update"""
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['patch']
    
    def get_queryset(self):
        return Comment.objects.filter(user=self.request.user)

@extend_schema(
    tags=['Comments'],
    summary='Full replacement of comment (PUT only)',
    description='Replace entire comment. Text field is required.',
    responses={
        200: CommentSerializer,
        422: OpenApiResponse(description='Missing required field: text')
    }
)
class CommentReplaceView(generics.UpdateAPIView):
    """PUT only - full replacement"""
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['put']
    
    def get_queryset(self):
        return Comment.objects.filter(user=self.request.user)
    
    def update(self, request, *args, **kwargs):
        required_fields = ['text']
        missing_fields = [field for field in required_fields if field not in request.data]
        
        if missing_fields:
            return Response(
                {
                    'error': 'PUT requires all required fields',
                    'missing_fields': missing_fields,
                    'required_fields': required_fields,
                    'message': 'Use PATCH for partial updates'
                },
                status=status.HTTP_422_UNPROCESSABLE_ENTITY
            )
        
        return super().update(request, *args, **kwargs)

@extend_schema(tags=['Comments'])
class CommentDeleteView(generics.DestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Comment.objects.all()
        return Comment.objects.filter(user=self.request.user)

# Rating views  
@extend_schema(tags=['Ratings'])
class RatingListView(generics.ListAPIView):
    serializer_class = RatingSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        post_id = self.kwargs['post_id']
        return Rating.objects.filter(post_id=post_id)

@extend_schema(tags=['Ratings'])
class RatingDetailView(generics.RetrieveAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [permissions.AllowAny]

@extend_schema(
    tags=['Ratings'],
    summary="Create or update rating for post",
    description="Creates a new rating for a post or updates existing rating if user already rated this post",
    responses={200: RatingSerializer, 201: RatingSerializer}
)
class RatingCreateView(generics.CreateAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        post_id = self.kwargs['post_id']
        post = get_object_or_404(Post, id=post_id)
        
        # First validate the data
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Check if rating already exists, update it instead of creating new
        existing_rating = Rating.objects.filter(post=post, user=request.user).first()
        if existing_rating:
            # Update existing rating with validated data
            existing_rating.rating = serializer.validated_data['rating']
            existing_rating.save()
            serializer = self.get_serializer(existing_rating)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            # Create new rating
            serializer.save(user=request.user, post=post)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

@extend_schema(
    tags=['Ratings'],
    summary="Partial update of rating (PATCH only)",
    description="Update specific fields of a rating. Only provided fields will be updated."
)
class RatingUpdateView(generics.UpdateAPIView):
    """PATCH only - partial update"""
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['patch']
    
    def get_queryset(self):
        return Rating.objects.filter(user=self.request.user)

@extend_schema(
    tags=['Ratings'],
    summary="Full replacement of rating (PUT only)",
    description="Replace entire rating. Rating value (1-5) is required.",
    responses={
        200: RatingSerializer,
        422: OpenApiResponse(description='Missing required field: rating')
    }
)
class RatingReplaceView(generics.UpdateAPIView):
    """PUT only - full replacement"""
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['put']
    
    def get_queryset(self):
        return Rating.objects.filter(user=self.request.user)
    
    def update(self, request, *args, **kwargs):
        required_fields = ['rating']
        missing_fields = [field for field in required_fields if field not in request.data]
        
        if missing_fields:
            return Response(
                {
                    'error': 'PUT requires all required fields',
                    'missing_fields': missing_fields,
                    'required_fields': required_fields,
                    'message': 'Use PATCH for partial updates'
                },
                status=status.HTTP_422_UNPROCESSABLE_ENTITY
            )
        
        return super().update(request, *args, **kwargs)

@extend_schema(
    tags=['Ratings'],
    summary="Delete rating",
    description="Delete a rating (users can delete own ratings, admins can delete any rating)"
)
class RatingDeleteView(generics.DestroyAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Rating.objects.all()
        return Rating.objects.filter(user=self.request.user)
