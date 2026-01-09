import React from 'react';
import { Twitter, Linkedin, Github, Users } from 'lucide-react';

const Footer = () => (
  
    <footer className="bg-gray-900 text-gray-300 py-16">
      <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-500"></div>
                  
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Users className="w-8 h-8 text-blue-500" />
              <h3 className="text-xl font-bold text-white">DRSM</h3>
            </div>
            <p className="text-sm">
              Empowering the next generation of learners and educators through a decentralized, transparent, and secure platform.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-blue-500 transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-blue-500 transition-colors">How It Works</a></li>
              <li><a href="#blockchain-info" className="hover:text-blue-500 transition-colors">Why Blockchain?</a></li>
              <li><a href="#testimonials" className="hover:text-blue-500 transition-colors">Testimonials</a></li>
            </ul>
          </div>

          {/* Resources/Community Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Community</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-500 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Community Forum</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a
  href="https://leetcode.com/u/Tushar_Singh77/"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="LeetCode"
  className="hover:text-yellow-500 transition-colors"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
  >
    <path d="M16.53 3.06a1 1 0 0 1 1.41 1.41l-7.07 7.07 7.07 7.07a1 1 0 0 1-1.41 1.41l-7.78-7.78a1 1 0 0 1 0-1.41l7.78-7.77zM9 21a1 1 0 1 1 0-2h9a1 1 0 1 1 0 2H9z" />
  </svg>
</a>

              <a href="https://www.linkedin.com/in/tushar-singh-1b816a326/" aria-label="LinkedIn" className="hover:text-blue-500 transition-colors">
                <Linkedin />
              </a>
              <a href="https://github.com/Tusharsingh7705" aria-label="GitHub" className="hover:text-blue-500 transition-colors">
                <Github />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-500">
          &copy; 2026 Web3Ed. All rights reserved.
        </div>
      </div>
    </footer>
);

export default Footer;
