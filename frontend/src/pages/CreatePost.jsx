import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost, getSections } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  HiArrowLeft, 
  HiPlusCircle, 
  HiDocumentText, 
  HiViewList, 
  HiFire, 
  HiLightBulb,
  HiExclamationCircle,
  HiCheckCircle 
} from 'react-icons/hi';
import { GiMeal, GiWeightLiftingUp } from 'react-icons/gi';

export default function CreatePost() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sections, setSections] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'meal',
    section: '',
    calories: '',
    recommendations: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const response = await getSections();
      const data = response.data.results || response.data;
      if (Array.isArray(data)) {
        setSections(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, section: data[0].id }));
        }
      }
    } catch (err) {
      console.error('Failed to load sections:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const postData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        section_id: formData.section,
        is_public: true,  // Make post public by default
        calories: formData.calories ? parseInt(formData.calories) : null,
        recommendations: formData.recommendations || '',
      };
      await createPost(postData);
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error('Create post error:', err.response?.data);
      if (err.response?.data) {
        // Handle different error formats
        let errorMessage = '';
        const errorData = err.response.data;
        
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (typeof errorData === 'object') {
          // Field-specific errors
          errorMessage = Object.entries(errorData)
            .map(([field, messages]) => {
              const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ');
              const errorMsg = Array.isArray(messages) ? messages.join(', ') : messages;
              return `${fieldName}: ${errorMsg}`;
            })
            .join('\n');
        } else {
          errorMessage = String(errorData);
        }
        
        setError(errorMessage || 'Failed to create post. Please check your input.');
      } else {
        setError('Failed to create post. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <HiExclamationCircle className="w-16 h-16 text-red-500" />
        <p className="text-xl text-red-600">You must be logged in to create a post</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl animate-fade-in">
      <button 
        onClick={() => navigate(-1)} 
        className="text-primary hover:text-secondary font-semibold mb-6 inline-flex items-center gap-2 group transition-colors"
      >
        <HiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full mb-4">
            <HiPlusCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800">Create New Post</h1>
          <p className="text-gray-600 mt-2">Share your meal plan or workout routine</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-3 animate-scale-in">
            <HiExclamationCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <pre className="whitespace-pre-wrap text-sm">{error}</pre>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-3 animate-scale-in">
            <HiCheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Post created successfully!</p>
              <p className="text-sm">Your post is pending admin approval. Redirecting...</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <HiDocumentText className="w-5 h-5 text-primary" />
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Enter a catchy title..."
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Type *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'meal' })}
                className={`p-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                  formData.type === 'meal'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-green-300'
                }`}
              >
                <GiMeal className="w-6 h-6" />
                <span className="font-semibold">Meal Plan</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'workout' })}
                className={`p-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                  formData.type === 'workout'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                <GiWeightLiftingUp className="w-6 h-6" />
                <span className="font-semibold">Workout</span>
              </button>
            </div>
          </div>

          {/* Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <HiViewList className="w-5 h-5 text-primary" />
              Section *
            </label>
            <select
              required
              value={formData.section}
              onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            >
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all"
              rows="6"
              placeholder="Describe your meal plan or workout routine in detail..."
            />
          </div>

          {/* Calories */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <HiFire className="w-5 h-5 text-orange-500" />
              Calories (optional)
            </label>
            <input
              type="number"
              value={formData.calories}
              onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="e.g., 500"
              min="0"
            />
          </div>

          {/* Recommendations */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <HiLightBulb className="w-5 h-5 text-yellow-500" />
              Recommendations (optional)
            </label>
            <textarea
              value={formData.recommendations}
              onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all"
              rows="3"
              placeholder="Any tips or recommendations for others..."
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-lg font-semibold hover:opacity-90 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg text-lg"
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating Post...
              </>
            ) : (
              <>
                <HiPlusCircle className="w-6 h-6" />
                Create Post
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
