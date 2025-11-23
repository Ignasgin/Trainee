import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiMenu, HiX, HiHome, HiUser, HiCog, HiLogin, HiLogout, HiUserAdd } from 'react-icons/hi';

export default function Header() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="bg-gradient-to-r from-primary to-secondary text-white shadow-lg relative z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold hover:opacity-90 transition flex items-center gap-2">
            🏋️ Trainee
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-accent transition flex items-center gap-2">
              <HiHome className="text-xl" />
              Home
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="hover:text-accent transition flex items-center gap-2">
                  <HiUser className="text-xl" />
                  Profile ({user.username})
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="hover:text-accent transition flex items-center gap-2">
                    <HiCog className="text-xl" />
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center gap-2"
                >
                  <HiLogout className="text-xl" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-accent transition flex items-center gap-2"
                >
                  <HiLogin className="text-xl" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center gap-2"
                >
                  <HiUserAdd className="text-xl" />
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden text-white hover:text-accent transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <HiX className="w-7 h-7" />
            ) : (
              <HiMenu className="w-7 h-7" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Slide-in Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gradient-to-b from-primary to-secondary shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Close button */}
          <div className="flex justify-end p-4">
            <button
              onClick={closeMobileMenu}
              className="text-white hover:text-accent transition-colors"
              aria-label="Close menu"
            >
              <HiX className="w-7 h-7" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex flex-col space-y-4 px-6 py-4">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="text-white hover:text-accent transition flex items-center gap-3 text-lg py-2"
            >
              <HiHome className="text-2xl" />
              Home
            </Link>
            
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="text-white hover:text-accent transition flex items-center gap-3 text-lg py-2"
                >
                  <HiUser className="text-2xl" />
                  Profile ({user.username})
                </Link>
                
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={closeMobileMenu}
                    className="text-white hover:text-accent transition flex items-center gap-3 text-lg py-2"
                  >
                    <HiCog className="text-2xl" />
                    Admin Panel
                  </Link>
                )}
                
                <button
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                  className="bg-white text-primary px-4 py-3 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center gap-3 text-lg justify-center mt-4"
                >
                  <HiLogout className="text-2xl" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="text-white hover:text-accent transition flex items-center gap-3 text-lg py-2"
                >
                  <HiLogin className="text-2xl" />
                  Login
                </Link>
                
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="bg-white text-primary px-4 py-3 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center gap-3 text-lg justify-center mt-4"
                >
                  <HiUserAdd className="text-2xl" />
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={closeMobileMenu}
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
          style={{ zIndex: -1 }}
        />
      )}
    </header>
  );
}
