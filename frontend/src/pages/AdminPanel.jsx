import { useState, useEffect } from 'react';
import { getPendingUsers, getPendingPosts, approveUser, approvePost } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function AdminPanel() {
  const { user } = useAuth();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    if (user?.role === 'admin') {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [usersRes, postsRes] = await Promise.all([
        getPendingUsers(),
        getPendingPosts(),
      ]);
      setPendingUsers(usersRes.data);
      setPendingPosts(postsRes.data);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      await approveUser(userId);
      loadData();
    } catch (err) {
      alert('Failed to approve user');
    }
  };

  const handleApprovePost = async (postId) => {
    try {
      await approvePost(postId);
      loadData();
    } catch (err) {
      alert('Failed to approve post');
    }
  };

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl text-gray-600">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Admin Panel</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === 'users'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Pending Users ({pendingUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-6 py-3 font-semibold transition ${
            activeTab === 'posts'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Pending Posts ({pendingPosts.length})
        </button>
      </div>

      {/* Pending Users */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pendingUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.date_joined).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleApproveUser(user.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pendingUsers.length === 0 && (
            <p className="text-center py-8 text-gray-500">No pending users</p>
          )}
        </div>
      )}

      {/* Pending Posts */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {pendingPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-800">{post.title}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  post.type === 'meal' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {post.type === 'meal' ? '🍽️ Meal' : '🏋️ Workout'}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{post.description}</p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  <span>By {post.author_username}</span>
                  {post.calories && <span className="ml-4">🔥 {post.calories} kcal</span>}
                </div>
                <button
                  onClick={() => handleApprovePost(post.id)}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  Approve Post
                </button>
              </div>
            </div>
          ))}
          {pendingPosts.length === 0 && (
            <p className="text-center py-8 text-gray-500">No pending posts</p>
          )}
        </div>
      )}
    </div>
  );
}
