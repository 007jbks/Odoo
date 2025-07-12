import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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

  // Mock user uploaded items
  const [uploadedItems, setUploadedItems] = useState([
    {
      id: 1,
      name: 'Black Leather Jacket',
      category: 'Outerwear',
      condition: 'Good',
      size: 'M',
      image: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=992&auto=format&fit=crop',
      status: 'Available',
      pointsValue: 30,
      dateAdded: '2023-12-15',
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1F77B4F2] text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:justify-between">
            <div className="flex items-center mb-6 md:mb-0">
              <img 
                src={user.profileImage} 
                alt={user.name} 
                className="w-20 h-20 rounded-full object-cover border-4 border-white mr-6"
              />
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-blue-100">Member since {user.joinDate}</p>
                <div className="mt-2 flex items-center">
                  <span className={`${user.isPremium ? 'bg-yellow-400 text-gray-900' : 'bg-gray-200 text-gray-700'} px-3 py-1 rounded-full text-xs font-bold`}>
                    {user.isPremium ? 'PREMIUM USER' : 'BASIC USER'}
                  </span>
                  {!user.isPremium && (
                    <button 
                      onClick={handleUpgradeToPremium}
                      className="ml-2 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold hover:bg-yellow-500 transition-colors"
                    >
                      UPGRADE NOW
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{user.points}</div>
                <div className="text-blue-100 text-sm">Points</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold px-4 py-1 bg-yellow-400 text-gray-900 rounded-full">{user.level}</div>
                <div className="text-blue-100 text-sm mt-1">Level</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-500 mb-1">Total Items</div>
            <div className="text-2xl font-semibold">{uploadedItems.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-500 mb-1">Active Listings</div>
            <div className="text-2xl font-semibold">{uploadedItems.filter(item => item.status === 'Available').length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-500 mb-1">Completed Swaps</div>
            <div className="text-2xl font-semibold">{swapHistory.filter(swap => swap.status === 'Completed').length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-500 mb-1">Points Earned</div>
            <div className="text-2xl font-semibold text-[#1F77B4F2]">+{user.points}</div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {uploadedItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="relative h-48">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover cursor-pointer" 
                    onClick={() => navigate(`/item/${item.id}`)}
                  />
                  <div className={`absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-full ${
                    item.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {item.status}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900 cursor-pointer hover:text-[#1F77B4F2]" onClick={() => navigate(`/item/${item.id}`)}>
                      {item.name}
                    </h3>
                    <div className="bg-[#1F77B4F2] text-white px-2 py-1 rounded text-xs font-medium">
                      {item.pointsValue} pts
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
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
                  <div className="mt-4 flex space-x-2">
                    <button 
                      className="flex-1 bg-[#1F77B4F2] text-white py-2 rounded-md text-sm hover:bg-[#1F77B4] transition-colors"
                      onClick={() => navigate(`/item/${item.id}`)}
                    >
                      View Item
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md text-sm hover:bg-gray-50 transition-colors">
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
    </div>
  );
};

export default UserDashboard; 