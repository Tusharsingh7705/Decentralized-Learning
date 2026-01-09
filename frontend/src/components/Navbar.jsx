import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Users, LogOut, LayoutDashboard, ChevronDown, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [learnerDropdownOpen, setLearnerDropdownOpen] = useState(false);
  const [providerDropdownOpen, setProviderDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="bg-slate-900 px-5 text-white font-sans">
      <nav className="relative container mx-auto px-6 md:px-10 py-1 border-b border-slate-800 shadow-xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" onClick={closeMobileMenu}>
              <img 
                src="/icon-fav.png" 
                alt="DRSM Icon" 
                className="h-20 w-50 mix-blend-screen cursor-pointer" 
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex flex-grow items-center justify-center space-x-10 lg:space-x-16">
            <Link 
              to="/" 
              className="flex items-center space-x-1 p-2 rounded-lg font-medium hover:text-teal-400 transition-all duration-300 hover:bg-slate-700/50"
            >
              <Home size={20} />
              <span>Home</span>
            </Link>
            <a 
              href={isAuthenticated() && user?.role === 'admin' 
                ? "/admin/dashboard#contact" 
                : "/#contact"}
              className="flex items-center space-x-1 p-2 rounded-lg font-medium hover:text-teal-400 transition-all duration-300 hover:bg-slate-700/50 cursor-pointer"
              onClick={(e) => {
                closeMobileMenu();
                const isAdminDashboard = window.location.pathname === '/admin/dashboard';
                const targetUrl = isAdminDashboard ? '/admin/dashboard#contact' : '/#contact';
                
                // If we're already on the target URL, prevent default and scroll manually
                if (window.location.href.endsWith(targetUrl)) {
                  e.preventDefault();
                  const element = document.getElementById('contact-section');
                  if (element) {
                    const headerOffset = 80;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth'
                    });
                  }
                }
                // For navigation between different pages, let the default behavior happen
              }}
            >
              <Users size={20} />
              <span>Contact</span>
            </a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated() && user ? (
              // User is logged in - Show Dashboard + Logout based on role
              <>
                {user.role === 'provider' && (
                  <Link
                    to="/provider/dashboard"
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-md"
                  >
                    <LayoutDashboard size={18} />
                    <span>Provider Dashboard</span>
                  </Link>
                )}

                {user.role === 'learner' && (
                  <Link
                    to="/learner/dashboard"
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md"
                  >
                    <LayoutDashboard size={18} />
                    <span>Learner Dashboard</span>
                  </Link>
                )}

                {user.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-md"
                  >
                    <LayoutDashboard size={18} />
                    <span>Admin Dashboard</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-md"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              // User is NOT logged in - Show Learner and Provider dropdowns
              <>
                {/* Learner Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setLearnerDropdownOpen(!learnerDropdownOpen);
                      setProviderDropdownOpen(false);
                    }}
                    className="flex items-center space-x-1 px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md"
                  >
                    <span>Learner</span>
                    <ChevronDown size={16} className={`transform transition-transform duration-300 ${learnerDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
                  </button>

                  {learnerDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-xl shadow-2xl py-2 z-50 border border-slate-700">
                      <Link
                        to="/learner/login"
                        onClick={() => setLearnerDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-slate-200 hover:bg-indigo-700 hover:text-white transition-colors duration-200 rounded-lg mx-2"
                      >
                        <LogIn size={16} className="mr-3" />
                        Login
                      </Link>
                      <Link
                        to="/learner/signup"
                        onClick={() => setLearnerDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-slate-200 hover:bg-indigo-700 hover:text-white transition-colors duration-200 rounded-lg mx-2"
                      >
                        <UserPlus size={16} className="mr-3" />
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>

                {/* Provider Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setProviderDropdownOpen(!providerDropdownOpen);
                      setLearnerDropdownOpen(false);
                    }}
                    className="flex items-center space-x-1 px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md"
                  >
                    <span>Provider</span>
                    <ChevronDown size={16} className={`transform transition-transform duration-300 ${providerDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
                  </button>

                  {providerDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-xl shadow-2xl py-2 z-50 border border-slate-700">
                      <Link
                        to="/provider/login"
                        onClick={() => setProviderDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-slate-200 hover:bg-green-700 hover:text-white transition-colors duration-200 rounded-lg mx-2"
                      >
                        <LogIn size={16} className="mr-3" />
                        Login
                      </Link>
                      <Link
                        to="/provider/signup"
                        onClick={() => setProviderDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-slate-200 hover:bg-green-700 hover:text-white transition-colors duration-200 rounded-lg mx-2"
                      >
                        <UserPlus size={16} className="mr-3" />
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 z-50"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <X size={24} className="text-teal-400" />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full bg-slate-900 border-t border-slate-800 shadow-2xl z-40">
            <div className="container mx-auto px-6 py-4 space-y-3">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="flex items-center space-x-2 p-3 rounded-lg font-medium hover:text-teal-400 transition-all duration-300 hover:bg-slate-700/50"
              >
                <Home size={20} />
                <span>Home</span>
              </Link>
              <a
                href="#contact"
                onClick={closeMobileMenu}
                className="flex items-center space-x-2 p-3 rounded-lg font-medium hover:text-teal-400 transition-all duration-300 hover:bg-slate-700/50"
              >
                <Users size={20} />
                <span>Contact</span>
              </a>

              <div className="border-t border-slate-700 pt-3">
                {isAuthenticated() && user ? (
                  // Logged in - Show Dashboard + Logout
                  <>
                    {user.role === 'provider' && (
                      <Link
                        to="/provider/dashboard"
                        onClick={closeMobileMenu}
                        className="flex items-center space-x-2 p-3 rounded-lg text-white font-medium bg-teal-600 hover:bg-teal-700 mb-2"
                      >
                        <LayoutDashboard size={18} />
                        <span>Provider Dashboard</span>
                      </Link>
                    )}

                    {user.role === 'learner' && (
                      <Link
                        to="/learner/dashboard"
                        onClick={closeMobileMenu}
                        className="flex items-center space-x-2 p-3 rounded-lg text-white font-medium bg-indigo-600 hover:bg-indigo-700 mb-2"
                      >
                        <LayoutDashboard size={18} />
                        <span>Learner Dashboard</span>
                      </Link>
                    )}

                    {user.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        onClick={closeMobileMenu}
                        className="flex items-center space-x-2 p-3 rounded-lg text-white font-medium bg-purple-600 hover:bg-purple-700 mb-2"
                      >
                        <LayoutDashboard size={18} />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg text-white font-medium bg-red-600 hover:bg-red-700"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  // Not logged in - Show all auth buttons
                  <>
                    <Link
                      to="/provider/signup"
                      onClick={closeMobileMenu}
                      className="block w-full p-3 rounded-lg text-white font-medium bg-green-600 hover:bg-green-700 mb-2 text-center"
                    >
                      Provider Signup
                    </Link>
                    <Link
                      to="/provider/login"
                      onClick={closeMobileMenu}
                      className="block w-full p-3 rounded-lg text-white font-medium bg-green-700 hover:bg-green-800 mb-2 text-center"
                    >
                      Provider Login
                    </Link>
                    <Link
                      to="/learner/signup"
                      onClick={closeMobileMenu}
                      className="block w-full p-3 rounded-lg text-white font-medium bg-indigo-600 hover:bg-indigo-700 mb-2 text-center"
                    >
                      Learner Signup
                    </Link>
                    <Link
                      to="/learner/login"
                      onClick={closeMobileMenu}
                      className="block w-full p-3 rounded-lg text-white font-medium bg-indigo-700 hover:bg-indigo-800 text-center"
                    >
                      Learner Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
