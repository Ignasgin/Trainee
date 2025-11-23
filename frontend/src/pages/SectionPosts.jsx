import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSectionPosts } from '../services/api';
import { 
  HiArrowLeft, 
  HiRefresh, 
  HiFire, 
  HiStar, 
  HiChatAlt, 
  HiUser,
  HiExclamationCircle,
  HiDocumentText 
} from 'react-icons/hi';
import { GiMeal, GiWeightLiftingUp } from 'react-icons/gi';

export default function SectionPosts() {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPosts();
  }, [id]);

  const loadPosts = async () => {
    try {
      const response = await getSectionPosts(id);
      setPosts(response.data);
    } catch (err) {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <HiRefresh className="w-12 h-12 text-primary animate-spin" />
        <div className="text-xl text-gray-600">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <Link 
        to="/" 
        className="text-primary hover:text-secondary font-semibold mb-6 inline-flex items-center gap-2 group transition-colors"
      >
        <HiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Sections
      </Link>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
          <HiExclamationCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/posts/${post.id}`}
            className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-l-4 border-primary hover:scale-[1.02]"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-800 group-hover:text-primary transition-colors flex-1">
                {post.title}
              </h2>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 flex-shrink-0 ml-4 ${
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

            <p className="text-gray-600 mb-4 line-clamp-2">
              {post.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <HiUser className="w-4 h-4" />
                <span className="font-medium">{post.author_username}</span>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
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
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <HiDocumentText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500">No posts in this section</p>
        </div>
      )}
    </div>
  );
}
