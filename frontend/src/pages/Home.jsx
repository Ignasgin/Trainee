import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSections } from '../services/api';
import { HiOutlineCollection, HiArrowRight, HiRefresh } from 'react-icons/hi';

export default function Home() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your nutrition and workout planning platform
        </p>
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
    </div>
  );
}
