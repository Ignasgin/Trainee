import { useState, useEffect } from 'react';
import { getPendingUsers, getPendingPosts, approveUser, approvePost } from '../services/api';
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
  HiFire
} from 'react-icons/hi';
import { GiMeal, GiWeightLiftingUp } from 'react-icons/gi';

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
                <button
                  onClick={() => handleApprovePost(post.id)}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 hover:scale-105 transition-all flex items-center gap-2 shadow-md"
                >
                  <HiCheckCircle className="w-5 h-5" />
                  Approve Post
                </button>
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
    </div>
  );
}
