import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Mock user data (to be replaced with actual backend integration)
  // Comment: Replace this with your backend authentication logic
  const [user, setUser] = useState({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: 'https://i.pravatar.cc/150?img=11',
    role: 'Premium User',
    points: 450
  });
  
  // Mock notifications for swap requests
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'swap_request',
      read: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      from: {
        id: 5,
        name: 'Emma Wilson',
        avatar: 'https://i.pravatar.cc/150?img=5'
      },
      yourItem: {
        id: 101,
        name: 'Vintage Denim Jacket',
        image: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=992&auto=format&fit=crop',
        pointsValue: 45
      },
      theirItem: {
        id: 202,
        name: 'Black Leather Jacket',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=870&auto=format&fit=crop',
        pointsValue: 60
      },
      pointsOffered: 15 // They're offering 15 additional points
    },
    {
      id: 2,
      type: 'swap_request',
      read: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
      from: {
        id: 8,
        name: 'Noah Taylor',
        avatar: 'https://i.pravatar.cc/150?img=8'
      },
      yourItem: {
        id: 102,
        name: 'Summer Dress',
        image: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?q=80&w=1287&auto=format&fit=crop',
        pointsValue: 35
      },
      theirItem: {
        id: 203,
        name: 'Casual T-Shirt',
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=464&auto=format&fit=crop',
        pointsValue: 20
      },
      pointsOffered: 0 // They're not offering additional points (should be 15 points)
    }
  ]);
  
  // Get count of unread notifications
  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    // Comment: Add your logout logic here
    // Example: authService.logout();
    console.log('User logged out');
    
    // For demo purposes only
    setIsUserMenuOpen(false);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
      if (isNotificationsOpen && !event.target.closest('.notifications-container')) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen, isNotificationsOpen]);
  
  // Handle accepting a swap request
  const handleAcceptSwap = (notificationId) => {
    console.log(`Accepting swap request ${notificationId}`);
    // In a real app, this would be an API call to accept the swap
    
    // For demo purposes, update the notification as read
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId ? {...notification, read: true} : notification
      )
    );
    
    // Close the notifications panel
    setIsNotificationsOpen(false);
  };
  
  // Handle declining a swap request
  const handleDeclineSwap = (notificationId) => {
    console.log(`Declining swap request ${notificationId}`);
    // In a real app, this would be an API call to decline the swap
    
    // For demo purposes, remove the notification
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };
  
  // Format time to relative time string
  const getRelativeTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const secondsAgo = Math.floor((now - date) / 1000);
    
    if (secondsAgo < 60) return 'Just now';
    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) return `${minutesAgo} minute${minutesAgo !== 1 ? 's' : ''} ago`;
    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) return `${hoursAgo} hour${hoursAgo !== 1 ? 's' : ''} ago`;
    const daysAgo = Math.floor(hoursAgo / 24);
    return `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`;
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-white/80 backdrop-blur-md py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Company Logo and Name */}
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center">
            <div className="text-2xl font-bold text-[#1F77B4F2]">€</div>
            <span className="ml-2 text-lg font-medium text-gray-800">ReWear</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex items-center" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/user-dashboard" className="text-gray-700 hover:text-[#1F77B4F2] transition-colors">
            Dashboard
          </Link>
          <Link to="/browse" className="text-gray-700 hover:text-[#1F77B4F2] transition-colors">
            Browse Items
          </Link>
          <Link to="/add-item" className="text-gray-700 hover:text-[#1F77B4F2] transition-colors">
            List an Item
          </Link>
        </div>

        {/* Notifications and User Account Section - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Points Display */}
          <div className="bg-blue-50 text-[#1F77B4F2] px-3 py-1 rounded-full text-sm font-medium">
            {user.points} points
          </div>
          
          {/* Notifications */}
          <div className="relative notifications-container">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-1 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none relative"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {/* Notifications Dropdown */}
            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-80 rounded-lg bg-white shadow-xl py-2 z-50 border border-gray-100"
                >
                  <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-medium text-gray-900">Notifications</h3>
                    {notifications.length > 0 && (
                      <button 
                        className="text-xs text-[#1F77B4F2] hover:underline"
                        onClick={() => setNotifications(prev => prev.map(n => ({...n, read: true})))}
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="mt-2">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map(notification => (
                        <div 
                          key={notification.id}
                          className={`px-4 py-3 border-b border-gray-100 ${notification.read ? '' : 'bg-blue-50'}`}
                        >
                          {notification.type === 'swap_request' && (
                            <div>
                              <div className="flex items-center mb-2">
                                <img 
                                  src={notification.from.avatar} 
                                  alt={notification.from.name} 
                                  className="w-8 h-8 rounded-full mr-2"
                                />
                                <div className="flex-1">
                                  <p className="text-sm">
                                    <span className="font-medium">{notification.from.name}</span> wants to swap with you
                                  </p>
                                  <p className="text-xs text-gray-500">{getRelativeTime(notification.timestamp)}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center bg-gray-50 p-2 rounded-lg mb-2">
                                <div className="flex-1 flex items-center">
                                  <img 
                                    src={notification.theirItem.image}
                                    alt={notification.theirItem.name}
                                    className="w-10 h-10 object-cover rounded mr-2"
                                  />
                                  <div>
                                    <p className="text-xs font-medium">Their item:</p>
                                    <p className="text-xs">{notification.theirItem.name}</p>
                                    <p className="text-xs text-[#1F77B4F2]">{notification.theirItem.pointsValue} pts</p>
                                  </div>
                                </div>
                                
                                <div className="px-2 text-gray-400">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                  </svg>
                                </div>
                                
                                <div className="flex-1 flex items-center">
                                  <img 
                                    src={notification.yourItem.image}
                                    alt={notification.yourItem.name}
                                    className="w-10 h-10 object-cover rounded mr-2"
                                  />
                                  <div>
                                    <p className="text-xs font-medium">Your item:</p>
                                    <p className="text-xs">{notification.yourItem.name}</p>
                                    <p className="text-xs text-[#1F77B4F2]">{notification.yourItem.pointsValue} pts</p>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Point difference */}
                              {notification.pointsOffered > 0 && (
                                <p className="text-xs text-green-600 mb-2">
                                  + {notification.pointsOffered} points offered
                                </p>
                              )}
                              {notification.pointsOffered < 0 && (
                                <p className="text-xs text-red-600 mb-2">
                                  {notification.pointsOffered} points needed
                                </p>
                              )}
                              
                              {/* Action buttons */}
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => handleAcceptSwap(notification.id)}
                                  className="flex-1 bg-[#1F77B4F2] text-white text-xs py-1 px-3 rounded hover:bg-[#1F77B4] transition-colors"
                                >
                                  Accept
                                </button>
                                <button 
                                  onClick={() => handleDeclineSwap(notification.id)}
                                  className="flex-1 border border-gray-300 text-gray-700 text-xs py-1 px-3 rounded hover:bg-gray-100 transition-colors"
                                >
                                  Decline
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* User Account */}
          <div className="relative user-menu-container">
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-gray-800">{user?.name || 'Guest'}</span>
                <span className="text-xs text-gray-500">{user?.role || 'Sign In'}</span>
              </div>
              <div className="h-9 w-9 rounded-full bg-gray-200 overflow-hidden border-2 border-[#1F77B4F2]">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {/* User Dropdown Menu */}
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-60 rounded-lg bg-white shadow-xl py-2 z-50 border border-gray-100"
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link to="/user-dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsUserMenuOpen(false)}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </Link>
                    <Link to="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsUserMenuOpen(false)}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-lg"
          >
            <div className="container mx-auto px-4 py-3">
              {/* Mobile Navigation Links */}
              <div className="flex flex-col space-y-3 mb-4">
                <Link 
                  to="/user-dashboard" 
                  className="text-gray-700 hover:text-[#1F77B4F2] py-2 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/browse" 
                  className="text-gray-700 hover:text-[#1F77B4F2] py-2 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Browse Items  
                </Link>
                <Link 
                  to="/add-item" 
                  className="text-gray-700 hover:text-[#1F77B4F2] py-2 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  List an Item
                </Link>
                
                {/* Mobile Notifications Link */}
                <Link 
                  to="#" 
                  className="text-gray-700 hover:text-[#1F77B4F2] py-2 transition-colors flex items-center"
                  onClick={() => {
                    setIsNotificationsOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </div>
              
              {/* Mobile User Info */}
              {user ? (
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden border-2 border-[#1F77B4F2]">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <p className="text-xs text-[#1F77B4F2] font-medium mt-1">{user.points} points</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <Link 
                      to="/user-dashboard" 
                      className="flex items-center text-gray-700 py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </Link>
                    <Link 
                      to="/settings" 
                      className="flex items-center text-gray-700 py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center text-red-600 py-2 w-full text-left"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-100 pt-3">
                  <Link 
                    to="/auth" 
                    className="block w-full py-2 px-4 bg-[#1F77B4F2] text-white rounded-lg text-center font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar; 