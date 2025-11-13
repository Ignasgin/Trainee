import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPost, getPostComments, getPostRatings, createComment, createRating } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    loadPostData();
  }, [id]);

  const loadPostData = async () => {
    try {
      const [postRes, commentsRes, ratingsRes] = await Promise.all([
        getPost(id),
        getPostComments(id),
        getPostRatings(id),
      ]);
      setPost(postRes.data);
      setComments(commentsRes.data);
      setRatings(ratingsRes.data);
    } catch (err) {
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await createComment(id, commentText);
      setCommentText('');
      loadPostData();
    } catch (err) {
      alert('Failed to post comment');
    }
  };

  const handleRatingSubmit = async (value) => {
    try {
      await createRating(id, value);
      setRating(value);
      loadPostData();
    } catch (err) {
      alert('Failed to submit rating');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl text-gray-600">Loading post...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl text-red-600">{error || 'Post not found'}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button onClick={() => navigate(-1)} className="text-primary hover:underline mb-6">
        ← Back
      </button>

      {/* Post Content */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-4xl font-bold text-gray-800">{post.title}</h1>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
            post.type === 'meal' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            {post.type === 'meal' ? '🍽️ Meal' : '🏋️ Workout'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
          <span>By <strong>{post.author_username}</strong></span>
          {post.calories && <span>🔥 {post.calories} kcal</span>}
          <span>⭐ {post.average_rating?.toFixed(1) || 'N/A'} ({ratings.length} ratings)</span>
        </div>

        <p className="text-gray-700 text-lg mb-6 whitespace-pre-wrap">
          {post.description}
        </p>

        {post.recommendations && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h3 className="font-semibold text-blue-900 mb-2">Recommendations</h3>
            <p className="text-blue-800">{post.recommendations}</p>
          </div>
        )}
      </div>

      {/* Rating Section */}
      {user && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">Rate this post</h3>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => handleRatingSubmit(value)}
                className={`text-3xl transition ${
                  value <= (rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                } hover:text-yellow-400`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold mb-6">Comments ({comments.length})</h3>

        {user && (
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows="3"
            />
            <button
              type="submit"
              className="mt-2 bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Post Comment
            </button>
          </form>
        )}

        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 pb-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-gray-800">{comment.author_username}</span>
                <span className="text-sm text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))}
        </div>

        {comments.length === 0 && (
          <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
}
