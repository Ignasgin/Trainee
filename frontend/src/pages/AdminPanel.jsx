import { useState, useEffect } from 'react';
import { getPendingUsers, getPendingPosts, approveUser, approvePost, deletePost, getAllPostsDebug } from '../services/api';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  HiUserGroup, 
  HiDocumentText, 
  HiCheckCircle, 
  HiRefresh, 
  HiShieldCheck,
  HiUser,
  HiMail,
  HiCalendar,
  HiFire,
  HiXCircle,
  HiTrash
} from 'react-icons/hi';
import { GiMeal, GiWeightLiftingUp } from 'react-icons/gi';

export default function AdminPanel() {
  const { user } = useAuth();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [usersRes, postsRes, debugRes] = await Promise.all([
        getPendingUsers(),
        getPendingPosts(),
        getAllPostsDebug(),
      ]);
      console.log('Pending users response:', usersRes.data);
      console.log('Pending posts response:', postsRes.data);
      console.log('Debug info:', debugRes.data);
      const usersData = usersRes.data?.results || usersRes.data;
      const postsData = postsRes.data?.results || postsRes.data;
      setPendingUsers(Array.isArray(usersData) ? usersData : []);
      setPendingPosts(Array.isArray(postsData) ? postsData : []);
      setDebugInfo(debugRes.data);
      console.log('Pending posts count:', Array.isArray(postsData) ? postsData.length : 0);
    } catch (err) {
      console.error('Failed to load admin data', err);
      setPendingUsers([]);
      setPendingPosts([]);
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

  const handleRejectPost = async (postId) => {
    if (!confirm('Are you sure you want to reject and delete this post?')) return;
    try {
      await deletePost(postId);
      loadData();
    } catch (err) {
      alert('Failed to reject post');
    }
  };

  const handleDebugDeletePost = async (postId, postTitle) => {
    if (!confirm(`Delete post: "${postTitle}"?\n\nThis action cannot be undone.`)) return;
    try {
      await deletePost(postId);
      loadData();
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('Failed to delete post');
    }
  };

  const handleDebugDeleteUser = async (userId, username) => {
    if (!confirm(`Delete user: "${username}"?\n\nThis will delete the user and all their posts!\n\nThis action cannot be undone.`)) return;
    try {
      const token = sessionStorage.getItem('token');
      await axios.delete(`/api/users/${userId}/delete/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadData();
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert('Failed to delete user');
    }
  };

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <HiRefresh className="w-12 h-12 text-primary animate-spin" />
        <div className="text-xl text-gray-600">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <HiShieldCheck className="w-10 h-10 text-primary" />
        <h1 className="text-4xl font-bold text-gray-800">Admin Panel</h1>
      </div>

      {/* Debug Info */}
      {debugInfo && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-lg">
          <h3 className="font-bold text-blue-900 mb-2">📊 System Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div>
              <span className="text-blue-700">Total Posts:</span>
              <span className="font-bold ml-2">{debugInfo.summary.total_posts}</span>
            </div>
            <div>
              <span className="text-green-700">✓ Public + Approved:</span>
              <span className="font-bold ml-2">{debugInfo.summary.public_approved}</span>
            </div>
            <div>
              <span className="text-yellow-700">⏳ Public + Pending:</span>
              <span className="font-bold ml-2">{debugInfo.summary.public_pending}</span>
            </div>
            <div>
              <span className="text-orange-700">🔒 Private + Approved:</span>
              <span className="font-bold ml-2">{debugInfo.summary.private_approved}</span>
            </div>
            <div>
              <span className="text-red-700">❌ Private + Pending:</span>
              <span className="font-bold ml-2">{debugInfo.summary.private_pending}</span>
            </div>
          </div>
          {debugInfo.summary.private_pending > 0 && (
            <p className="text-red-700 text-sm mt-2">
              ⚠️ Warning: {debugInfo.summary.private_pending} post(s) are private and unapproved (hidden from all)
            </p>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b bg-white rounded-t-xl shadow-md">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-4 font-semibold transition-all flex items-center gap-2 rounded-t-xl ${
            activeTab === 'users'
              ? 'border-b-2 border-primary text-primary bg-primary/5'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <HiUserGroup className="w-5 h-5" />
          Pending Users ({pendingUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-6 py-4 font-semibold transition-all flex items-center gap-2 rounded-t-xl ${
            activeTab === 'posts'
              ? 'border-b-2 border-primary text-primary bg-primary/5'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <HiDocumentText className="w-5 h-5" />
          Pending Posts ({pendingPosts.length})
        </button>
        <button
          onClick={() => setActiveTab('debug')}
          className={`px-6 py-4 font-semibold transition-all flex items-center gap-2 rounded-t-xl ${
            activeTab === 'debug'
              ? 'border-b-2 border-primary text-primary bg-primary/5'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          🔍 Debug
        </button>
      </div>

      {/* Pending Users */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-primary/10 to-secondary/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase flex items-center gap-2">
                    <HiUser className="w-4 h-4" />
                    Username
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    <div className="flex items-center gap-2">
                      <HiMail className="w-4 h-4" />
                      Email
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    <div className="flex items-center gap-2">
                      <HiCalendar className="w-4 h-4" />
                      Joined
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendingUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.date_joined).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleApproveUser(user.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 hover:scale-105 transition-all flex items-center gap-2 shadow-md"
                      >
                        <HiCheckCircle className="w-5 h-5" />
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pendingUsers.length === 0 && (
            <div className="text-center py-12">
              <HiUserGroup className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No pending users</p>
            </div>
          )}
        </div>
      )}

      {/* Pending Posts */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {pendingPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex-1">{post.title}</h3>
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
              <p className="text-gray-600 mb-4 line-clamp-3">{post.description}</p>
              <div className="flex flex-wrap justify-between items-center gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <HiUser className="w-4 h-4" />
                    {post.author_username}
                  </span>
                  {post.calories && (
                    <span className="flex items-center gap-1 text-orange-600 font-semibold">
                      <HiFire className="w-5 h-5" />
                      {post.calories} kcal
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprovePost(post.id)}
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 hover:scale-105 transition-all flex items-center gap-2 shadow-md"
                  >
                    <HiCheckCircle className="w-5 h-5" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleRejectPost(post.id)}
                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 hover:scale-105 transition-all flex items-center gap-2 shadow-md"
                  >
                    <HiXCircle className="w-5 h-5" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
          {pendingPosts.length === 0 && (
            <div className="bg-white rounded-xl shadow-xl p-12 text-center border border-gray-100">
              <HiDocumentText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No pending posts</p>
            </div>
          )}
        </div>
      )}

      {/* Debug Tab */}
      {activeTab === 'debug' && debugInfo && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-2xl font-bold mb-4">🔍 All Posts</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Title</th>
                    <th className="px-4 py-2 text-left">Author</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Public</th>
                    <th className="px-4 py-2 text-left">Approved</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {debugInfo.posts.map((post) => (
                    <tr key={post.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{post.id}</td>
                      <td className="px-4 py-2">{post.title}</td>
                      <td className="px-4 py-2">
                        <a href={`/profile`} className="text-blue-600 hover:underline">
                          {post.author} (ID: {post.author_id})
                        </a>
                      </td>
                      <td className="px-4 py-2">{post.type}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${post.is_public ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {post.is_public ? '✓ Public' : '✗ Private'}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${post.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {post.is_approved ? '✓ Approved' : '⏳ Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleDebugDeletePost(post.id, post.title)}
                          className="text-red-500 hover:text-red-700 hover:scale-110 transition-all p-2"
                          title="Delete post"
                        >
                          <HiTrash className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-2xl font-bold mb-4">👥 All Users</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Username</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Role</th>
                    <th className="px-4 py-2 text-left">Posts</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {debugInfo.users.map((user) => (
                    <tr key={user.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{user.id}</td>
                      <td className="px-4 py-2">{user.username}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {user.is_active ? '✓ Active' : '✗ Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${user.is_staff ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                          {user.is_staff ? '👑 Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-4 py-2">{user.post_count}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleDebugDeleteUser(user.id, user.username)}
                          className="text-red-500 hover:text-red-700 hover:scale-110 transition-all p-2"
                          title="Delete user and all their posts"
                        >
                          <HiTrash className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
