import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPost, getPostComments, getPostRatings, createComment, createRating, deleteComment } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  HiArrowLeft, 
  HiRefresh, 
  HiFire, 
  HiStar, 
  HiUser, 
  HiChatAlt, 
  HiLightBulb,
  HiPencilAlt,
  HiExclamationCircle,
  HiTrash
} from 'react-icons/hi';
import { GiMeal, GiWeightLiftingUp } from 'react-icons/gi';

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
      const commentsData = commentsRes.data?.results || commentsRes.data;
      const ratingsData = ratingsRes.data?.results || ratingsRes.data;
      setComments(Array.isArray(commentsData) ? commentsData : []);
      setRatings(Array.isArray(ratingsData) ? ratingsData : []);
    } catch (err) {
      setError('Failed to load post');
      setComments([]);
      setRatings([]);
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

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      await deleteComment(commentId);
      loadPostData();
    } catch (err) {
      console.error('Failed to delete comment:', err);
      alert('Failed to delete comment');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <HiRefresh className="w-12 h-12 text-primary animate-spin" />
        <div className="text-xl text-gray-600">Loading post...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <HiExclamationCircle className="w-16 h-16 text-red-500" />
        <div className="text-xl text-red-600">{error || 'Post not found'}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
      <button 
        onClick={() => navigate(-1)} 
        className="text-primary hover:text-secondary font-semibold mb-6 inline-flex items-center gap-2 group transition-colors"
      >
        <HiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      {/* Post Content */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6 border border-gray-100">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <h1 className="text-4xl font-bold text-gray-800 flex-1">{post.title}</h1>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 flex-shrink-0 ${
            post.type === 'meal' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            {post.type === 'meal' ? (
              <>
                <GiMeal className="w-5 h-5" />
                Meal
              </>
            ) : (
              <>
                <GiWeightLiftingUp className="w-5 h-5" />
                Workout
              </>
            )}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm mb-6 pb-4 border-b border-gray-200">
          <span className="flex items-center gap-2 text-gray-700">
            <HiUser className="w-5 h-5" />
            <strong>{post.author_username}</strong>
          </span>
          {post.calories && (
            <span className="flex items-center gap-1 text-orange-600 font-semibold">
              <HiFire className="w-5 h-5" />
              {post.calories} kcal
            </span>
          )}
          <span className="flex items-center gap-1 text-yellow-600 font-semibold">
            <HiStar className="w-5 h-5" />
            {post.average_rating?.toFixed(1) || 'N/A'} ({ratings.length})
          </span>
        </div>

        <p className="text-gray-700 text-lg mb-6 whitespace-pre-wrap">
          {post.description}
        </p>

        {post.recommendations && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <HiLightBulb className="w-5 h-5" />
              Recommendations
            </h3>
            <p className="text-blue-800">{post.recommendations}</p>
          </div>
        )}
      </div>

      {/* Rating Section */}
      {user && (
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <HiStar className="w-6 h-6 text-yellow-500" />
            Rate this post
          </h3>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => handleRatingSubmit(value)}
                className={`text-4xl transition-all transform hover:scale-110 ${
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
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <HiChatAlt className="w-7 h-7 text-primary" />
          Comments ({comments.length})
        </h3>

        {user && (
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <div className="relative">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all"
                rows="3"
              />
            </div>
            <button
              type="submit"
              className="mt-3 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 hover:scale-[1.02] transition-all flex items-center gap-2 shadow-lg"
            >
              <HiPencilAlt className="w-5 h-5" />
              Post Comment
            </button>
          </form>
        )}

        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-0 hover:bg-gray-50 p-4 rounded-lg transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800 flex items-center gap-2">
                    <HiUser className="w-4 h-4 text-primary" />
                    {comment.author_username}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-red-500 hover:text-red-700 hover:scale-110 transition-all p-1"
                    title="Delete comment"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-gray-700 ml-6">{comment.text}</p>
            </div>
          ))}
        </div>

        {comments.length === 0 && (
          <div className="text-center py-8">
            <HiChatAlt className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
}
