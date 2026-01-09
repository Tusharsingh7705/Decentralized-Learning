import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { motion, useInView, useAnimation } from 'framer-motion';
import { 
  ChevronRight, 
  ArrowRight, 
  Wallet, 
  Shield, 
  Users, 
  Globe, 
  Book, 
  Handshake, 
  Briefcase, 
  Star, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  ArrowUpRight,
  UserPlus,
  Search,
  CreditCard,
  MonitorPlay,
  Award,
  CheckCircle2,
  Lock,
  Database,
  Quote,
  User,
  Check,
  ArrowLeft,
  ArrowRight as ArrowRightIcon
} from 'lucide-react';

// Main App component which acts as the landing page
const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Handle scroll to top on initial load and hash-based navigation
  useEffect(() => {
    // Function to handle scroll to top
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    };

    // Handle hash-based scrolling
    const handleHash = () => {
      if (window.location.hash) {
        const element = document.querySelector(window.location.hash);
        if (element) {
          // Small delay to ensure the DOM is ready
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      } else {
        // If no hash, scroll to top with smooth behavior
        scrollToTop();
      }
    };

    // Check if this is a page refresh
    const isPageRefresh = performance.navigation.type === performance.navigation.TYPE_RELOAD || 
                         performance.getEntriesByType('navigation')[0]?.type === 'reload';

    if (isPageRefresh) {
      // On refresh, always scroll to top
      scrollToTop();
    } else {
      // On normal navigation, handle hash if present
      handleHash();
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleHash);
    
    // Cleanup
    return () => {
      window.removeEventListener('hashchange', handleHash);
    };
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dummy data for the sections
  const features = [
    {
      icon: <Book className="w-12 h-12 text-blue-500" />,
      title: "Decentralized Learning",
      description: "Connect directly with educators and learners without intermediaries. Browse courses, share knowledge, and earn certifications on a transparent platform."
    },
    {
      icon: <Handshake className="w-12 h-12 text-blue-500" />,
      title: "Secure Escrow",
      description: "All transactions are secured by smart contracts. Funds are held in escrow and automatically released upon successful course completion, ensuring trust and security for everyone."
    },
    {
      icon: <Briefcase className="w-12 h-12 text-blue-500" />,
      title: "Immutable Records",
      description: "All course completions and certifications are recorded on the blockchain. This provides a tamper-proof and verifiable record of your skills and achievements."
    },
    {
      icon: <Globe className="w-12 h-12 text-blue-500" />,
      title: "Global Marketplace",
      description: "Join a worldwide community. The platform is accessible to anyone with an internet connection, breaking down geographical barriers to education and skill development."
    },
  ];

  const howItWorksSteps = {
    learner: [
      { step: 1, title: "Browse & Select", description: "Explore courses from a global network of providers." },
      { step: 2, title: "Engage & Learn", description: "Participate in courses and interact directly with providers." },
      { step: 3, title: "Certify & Pay", description: "Complete the course, automatically release funds, and get a blockchain-verified certificate." }
    ],
    provider: [
      { step: 1, title: "Create & Offer", description: "Set up your course, content, and pricing on the platform." },
      { step: 2, title: "Teach & Interact", description: "Deliver your course material and engage with learners." },
      { step: 3, title: "Earn & Grow", description: "Receive your funds automatically upon course completion and build your reputation." }
    ],
    admin: [
      { step: 1, title: "Govern & Oversee", description: "Participate in the decentralized governance of the platform." },
      { step: 2, title: "Review & Validate", description: "Help validate and verify new courses and provider credentials." },
      { step: 3, title: "Contribute & Earn", description: "Contribute to the network's health and get rewarded for your efforts." }
    ]
  };

  const testimonials = [
    {
      name: "Alex P.",
      text: "This platform is a game-changer for online education. The transparency and security of blockchain gave me complete peace of mind. I've learned so much!",
      role: "Blockchain Developer",
      rating: 5
    },
    {
      name: "Samantha C.",
      text: "As an educator, I love the direct connection with my students. I get to set my own prices and the escrow system ensures I'm always paid fairly for my work.",
      role: "Instructor",
      rating: 5
    },
    {
      name: "Jordan T.",
      text: "The blockchain certificate is a fantastic feature. I can easily share my verified skills with potential employers, and they know it's a legitimate qualification.",
      role: "Student",
      rating: 4
    },
    {
      name: "Maria G.",
      text: "The platform's user interface is incredibly intuitive. I was able to find and enroll in courses within minutes. The learning experience is seamless!",
      role: "UX Designer",
      rating: 5
    },
    {
      name: "David K.",
      text: "As a course creator, I appreciate the fair revenue sharing model. The smart contracts handle everything automatically, so I can focus on creating quality content.",
      role: "Content Creator",
      rating: 5
    },
    {
      name: "Priya M.",
      text: "The community aspect is amazing. I've connected with like-minded learners and we've formed study groups to enhance our learning experience together.",
      role: "Student",
      rating: 5
    }
  ];

  // Component definitions within the main App component
  // About Modal Component
  const AboutModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    
    return (
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">About Our Platform</h3>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6 text-gray-700">
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-gray-900">Welcome to Our Decentralized Learning Platform</h4>
                <p>
                  Our platform leverages blockchain technology to create a transparent, secure, and accessible marketplace for knowledge sharing and acquisition. 
                  Whether you're a learner seeking new skills or an expert looking to share your knowledge, our platform provides the tools you need.
                </p>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-gray-900">Key Features</h4>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Decentralized course marketplace with transparent pricing</li>
                  <li>Secure blockchain-based certification</li>
                  <li>Smart contract-powered transactions</li>
                  <li>Peer-to-peer learning opportunities</li>
                  <li>Verifiable credentials on the blockchain</li>
                </ul>
              </div>
              
              <div className="space-y-6">
                <h4 className="text-2xl font-bold text-gray-900">Our Platform Pipeline</h4>
                
                {/* Pipeline Steps */}
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200 transform -translate-x-1/2"></div>
                  
                  {[
                    {
                      icon: <UserPlus className="w-6 h-6 text-white" />,
                      title: '1. User Registration',
                      description: 'Create your account as a Learner or Content Provider',
                      details: [
                        'Secure wallet-based authentication',
                        'Role-based access control',
                        'Profile customization'
                      ]
                    },
                    {
                      icon: <Search className="w-6 h-6 text-white" />,
                      title: '2. Course Discovery',
                      description: 'Browse and select from various courses',
                      details: [
                        'Advanced search and filters',
                        'Course ratings and reviews',
                        'Preview course content'
                      ]
                    },
                    {
                      icon: <CreditCard className="w-6 h-6 text-white" />,
                      title: '3. Secure Enrollment',
                      description: 'Enroll using blockchain transactions',
                      details: [
                        'Smart contract-based enrollment',
                        'Cryptocurrency payments',
                        'Transparent fee structure'
                      ]
                    },
                    {
                      icon: <MonitorPlay className="w-6 h-6 text-white" />,
                      title: '4. Interactive Learning',
                      description: 'Access course materials and resources',
                      details: [
                        'Video lectures and quizzes',
                        'Interactive coding environment',
                        'Peer discussion forums'
                      ]
                    },
                    {
                      icon: <Award className="w-6 h-6 text-white" />,
                      title: '5. Certification',
                      description: 'Earn verifiable credentials',
                      details: [
                        'Blockchain-based certificates',
                        'NFT badges for achievements',
                        'Shareable on professional networks'
                      ]
                    },
                    {
                      icon: <Users className="w-6 h-6 text-white" />,
                      title: '6. Community & Support',
                      description: 'Join our learning community',
                      details: [
                        'Mentorship programs',
                        'Live Q&A sessions',
                        'Career support services'
                      ]
                    }
                  ].map((step, index) => (
                    <div key={index} className="relative pl-12 pb-8 group">
                      {/* Timeline dot */}
                      <div className="absolute left-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center transform -translate-x-1/2 group-hover:scale-110 transition-transform duration-200 z-10">
                        {step.icon}
                      </div>
                      
                      {/* Content */}
                      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <h5 className="text-lg font-semibold text-gray-900 mb-1">{step.title}</h5>
                        <p className="text-gray-600 mb-3">{step.description}</p>
                        <ul className="space-y-1.5">
                          {step.details.map((detail, i) => (
                            <li key={i} className="flex items-start">
                              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                              <span className="text-sm text-gray-600">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const HeroSection = () => {
    const navigate = useNavigate();
    const controls = useAnimation();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    useEffect(() => {
      if (isInView) {
        controls.start('visible');
      }
    }, [controls, isInView]);
    
    const container = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.3
        }
      }
    };
    
    const item = {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          type: 'spring',
          stiffness: 100,
          damping: 10
        }
      }
    };
    
    const buttonHover = {
      scale: 1.05,
      transition: { type: 'spring', stiffness: 400, damping: 10 }
    };
    
    const buttonTap = {
      scale: 0.98
    };
    
    const handleGetStarted = () => {
      navigate('/learner/login');
    };
    
    const handleLearnMore = () => {
      setIsModalOpen(true);
    };
    
    const closeModal = () => {
      setIsModalOpen(false);
    };
    
    return (
      <div ref={ref} className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white min-h-screen flex items-center justify-center p-8 overflow-hidden">
        {/* Animated background elements */}
        <motion.div 
          className="absolute inset-0 bg-grid-white/[0.05]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        
        <div className="container mx-auto text-center z-10">
          <motion.div
            variants={container}
            initial="hidden"
            animate={controls}
            className="space-y-8"
          >
            <motion.h1 
              variants={item}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300"
            >
              Empowering Education on the Blockchain
            </motion.h1>
            
            <motion.p 
              variants={item}
              className="text-lg sm:text-xl lg:text-2xl font-light mb-8 text-gray-300 max-w-3xl mx-auto"
            >
              A decentralized marketplace for knowledge, powered by Web3.
            </motion.p>
            
            <motion.div 
              variants={item}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <motion.button 
                onClick={handleGetStarted}
                whileHover={buttonHover}
                whileTap={buttonTap}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-4 px-8 rounded-full shadow-lg flex items-center justify-center mx-auto sm:mx-0 space-x-2"
              >
                <span>Get Started</span>
                <ChevronRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button 
                onClick={handleLearnMore}
                whileHover={buttonHover}
                whileTap={buttonTap}
                className="bg-transparent border-2 border-white/20 hover:border-white/40 text-white font-semibold py-4 px-8 rounded-full shadow-lg hover:bg-white/5 transition-all duration-300 flex items-center justify-center mx-auto sm:mx-0 space-x-2"
              >
                <span>Learn More</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <AboutModal isOpen={isModalOpen} onClose={closeModal} />
            </motion.div>
          </motion.div>
          
          {/* Floating animated elements */}
          <motion.div 
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full filter blur-3xl -z-10"
            animate={{
              x: [0, 20, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut'
            }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-cyan-500/10 rounded-full filter blur-3xl -z-10"
            animate={{
              x: [0, -20, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
              delay: 1
            }}
          />
        </div>
      </div>
    );
  };
  
  const BlogSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });
    
    const container = {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.3
        }
      }
    };
    
    const item = {
      hidden: { y: 20, opacity: 0 },
      show: { 
        y: 0, 
        opacity: 1,
        transition: {
          type: 'spring',
          stiffness: 100,
          damping: 10
        }
      }
    };
    
    const blogPosts = [
      {
        id: 1,
        title: 'The Future of Decentralized Education',
        excerpt: 'Exploring how blockchain technology is revolutionizing the way we learn and verify knowledge.',
        category: 'Blockchain',
        date: 'Jan 5, 2024',
        readTime: '5 min read'
      },
      {
        id: 2,
        title: 'Smart Contracts for Course Creators',
        excerpt: 'How educators can leverage smart contracts to create transparent and fair revenue models.',
        category: 'Education',
        date: 'Dec 20, 2023',
        readTime: '4 min read'
      },
      {
        id: 3,
        title: 'NFT Certificates: The New Standard',
        excerpt: 'Why verifiable digital credentials are becoming essential in the modern job market.',
        category: 'Technology',
        date: 'Dec 10, 2023',
        readTime: '6 min read'
      }
    ];
    
    return (
      <section id="blog" ref={ref} className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-blue-100 text-blue-600 text-sm font-semibold px-3 py-1 rounded-full mb-4">
              Insights & Updates
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Latest from Our Blog</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest trends and insights in decentralized education and blockchain technology.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            animate={isInView ? 'show' : 'hidden'}
          >
            {blogPosts.map((post) => (
              <motion.article 
                key={post.id}
                variants={item}
                whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
              >
                <div className="h-48 bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-white text-4xl font-bold">
                  {post.id}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4 flex-1">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">{post.readTime}</span>
                    <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center group">
                      Read more
                      <ArrowUpRight className="ml-1 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
          
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
              View All Articles
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>
    );
  };

  const Features = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });
    const controls = useAnimation();

    useEffect(() => {
      if (isInView) {
        controls.start('visible');
      }
    }, [controls, isInView]);

    const container = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.3
        }
      }
    };

    const item = {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          type: 'spring',
          stiffness: 100,
          damping: 10
        }
      },
      hover: {
        y: -10,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }
    };

    return (
      <section id="features" ref={ref} className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6 text-center">
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Core Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Our platform is built to provide a secure, transparent, and user-centric learning experience.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={container}
            initial="hidden"
            animate={controls}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={item}
                whileHover="hover"
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center"
              >
                <motion.div 
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white mb-6"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {React.cloneElement(feature.icon, { className: 'w-8 h-8' })}
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-500">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    );
  };

  const HowItWorks = () => {
    const [activeTab, setActiveTab] = useState('learner');
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });
    const controls = useAnimation();

    useEffect(() => {
      if (isInView) {
        controls.start('visible');
      }
    }, [controls, isInView]);

    const container = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.3
        }
      }
    };

    const item = {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          type: 'spring',
          stiffness: 100,
          damping: 10
        }
      },
      hover: {
        y: -5,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
      }
    };

    const tabVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 20
        }
      }
    };

    const renderSteps = (steps) => (
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {steps.map((step, index) => (
          <motion.div 
            key={index} 
            variants={item}
            whileHover="hover"
            className="flex flex-col items-center text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:border-blue-100 transition-all duration-300"
          >
            <motion.div 
              className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 text-white flex items-center justify-center rounded-2xl text-2xl font-bold mb-6 shadow-lg"
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {step.step}
            </motion.div>
            <h4 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h4>
            <p className="text-gray-500">{step.description}</p>
          </motion.div>
        ))}
      </motion.div>
    );

    const tabs = [
      { id: 'learner', label: 'For Learners' },
      { id: 'provider', label: 'For Providers' },
      { id: 'admin', label: 'For Admins' }
    ];

    return (
      <section id="how-it-works" ref={ref} className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              Our Process
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              A simple, transparent process tailored for every type of user in our ecosystem.
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-wrap justify-center mb-12 gap-2"
            variants={container}
            initial="hidden"
            animate={controls}
          >
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full -z-10"
                    initial={false}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 30
                    }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>

          <motion.div 
            className="p-8 bg-white rounded-3xl shadow-xl border border-gray-100"
            variants={tabVariants}
            key={activeTab}
            initial="hidden"
            animate="visible"
          >
            {activeTab === 'learner' && renderSteps(howItWorksSteps.learner)}
            {activeTab === 'provider' && renderSteps(howItWorksSteps.provider)}
            {activeTab === 'admin' && renderSteps(howItWorksSteps.admin)}
          </motion.div>
        </div>
      </section>
    );
  };

  const BlockchainInfo = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });
    
    const container = {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.2,
          delayChildren: 0.3
        }
      }
    };

    const item = {
      hidden: { y: 30, opacity: 0 },
      show: {
        y: 0,
        opacity: 1,
        transition: {
          type: 'spring',
          stiffness: 100,
          damping: 15
        }
      },
      hover: {
        y: -5,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }
    };

    const features = [
      {
        icon: <Shield className="w-12 h-12 text-white" />,
        title: 'Secure Escrow',
        description: 'Smart contracts hold funds securely, only releasing them once predefined conditions are met. This eliminates the need for a central authority and protects both learners and providers.',
        gradient: 'from-purple-500 to-indigo-600'
      },
      {
        icon: <Wallet className="w-12 h-12 text-white" />,
        title: 'Transparent Transactions',
        description: 'All transactions are recorded on the blockchain, providing a transparent and immutable ledger that ensures trust between all parties.',
        gradient: 'from-blue-500 to-cyan-500'
      },
      {
        icon: <Lock className="w-12 h-12 text-white" />,
        title: 'Data Security',
        description: 'Your data is encrypted and stored securely on the blockchain, giving you full control over your personal information and learning achievements.',
        gradient: 'from-green-500 to-emerald-500'
      },
      {
        icon: <Database className="w-12 h-12 text-white" />,
        title: 'Decentralized Storage',
        description: 'Course materials and certificates are stored across a distributed network, ensuring they remain accessible and tamper-proof.',
        gradient: 'from-amber-500 to-orange-500'
      }
    ];

    return (
      <section id="blockchain-info" ref={ref} className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-gradient-to-r from-purple-100 to-blue-100 text-purple-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              Blockchain Technology
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Blockchain?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              We leverage blockchain technology to create a transparent, secure, and efficient learning ecosystem.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={container}
            initial="hidden"
            animate={isInView ? 'show' : 'hidden'}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={item}
                whileHover="hover"
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 overflow-hidden relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className={`absolute -top-6 -right-6 w-32 h-32 rounded-full bg-gradient-to-br ${feature.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                
                <motion.div 
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 relative z-10`}
                  whileHover={{ rotate: 5, scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {feature.icon}
                </motion.div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-3 relative z-10">{feature.title}</h3>
                <p className="text-gray-500 relative z-10">{feature.description}</p>
                
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="mt-16 p-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl text-white text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-4">Ready to experience the future of learning?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of learners and educators who are already benefiting from our blockchain-powered platform.
            </p>
            <button className="bg-white text-blue-600 hover:bg-blue-10 font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
              Get Started Today
            </button>
          </motion.div>
        </div>
      </section>
    );
  };

  const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isHovering, setIsHovering] = useState(false);
    const sliderRef = useRef(null);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });
    const controls = useAnimation();
    const containerRef = useRef(null);

    // Color theme
    const colors = {
      primary: {
        light: '#94492eff',  // Darker blue
        dark: '#304580bb',   // Even darker blue for hover states
        gradient: 'from-blue-700 to-blue-900', // Darker gradient
        text: '#1eaf7aff'    // Dark blue text
      },
      secondary: {
        light: '#0ea5e9',  // Brighter blue for accents
        dark: '#14709eff',   // Darker blue for hover states
        gradient: 'from-cyan-600 to-blue-700' // Darker cyan-blue gradient
      },
      background: {
        light: '#f8fafc',  // Lighter background
        dark: '#f1f5f9',   // Slightly darker background
        card: '#ffffff'    // White cards for contrast
      },
      text: {
        primary: '#1e293b',   // Dark slate for main text
        secondary: '#475569', // Slightly lighter slate for secondary text
        light: '#64748b'      // Even lighter for subtle text
      },
      border: {
        light: '#e2e8f0',     // Light border
        dark: '#cbd5e1'       // Slightly darker border
      }
    };

    // Calculate visible items based on screen size
    const [visibleItems, setVisibleItems] = useState(1);
    
    useEffect(() => {
      const updateVisibleItems = () => {
        const width = window.innerWidth;
        if (width >= 1280) {
          setVisibleItems(3);
        } else if (width >= 768) {
          setVisibleItems(2);
        } else {
          setVisibleItems(1);
        }
      };

      updateVisibleItems();
      window.addEventListener('resize', updateVisibleItems);
      return () => window.removeEventListener('resize', updateVisibleItems);
    }, []);

    // Auto-advance testimonials with smooth timing
    useEffect(() => {
      if (!isAutoPlaying || isHovering) return;
      
      const timer = setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % Math.ceil(testimonials.length / visibleItems));
      }, 6000); // Increased timing for better readability
      
      return () => clearTimeout(timer);
    }, [currentIndex, isAutoPlaying, isHovering, testimonials.length, visibleItems]);

    // Handle smooth scroll to current index
    useEffect(() => {
      if (!sliderRef.current) return;
      
      const scrollToItem = () => {
        if (!sliderRef.current) return;
        
        const container = sliderRef.current;
        const itemWidth = container.scrollWidth / testimonials.length;
        const scrollPosition = currentIndex * itemWidth * visibleItems;
        
        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      };
      
      scrollToItem();
    }, [currentIndex, visibleItems, testimonials.length]);

    useEffect(() => {
      if (isInView) {
        controls.start('visible');
      }
    }, [controls, isInView]);

    const container = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2
        }
      }
    };

    const item = {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          type: 'spring',
          stiffness: 120,
          damping: 15,
          mass: 0.5
        }
      },
      hover: {
        y: -5,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }
    };

    const nextTestimonial = () => {
      const maxIndex = Math.ceil(testimonials.length / visibleItems) - 1;
      setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
      setIsAutoPlaying(false);
      setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const prevTestimonial = () => {
      const maxIndex = Math.ceil(testimonials.length / visibleItems) - 1;
      setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
      setIsAutoPlaying(false);
      setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    // Handle keyboard navigation
    useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key === 'ArrowRight') nextTestimonial();
        if (e.key === 'ArrowLeft') prevTestimonial();
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [visibleItems]);

    // Handle touch events for mobile swipe
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const handleTouchStart = (e) => {
      setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
      setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
      if (touchStart - touchEnd > 50) {
        nextTestimonial();
      }
      if (touchStart - touchEnd < -50) {
        prevTestimonial();
      }
    };

    // Render star rating component
    const renderStars = (rating) => {
      return (
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-5 h-5 ${star <= rating ? 'text-amber-400 fill-current' : 'text-gray-200'}`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-500">{rating}.0</span>
        </div>
      );
    };

    // Calculate visible testimonials
    const visibleTestimonials = [...testimonials, ...testimonials.slice(0, visibleItems - 1)];

    return (
      <section 
        id="testimonials" 
        ref={ref} 
        className={`py-20 bg-gradient-to-b ${colors.primary.gradient} overflow-hidden`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div 
            className="text-center mb-16 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className={`inline-block bg-opacity-20 bg-white text-black text-sm font-semibold px-4 py-1.5 rounded-full mb-4 backdrop-blur-sm`}>
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Trusted by Thousands</h2>
            <p className="text-blue-100 max-w-2xl mx-auto text-lg">
              Join our community of satisfied learners and educators who are transforming education
            </p>
          </motion.div>

          <div 
            className="relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div 
              ref={sliderRef}
              className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {visibleTestimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className={`flex-shrink-0 px-3 w-full ${
                    visibleItems === 3 ? 'md:w-1/3' : 
                    visibleItems === 2 ? 'md:w-1/2' : 'w-full'
                  }`}
                  style={{
                    minWidth: `calc(${100 / visibleItems}% - 1.5rem)`,
                    scrollSnapAlign: 'start'
                  }}
                >
                  <motion.div 
                    className="h-full bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl border border-opacity-10 border-white transition-all duration-300 flex flex-col backdrop-blur-sm"
                    style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}
                    whileHover={{
                      y: -5,
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                      borderColor: 'rgba(59, 130, 246, 0.3)'
                    }}
                  >
                    <div className="mb-6">
                      {renderStars(testimonial.rating)}
                    </div>
                    
                    <Quote className="w-8 h-8 text-blue-300 mb-6" />
                    
                    <p className="text-gray-700 text-lg leading-relaxed mb-8 flex-grow">
                      "{testimonial.text}"
                    </p>
                    
                    <div className="flex items-center space-x-4 mt-auto pt-4 border-t border-gray-100">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                        <User className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-800 text-lg">{testimonial.name}</p>
                        <p className="text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <button 
              onClick={prevTestimonial}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -ml-6 w-12 h-12 rounded-full bg-white bg-opacity-90 shadow-lg items-center justify-center text-blue-700 hover:bg-white hover:text-blue-800 transition-all duration-200 z-10 group backdrop-blur-sm"
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
            
            <button 
              onClick={nextTestimonial}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 -mr-6 w-12 h-12 rounded-full bg-blue-700 text-white shadow-lg items-center justify-center hover:bg-blue-800 hover:scale-105 transition-all duration-200 z-10 group"
              aria-label="Next testimonial"
            >
              <ArrowRightIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Pagination Dots */}
          <motion.div 
            className="flex justify-center space-x-2 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {Array.from({ length: Math.ceil(testimonials.length / visibleItems) }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsAutoPlaying(false);
                  setTimeout(() => setIsAutoPlaying(true), 10000);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-blue-600 w-8' 
                    : 'bg-gray-200 w-3 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
                aria-current={index === currentIndex ? 'true' : 'false'}
              />
            ))}
          </motion.div>
        </div>

        <style jsx>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .snap-x {
            scroll-snap-type: x mandatory;
          }
          .snap-mandatory {
            scroll-snap-stop: always;
          }
        `}</style>
      </section>
    );
  };

  const CTASection = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6 text-center z-10">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your SkillVerse Education Journey?</h2>
          <p className="text-lg mb-8">
            Join thousands of learners and providers building the future of education.
          </p>
          <div className="relative inline-block">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 flex items-center mx-auto"
            >
              Join the Movement
              <ChevronRight className={`ml-2 w-5 h-5 transition-transform ${isOpen ? 'transform rotate-90' : ''}`} />
            </button>
            {isOpen && (
              <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                <div className="py-1">
                  <button
                    onClick={() => {
                      navigate('/learner/signup');
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    Join as Learner
                  </button>
                  <button
                    onClick={() => {
                      navigate('/provider/signup');
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    Join as Provider
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ContactSection = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setSubmitStatus({ success: false, message: '' });

      try {
        // Basic form validation
        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
          setSubmitStatus({ success: false, message: 'Please fill in all required fields' });
          return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          setSubmitStatus({ success: false, message: 'Please enter a valid email address' });
          return;
        }

        // Initialize EmailJS with your public key
        await emailjs.init('SWmkpZsA2dci4_kln');

        // Send the email
        const response = await emailjs.send(
          'service_mmi4bv6',     // Your service ID
          'template_3b38gw5',    // Your template ID
          {
            from_name: formData.name,
            from_email: formData.email,
            message: formData.message,
            reply_to: formData.email
          }
        );

        if (response.status === 200) {
          setSubmitStatus({ 
            success: true, 
            message: 'Thank you for your message! I will get back to you soon.' 
          });
          // Reset form
          setFormData({ name: '', email: '', message: '' });
        }
      } catch (error) {
        console.error('Error sending email:', error);
        setSubmitStatus({ 
          success: false, 
          message: 'Failed to send message. Please try again later.' 
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions or need assistance? Our team is here to help you with any inquiries.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Side - Contact Information */}
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Call Us</h3>
                  <p className="text-gray-600 mt-1">+91 7705958388</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Visit Us</h3>
                  <p className="text-gray-600 mt-1">Greater Noida, Uttar Pradesh, 201308</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Working Hours</h3>
                  <p className="text-gray-600 mt-1">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
            
            {/* Right Side - Contact Form */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Email Us</h3>
              <p className="text-gray-600 mb-6">tusharsingh7705@gmail.com</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your message here..."
                  ></textarea>
                </div>
                
                <div className="flex items-center justify-between">
                  {submitStatus.message && (
                    <p className={`text-sm ${submitStatus.success ? 'text-green-600' : 'text-red-600'}`}>
                      {submitStatus.message}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
              
              {/* <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Call Us</h3>
                  <p className="text-gray-600 mt-1">+91 7705958388</p>
                </div>
              </div> */}
              
              {/* <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Visit Us</h3>
                  <p className="text-gray-600 mt-1">Greater Noida, Uttar Pradesh, 201308</p>
                </div>
              </div> */}
              
              {/* <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Working Hours</h3>
                  <p className="text-gray-600 mt-1">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
                </div>
              </div> */}
            </div>
            
            {/* <div className="bg-gray-50 p-8 rounded-2xl shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Your name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="How can we help you?"
                    required
                  ></textarea>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full ${
                      isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                    } text-white font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed`}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    We'll get back to you within 24 hours
                  </p>
                </div>
              </form>
            </div> */}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
          body { font-family: 'Inter', sans-serif; }
          .animate-fade-in-up {
            animation: fadeInUp 1s ease-out forwards;
          }
          .animate-fade-in-up-delay-1 {
            animation: fadeInUp 1s ease-out 0.5s forwards;
          }
          .animate-fade-in-up-delay-2 {
            animation: fadeInUp 1s ease-out 1s forwards;
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      <script src="https://cdn.tailwindcss.com"></script>
      <HeroSection />
      <Features />
      <HowItWorks />
      <BlockchainInfo />
      <Testimonials />
      <ContactSection />
      <CTASection />
    </div>
  );
};

export default App;
