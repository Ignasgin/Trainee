import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSectionPosts } from '../services/api';

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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl text-gray-600">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="text-primary hover:underline mb-6 inline-block">
        ← Back to Sections
      </Link>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/posts/${post.id}`}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border-l-4 border-primary"
          >
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-2xl font-bold text-gray-800">
                {post.title}
              </h2>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                post.type === 'meal' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {post.type === 'meal' ? '🍽️ Meal' : '🏋️ Workout'}
              </span>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-2">
              {post.description}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>By {post.author_username}</span>
              <div className="flex items-center gap-4">
                {post.calories && (
                  <span>🔥 {post.calories} kcal</span>
                )}
                <span>⭐ {post.average_rating?.toFixed(1) || 'N/A'}</span>
                <span>💬 {post.comment_count || 0}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">No posts in this section</p>
        </div>
      )}
    </div>
  );
}
