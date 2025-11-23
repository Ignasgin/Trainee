import { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getUserPosts, deletePost } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  HiUser, 
  HiMail, 
  HiShieldCheck, 
  HiRefresh, 
  HiDocumentText,
  HiFire,
  HiStar,
  HiChatAlt,
  HiPlusCircle,
  HiTrash,
  HiPencil
} from 'react-icons/hi';
import { GiMeal, GiWeightLiftingUp } from 'react-icons/gi';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadUserPosts();
    }
  }, [user]);

  const loadUserPosts = async () => {
    try {
      const response = await getUserPosts(user.id);
      const data = response.data?.results || response.data;
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load user posts:', err);
      setError('Failed to load your posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPost = (postId, e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/posts/${postId}/edit`);
  };

  const handleDeletePost = async (postId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await deletePost(postId);
      loadUserPosts();
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('Failed to delete post');
    }
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl animate-fade-in">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-2xl p-8 mb-8 text-white">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
            <HiUser className="w-12 h-12 text-primary" />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2">{user.username}</h1>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start text-white/90">
              <span className="flex items-center gap-2">
                <HiMail className="w-5 h-5" />
                {user.email}
              </span>
              {user.role === 'admin' && (
                <span className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                  <HiShieldCheck className="w-5 h-5" />
                  Admin
                </span>
              )}
            </div>
          </div>

          <Link
            to="/posts/create"
            className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all flex items-center gap-2 shadow-lg hover:scale-105"
          >
            <HiPlusCircle className="w-5 h-5" />
            Create Post
          </Link>
        </div>
      </div>

      {/* User Posts Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <HiDocumentText className="w-8 h-8 text-primary" />
          My Posts
          <span className="text-xl text-gray-500 font-normal">({posts.length})</span>
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <HiRefresh className="w-12 h-12 text-primary animate-spin" />
            <p className="text-gray-600">Loading your posts...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <HiDocumentText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500 mb-4">You haven't created any posts yet</p>
            <Link
              to="/posts/create"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 hover:scale-105 transition-all shadow-lg"
            >
              <HiPlusCircle className="w-5 h-5" />
              Create Your First Post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="group bg-gray-50 hover:bg-white rounded-xl p-6 border-2 border-transparent hover:border-primary transition-all duration-300 shadow-sm hover:shadow-lg"
              >
                <div className="flex justify-between items-start gap-4 mb-3">
                  <Link
                    to={`/posts/${post.id}`}
                    className="text-xl font-bold text-gray-800 hover:text-primary transition-colors flex-1"
                  >
                    {post.title}
                  </Link>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => handleEditPost(post.id, e)}
                      className="text-blue-500 hover:text-blue-700 hover:scale-110 transition-all p-2"
                      title="Edit post"
                    >
                      <HiPencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => handleDeletePost(post.id, e)}
                      className="text-red-500 hover:text-red-700 hover:scale-110 transition-all p-2"
                      title="Delete post"
                    >
                      <HiTrash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                  
                <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${
                      post.type === 'meal' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {post.type === 'meal' ? (
                        <>
                          <GiMeal className="w-4 h-4" />
                          Meal
                        </>
                      ) : (
                        <>
                          <GiWeightLiftingUp className="w-4 h-4" />
                          Workout
                        </>
                      )}
                    </span>
                    
                    {!post.is_approved && (
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-700">
                        Pending Approval
                      </span>
                    )}
                  </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {post.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm pt-3 border-t border-gray-200">
                  {post.calories && (
                    <span className="flex items-center gap-1 text-orange-600 font-semibold">
                      <HiFire className="w-5 h-5" />
                      {post.calories} kcal
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-yellow-600 font-semibold">
                    <HiStar className="w-5 h-5" />
                    {post.average_rating?.toFixed(1) || 'N/A'}
                  </span>
                  <span className="flex items-center gap-1 text-blue-600 font-semibold">
                    <HiChatAlt className="w-5 h-5" />
                    {post.comment_count || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
