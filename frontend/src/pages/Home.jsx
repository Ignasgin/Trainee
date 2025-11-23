import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSections } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { HiOutlineCollection, HiArrowRight, HiRefresh, HiPlusCircle, HiInformationCircle } from 'react-icons/hi';
import Modal from '../components/Modal';

export default function Home() {
  const { user } = useAuth();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const response = await getSections();
      console.log('API response:', response.data);
      
      // Handle paginated response
      const data = response.data.results || response.data;
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setSections(data);
      } else {
        console.error('API response is not an array:', response.data);
        setError('Invalid data format from server');
      }
    } catch (err) {
      console.error('Failed to load sections:', err);
      setError(`Failed to load sections: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <HiRefresh className="w-12 h-12 text-primary animate-spin" />
        <div className="text-xl text-gray-600">Loading sections...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800 mb-4 tracking-tight">
          Welcome to Trainee
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          Your nutrition and workout planning platform
        </p>
        
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {user && (
            <Link
              to="/posts/create"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 hover:scale-105 transition-all shadow-lg"
            >
              <HiPlusCircle className="w-6 h-6" />
              Create New Post
            </Link>
          )}
          
          <button
            onClick={() => setShowInfoModal(true)}
            className="inline-flex items-center gap-2 bg-white text-primary border-2 border-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white hover:scale-105 transition-all shadow-lg"
          >
            <HiInformationCircle className="w-6 h-6" />
            About Platform
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Link
            key={section.id}
            to={`/sections/${section.id}`}
            className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-transparent hover:border-primary hover:scale-105"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <HiOutlineCollection className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                  {section.name}
                </h2>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4 line-clamp-3">
              {section.description}
            </p>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <HiOutlineCollection className="w-4 h-4" />
                {section.post_count || 0} posts
              </span>
              <span className="text-primary font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                View Posts
                <HiArrowRight className="w-5 h-5" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {sections.length === 0 && (
        <div className="text-center py-12">
          <HiOutlineCollection className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500">No sections available</p>
        </div>
      )}

      {/* Info Modal */}
      <Modal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title="About Trainee Platform"
        size="xl"
      >
        <div className="space-y-6">
          {/* Hero Image Placeholder with responsive behavior */}
          <div className="w-full overflow-hidden rounded-lg">
            <img 
              src="https://via.placeholder.com/800x400/10b981/ffffff?text=Trainee+Platform"
              alt="Trainee Platform"
              className="w-full h-auto max-w-full object-cover"
              style={{ maxWidth: '100%' }}
            />
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              🎯 Mission
            </h4>
            <p className="text-gray-600">
              Trainee helps users improve their lifestyle by creating, sharing, and using nutrition and workout plans. 
              Build personalized routines, track calories, get recommendations, and engage with a healthy living community.
            </p>

            <h4 className="text-xl font-bold text-gray-800 flex items-center gap-2 mt-6">
              ✨ Key Features
            </h4>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                Create and share meal plans and workout routines
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                Track calories and get personalized recommendations
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                Comment and rate community posts (1-5 stars)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                Moderated content for quality assurance
              </li>
            </ul>

            <h4 className="text-xl font-bold text-gray-800 flex items-center gap-2 mt-6">
              📱 Responsive Design
            </h4>
            <p className="text-gray-600">
              Our platform is fully responsive and works seamlessly on desktop, tablet, and mobile devices. 
              All images use <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">max-width: 100%</code> to ensure 
              they adapt to any screen size without overflowing their containers.
            </p>

            {/* Example Responsive Image */}
            <div className="border-2 border-dashed border-primary/30 rounded-lg p-4 bg-primary/5">
              <p className="text-sm text-gray-600 font-semibold mb-3">📐 Example: Responsive Image Behavior</p>
              <img 
                src="https://via.placeholder.com/600x300/3b82f6/ffffff?text=Responsive+Image+Demo"
                alt="Responsive demo"
                className="w-full max-w-full h-auto rounded-lg shadow-md"
              />
              <p className="text-xs text-gray-500 mt-2 text-center italic">
                This image automatically scales down on smaller screens (max-width: 100%, height: auto)
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
