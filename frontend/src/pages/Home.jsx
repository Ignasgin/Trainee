import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSections } from '../services/api';

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
      setSections(response.data);
    } catch (err) {
      setError('Failed to load sections');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
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
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Trainee
        </h1>
        <p className="text-xl text-gray-600">
          Your nutrition and workout planning platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Link
            key={section.id}
            to={`/sections/${section.id}`}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border-2 border-transparent hover:border-primary"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              {section.name}
            </h2>
            <p className="text-gray-600 mb-4">
              {section.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {section.post_count || 0} posts
              </span>
              <span className="text-primary font-semibold">
                View Posts →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {sections.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">No sections available</p>
        </div>
      )}
    </div>
  );
}
