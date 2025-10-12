from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema, OpenApiResponse
from .models import Post, Comment, Rating
from .serializers import UserSerializer, UserCreateSerializer, UserUpdateSerializer, PostSerializer, CommentSerializer, RatingSerializer

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

@extend_schema(tags=['Users', 'Admin'])
class UserDeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

# Authentication views
@extend_schema(
    request=None,
    responses={
        200: OpenApiResponse(description='Successfully logged out'),
    },
    description='Logout user and delete authentication token',
    tags=['Authentication']
)
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def logout_view(request):
    """Logout user and delete token"""
    if request.user.is_authenticated:
        try:
            token = Token.objects.get(user=request.user)
            token.delete()
        except Token.DoesNotExist:
            pass
        logout(request)
    return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)

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

@extend_schema(tags=['Posts'])
class PostUpdateView(generics.UpdateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Post.objects.filter(user=self.request.user)

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

@extend_schema(tags=['Comments'])
class CommentUpdateView(generics.UpdateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Comment.objects.filter(user=self.request.user)

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
    summary="Update user's rating",
    description="Update an existing rating (only own ratings can be updated)"
)
class RatingUpdateView(generics.UpdateAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Rating.objects.filter(user=self.request.user)

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
