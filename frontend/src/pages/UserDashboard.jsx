import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const UserDashboard = () => {
  const navigate = useNavigate();
  // Mock user data - in a real app, this would come from an API
  const [user, setUser] = useState({
    id: 1,
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=764&auto=format&fit=crop',
    joinDate: 'January 2023',
    points: 450,
    level: 'Gold',
    isPremium: false,
    listingsRemaining: 5
  });

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const fileInputRef = useRef(null);

  // Mock user uploaded items
  const [uploadedItems, setUploadedItems] = useState([
    {
      id: 1,
      name: 'Black Leather Jacket',
      category: 'Outerwear',
      condition: 'Good',
      size: 'M',
      image: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=992&auto=format&fit=crop',
      additionalImages: [
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=870&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?q=80&w=987&auto=format&fit=crop'
      ],
      status: 'Available',
      pointsValue: 30,
      dateAdded: '2023-12-15',
      description: 'Classic black leather jacket in good condition. Perfect for casual wear.',
      brand: 'Vintage Collection',
      material: 'Genuine Leather',
      color: 'Black',
      location: 'New York, NY',
      shipping: 'Buyer pays shipping',
      tags: ['leather', 'outerwear', 'vintage', 'black'],
    },
    {
      id: 2,
      name: 'Denim Jeans',
      category: 'Bottoms',
      condition: 'Like New',
      size: '32',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1026&auto=format&fit=crop',
      status: 'Swapped',
      pointsValue: 25,
      dateAdded: '2023-11-20',
    },
    {
      id: 3,
      name: 'Summer Dress',
      category: 'Dresses',
      condition: 'Excellent',
      size: 'S',
      image: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?q=80&w=1287&auto=format&fit=crop',
      status: 'Available',
      pointsValue: 35,
      dateAdded: '2024-01-05',
    }
  ]);

  // Mock swap history
  const [swapHistory, setSwapHistory] = useState([
    {
      id: 1,
      item: 'Red Cardigan',
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1036&auto=format&fit=crop',
      date: '2024-01-15',
      status: 'Completed',
      type: 'Listed by you',
      withUser: 'Maria G.',
      points: '+25',
    },
    {
      id: 2,
      item: 'Denim Jeans',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1026&auto=format&fit=crop',
      date: '2023-12-28',
      status: 'Completed',
      type: 'Listed by you',
      withUser: 'John D.',
      points: '+25',
    },
    {
      id: 3,
      item: 'Winter Boots',
      image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=987&auto=format&fit=crop',
      date: '2024-01-10',
      status: 'In Progress',
      type: 'Purchased by you',
      withUser: 'Sam T.',
      points: '-40',
    },
    {
      id: 4,
      item: 'Knit Sweater',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=870&auto=format&fit=crop',
      date: '2024-01-20',
      status: 'In Progress',
      type: 'Purchased by you',
      withUser: 'Emma L.',
      points: '-30',
    },
  ]);

  // Tabs for uploaded items and swap history
  const [activeTab, setActiveTab] = useState('uploaded');
  
  // Handle upgrade to premium
  const handleUpgradeToPremium = () => {
    // In a real app, this would navigate to a payment page or open a payment modal
    if (window.confirm('Upgrade to Premium for unlimited listings? This would normally redirect to a payment page.')) {
      setUser({...user, isPremium: true, listingsRemaining: Infinity});
      alert('Congratulations! You are now a Premium user with unlimited listings!');
    }
  };

  // Handle view item
  const handleViewItem = (item) => {
    setSelectedItem(item);
    setEditedItem({
      ...item,
      additionalImages: item.additionalImages || []
    });
    setSelectedImageIndex(0);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedItem(prev => ({
          ...prev,
          additionalImages: [...(prev.additionalImages || []), reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle remove image
  const handleRemoveImage = (index) => {
    if (index === 0) {
      alert("Cannot remove the main image. At least one image is required.");
      return;
    }
    
    setEditedItem(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index - 1)
    }));

    if (selectedImageIndex >= index) {
      setSelectedImageIndex(Math.max(0, selectedImageIndex - 1));
    }
  };

  // Handle set main image
  const handleSetMainImage = (index) => {
    if (index === 0) return; // Already main image
    
    const newMainImage = index === 0 ? editedItem.image : editedItem.additionalImages[index - 1];
    const oldMainImage = editedItem.image;
    
    setEditedItem(prev => {
      const newAdditionalImages = [...prev.additionalImages];
      if (index > 0) {
        newAdditionalImages.splice(index - 1, 1);
      }
      return {
        ...prev,
        image: newMainImage,
        additionalImages: [oldMainImage, ...newAdditionalImages]
      };
    });
    
    setSelectedImageIndex(0);
  };

  // Handle edit item
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Handle save edit
  const handleSaveEdit = () => {
    setUploadedItems(items =>
      items.map(item =>
        item.id === editedItem.id ? editedItem : item
      )
    );
    setSelectedItem(editedItem);
    setIsEditing(false);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1F77B4F2] text-white py-8 sm:py-12">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <img 
                src={user.profileImage} 
                alt={user.name} 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white mr-4 sm:mr-6"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">{user.name}</h1>
                <p className="text-sm sm:text-base text-blue-100">Member since {user.joinDate}</p>
                <div className="mt-2 flex items-center">
                  <span className={`${user.isPremium ? 'bg-yellow-400 text-gray-900' : 'bg-gray-200 text-gray-700'} px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold`}>
                    {user.isPremium ? 'PREMIUM USER' : 'BASIC USER'}
                  </span>
                  {!user.isPremium && (
                    <button 
                      onClick={handleUpgradeToPremium}
                      className="ml-2 bg-yellow-400 text-gray-900 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold hover:bg-yellow-500 transition-colors"
                    >
                      UPGRADE NOW
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 sm:space-x-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold">{user.points}</div>
                <div className="text-xs sm:text-sm text-blue-100">Points</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold px-3 sm:px-4 py-1 bg-yellow-400 text-gray-900 rounded-full">{user.level}</div>
                <div className="text-xs sm:text-sm text-blue-100 mt-1">Level</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="text-xs sm:text-sm text-gray-500 mb-1">Total Items</div>
            <div className="text-xl sm:text-2xl font-semibold">{uploadedItems.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="text-xs sm:text-sm text-gray-500 mb-1">Active Listings</div>
            <div className="text-xl sm:text-2xl font-semibold">{uploadedItems.filter(item => item.status === 'Available').length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="text-xs sm:text-sm text-gray-500 mb-1">Completed Swaps</div>
            <div className="text-xl sm:text-2xl font-semibold">{swapHistory.filter(swap => swap.status === 'Completed').length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="text-xs sm:text-sm text-gray-500 mb-1">Points Earned</div>
            <div className="text-xl sm:text-2xl font-semibold text-[#1F77B4F2]">+{user.points}</div>
          </div>
        </div>

        {/* Listings Remaining - Show only for non-premium users */}
        {!user.isPremium && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Listings Remaining</h3>
                <p className="text-sm text-gray-500 mt-1">
                  New users are limited to 5 active listings. Upgrade to Premium for unlimited listings.
                </p>
              </div>
              <div className="flex items-center">
                <div className="text-2xl font-bold mr-3">{user.listingsRemaining}/5</div>
                <button 
                  onClick={handleUpgradeToPremium}
                  className="bg-[#1F77B4F2] text-white px-4 py-2 rounded-md text-sm hover:bg-[#1F77B4] transition-colors"
                >
                  Upgrade to Premium
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('uploaded')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'uploaded'
                  ? 'border-[#1F77B4F2] text-[#1F77B4F2]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Uploaded Items
            </button>
            <button
              onClick={() => setActiveTab('swaps')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'swaps'
                  ? 'border-[#1F77B4F2] text-[#1F77B4F2]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Swap History
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'uploaded' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {uploadedItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="relative h-40 sm:h-48">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover cursor-pointer transition-transform hover:scale-105" 
                    onClick={() => handleViewItem(item)}
                  />
                  <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full ${
                    item.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {item.status}
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 cursor-pointer hover:text-[#1F77B4F2] transition-colors" onClick={() => handleViewItem(item)}>
                      {item.name}
                    </h3>
                    <div className="bg-[#1F77B4F2] text-white px-2 py-1 rounded text-xs font-medium">
                      {item.pointsValue} pts
                    </div>
                  </div>
                  <div className="mt-2 text-xs sm:text-sm text-gray-500">
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span className="text-gray-900">{item.category}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>Size:</span>
                      <span className="text-gray-900">{item.size}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>Condition:</span>
                      <span className="text-gray-900">{item.condition}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>Added:</span>
                      <span className="text-gray-900">{new Date(item.dateAdded).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-4 flex space-x-2">
                    <button 
                      className="flex-1 bg-[#1F77B4F2] text-white py-1.5 sm:py-2 rounded-md text-xs sm:text-sm hover:bg-[#1F77B4] transition-colors"
                      onClick={() => handleViewItem(item)}
                    >
                      View Item
                    </button>
                    <button 
                      className="flex-1 border border-gray-300 text-gray-700 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        handleViewItem(item);
                        setTimeout(() => handleEditClick(), 100);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add New Item Card */}
            {(user.isPremium || user.listingsRemaining > 0) ? (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center h-[400px]">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#1F77B4F2]/10 text-[#1F77B4F2]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Add new item</h3>
                  <p className="mt-1 text-sm text-gray-500">List a clothing item to swap or earn points</p>
                  <div className="mt-6">
                    <button 
                      className="px-4 py-2 bg-[#1F77B4F2] text-white rounded-md text-sm hover:bg-[#1F77B4] transition-colors"
                      onClick={() => navigate('/add-item')}
                    >
                      Upload Item
                    </button>
                  </div>
                  {!user.isPremium && (
                    <p className="mt-2 text-xs text-gray-500">
                      {user.listingsRemaining} listing{user.listingsRemaining !== 1 ? 's' : ''} remaining
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center h-[400px]">
                <div className="text-center px-6">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Listing limit reached</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You've reached your limit of 5 listings as a basic user
                  </p>
                  <div className="mt-6">
                    <button 
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600 transition-colors"
                      onClick={handleUpgradeToPremium}
                    >
                      Upgrade to Premium
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Get unlimited listings with Premium
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    With
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {swapHistory.map((swap) => (
                  <tr key={swap.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            className="h-10 w-10 rounded-md object-cover cursor-pointer" 
                            src={swap.image} 
                            alt={swap.item} 
                            onClick={() => navigate(`/item/${swap.id}`)}
                          />
                        </div>
                        <div className="ml-4">
                          <div 
                            className="text-sm font-medium text-gray-900 cursor-pointer hover:text-[#1F77B4F2]"
                            onClick={() => navigate(`/item/${swap.id}`)}
                          >
                            {swap.item}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      {swap.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        swap.type.includes('Listed') 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {swap.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      {swap.withUser}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        swap.status === 'Completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {swap.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={swap.points.includes('+') ? 'text-green-600' : 'text-red-600'}>
                        {swap.points}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button 
            className="px-6 py-3 bg-[#1F77B4F2] text-white rounded-lg shadow hover:bg-[#1F77B4] transition-colors"
            onClick={() => navigate('/browse')}
          >
            Browse Available Items
          </button>
          <button className="px-6 py-3 border border-[#1F77B4F2] text-[#1F77B4F2] rounded-lg shadow hover:bg-blue-50 transition-colors">
            Edit Profile
          </button>
          {!user.isPremium && (
            <button 
              className="px-6 py-3 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition-colors"
              onClick={handleUpgradeToPremium}
            >
              Upgrade to Premium
            </button>
          )}
        </div>
      </div>

      {/* Item Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-3 sm:p-6">
                {/* Modal Header */}
                <div className="flex justify-between items-start mb-3 sm:mb-6">
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                    {isEditing ? 'Edit Item' : 'Item Details'}
                  </h2>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500 p-1"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Modal Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Image Section */}
                  <div className="space-y-3 sm:space-y-4">
                    {/* Main Image Display */}
                    <div className="relative rounded-lg overflow-hidden bg-gray-100">
                      <img 
                        src={selectedImageIndex === 0 ? selectedItem.image : selectedItem.additionalImages[selectedImageIndex - 1]}
                        alt={selectedItem.name}
                        className="w-full h-48 sm:h-64 object-contain"
                      />
                      {isEditing && selectedImageIndex > 0 && (
                        <button
                          onClick={() => handleSetMainImage(selectedImageIndex)}
                          className="absolute top-2 right-2 bg-white bg-opacity-90 text-gray-700 px-2 py-1 rounded text-xs sm:text-sm hover:bg-opacity-100 transition-colors"
                        >
                          Set as Main
                        </button>
                      )}
                    </div>

                    {/* Thumbnail Gallery */}
                    <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                      {/* Main Image Thumbnail */}
                      <div 
                        className={`relative flex-shrink-0 cursor-pointer transition-all duration-200 ${
                          selectedImageIndex === 0 ? 'ring-2 ring-[#1F77B4F2] scale-105' : 'hover:scale-105'
                        }`}
                        onClick={() => setSelectedImageIndex(0)}
                      >
                        <img 
                          src={selectedItem.image} 
                          alt="Main"
                          className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-md"
                        />
                        {isEditing && (
                          <div className="absolute top-0 right-0 -mt-1 -mr-1">
                            <span className="bg-[#1F77B4F2] text-white text-xs px-1 rounded">Main</span>
                          </div>
                        )}
                      </div>

                      {/* Additional Images Thumbnails */}
                      {(selectedItem.additionalImages || []).map((img, index) => (
                        <div 
                          key={index}
                          className={`relative flex-shrink-0 cursor-pointer transition-all duration-200 ${
                            selectedImageIndex === index + 1 ? 'ring-2 ring-[#1F77B4F2] scale-105' : 'hover:scale-105'
                          }`}
                          onClick={() => setSelectedImageIndex(index + 1)}
                        >
                          <img 
                            src={img} 
                            alt={`Additional ${index + 1}`}
                            className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-md"
                          />
                          {isEditing && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage(index + 1);
                              }}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}

                      {/* Add Image Button (Edit Mode) */}
                      {isEditing && (
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-[#1F77B4F2] transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="space-y-4">
                    {isEditing ? (
                      // Edit Form
                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Name</label>
                          <input
                            type="text"
                            name="name"
                            value={editedItem.name}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1F77B4F2] focus:ring-[#1F77B4F2] text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Category</label>
                          <input
                            type="text"
                            name="category"
                            value={editedItem.category}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1F77B4F2] focus:ring-[#1F77B4F2] text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            name="description"
                            value={editedItem.description}
                            onChange={handleInputChange}
                            rows={3}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1F77B4F2] focus:ring-[#1F77B4F2] text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Size</label>
                            <input
                              type="text"
                              name="size"
                              value={editedItem.size}
                              onChange={handleInputChange}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1F77B4F2] focus:ring-[#1F77B4F2] text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Condition</label>
                            <input
                              type="text"
                              name="condition"
                              value={editedItem.condition}
                              onChange={handleInputChange}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1F77B4F2] focus:ring-[#1F77B4F2] text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Points Value</label>
                          <input
                            type="number"
                            name="pointsValue"
                            value={editedItem.pointsValue}
                            onChange={handleInputChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1F77B4F2] focus:ring-[#1F77B4F2] text-sm"
                          />
                        </div>
                      </div>
                    ) : (
                      // View Details
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900">{selectedItem.name}</h3>
                          <p className="text-xs sm:text-sm text-gray-500 mt-1">{selectedItem.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:gap-4">
                          <div>
                            <p className="text-xs font-medium text-gray-500">Category</p>
                            <p className="text-sm text-gray-900 mt-0.5">{selectedItem.category}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500">Size</p>
                            <p className="text-sm text-gray-900 mt-0.5">{selectedItem.size}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500">Condition</p>
                            <p className="text-sm text-gray-900 mt-0.5">{selectedItem.condition}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500">Points Value</p>
                            <p className="text-sm font-semibold text-[#1F77B4F2] mt-0.5">{selectedItem.pointsValue} pts</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500">Status</p>
                            <p className={`text-sm mt-0.5 ${
                              selectedItem.status === 'Available' ? 'text-green-600' : 'text-blue-600'
                            }`}>
                              {selectedItem.status}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500">Date Added</p>
                            <p className="text-sm text-gray-900 mt-0.5">
                              {new Date(selectedItem.dateAdded).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {selectedItem.tags && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1.5">Tags</p>
                            <div className="flex flex-wrap gap-1.5">
                              {selectedItem.tags.map((tag, index) => (
                                <span 
                                  key={index}
                                  className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="mt-4 sm:mt-6 flex justify-end space-x-2 sm:space-x-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#1F77B4F2] text-white rounded-md text-sm hover:bg-[#1F77B4] transition-colors"
                      >
                        Save Changes
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Close
                      </button>
                      <button
                        onClick={handleEditClick}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#1F77B4F2] text-white rounded-md text-sm hover:bg-[#1F77B4] transition-colors"
                      >
                        Edit Item
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDashboard; 