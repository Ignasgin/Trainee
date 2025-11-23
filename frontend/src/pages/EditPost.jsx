import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPost, updatePost, getSections } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  HiArrowLeft, 
  HiSave, 
  HiDocumentText, 
  HiViewList, 
  HiFire, 
  HiLightBulb,
  HiExclamationCircle,
  HiCheckCircle 
} from 'react-icons/hi';
import { GiMeal, GiWeightLiftingUp } from 'react-icons/gi';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sections, setSections] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'meal',
    section_id: '',
    calories: '',
    recommendations: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadPostAndSections();
  }, [id]);

  const loadPostAndSections = async () => {
    try {
      const [postRes, sectionsRes] = await Promise.all([
        getPost(id),
        getSections(),
      ]);
      
      const post = postRes.data;
      
      setFormData({
        title: post.title || '',
        description: post.description || '',
        type: post.type || 'meal',
        section_id: post.section?.id || '',
        calories: post.calories || '',
        recommendations: post.recommendations || '',
      });
      
      const sectionsData = sectionsRes.data.results || sectionsRes.data;
      if (Array.isArray(sectionsData)) {
        setSections(sectionsData);
      }
    } catch (err) {
      console.error('Failed to load post:', err);
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        section_id: formData.section_id,
        calories: formData.calories ? parseInt(formData.calories) : null,
        recommendations: formData.recommendations || '',
      };
      
      await updatePost(id, updateData);
      setSuccess(true);
      setTimeout(() => navigate(`/posts/${id}`), 1500);
    } catch (err) {
      console.error('Update post error:', err.response?.data);
      if (err.response?.data) {
        let errorMessage = '';
        const errorData = err.response.data;
        
        if (errorData.details && typeof errorData.details === 'object') {
          errorMessage = Object.entries(errorData.details)
            .map(([field, messages]) => {
              const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ');
              const errorMsg = Array.isArray(messages) ? messages.join(', ') : messages;
              return `${fieldName}: ${errorMsg}`;
            })
            .join('\n');
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (typeof errorData === 'object') {
          errorMessage = Object.entries(errorData)
            .filter(([key]) => key !== 'error' && key !== 'message')
            .map(([field, messages]) => {
              const fieldName = field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ');
              const errorMsg = Array.isArray(messages) ? messages.join(', ') : messages;
              return `${fieldName}: ${errorMsg}`;
            })
            .join('\n');
        } else {
          errorMessage = String(errorData);
        }
        
        setError(errorMessage || 'Failed to update post. Please check your input.');
      } else {
        setError('Failed to update post. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <div className="text-xl text-gray-600">Loading post...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <HiExclamationCircle className="w-16 h-16 text-red-500" />
        <p className="text-xl text-red-600">You must be logged in to edit a post</p>
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
            <HiDocumentText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800">Edit Post</h1>
          <p className="text-gray-600 mt-2">Update your meal plan or workout routine</p>
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
              <p className="font-semibold">Post updated successfully!</p>
              <p className="text-sm">Redirecting...</p>
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
              value={formData.section_id}
              onChange={(e) => setFormData({ ...formData, section_id: e.target.value })}
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
            disabled={saving || success}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-lg font-semibold hover:opacity-90 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg text-lg"
          >
            {saving ? (
              <>
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <HiSave className="w-6 h-6" />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
