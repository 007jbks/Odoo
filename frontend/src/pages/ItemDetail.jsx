import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ItemDetail = () => {
  const navigate = useNavigate();
  
  // Mock item data - in a real app, this would come from an API based on route params
  const [item, setItem] = useState({
    id: 1,
    name: 'Vintage Denim Jacket',
    description: 'A classic vintage denim jacket in excellent condition. This versatile piece features a relaxed fit with traditional button closures and two front pockets. Perfect for layering in spring and fall. Only worn a handful of times and has been well-maintained.',
    condition: 'Excellent',
    category: 'Outerwear',
    size: 'Medium',
    brand: 'Levi\'s',
    originalPrice: '$120',
    pointsValue: 45,
    status: 'Available', // Available, Pending, Swapped
    dateAdded: '2023-12-15',
    images: [
      'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=992&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?q=80&w=1015&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576931568289-61c811b56ca1?q=80&w=987&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?q=80&w=969&auto=format&fit=crop',
    ],
    uploader: {
      id: 5,
      name: 'Alex Johnson',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=764&auto=format&fit=crop',
      rating: 4.8,
      memberSince: 'January 2023',
      itemsListed: 12,
      successfulSwaps: 8
    }
  });

  // Mock user's own items (in a real app, this would come from user's profile/state)
  const [userItems, setUserItems] = useState([
    {
      id: 101,
      name: 'Blue Cotton T-Shirt',
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=464&auto=format&fit=crop',
      pointsValue: 20,
      condition: 'Good',
    },
    {
      id: 102,
      name: 'Black Jeans',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1026&auto=format&fit=crop',
      pointsValue: 30,
      condition: 'Excellent',
    },
    {
      id: 103,
      name: 'Winter Sweater',
      image: 'https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?q=80&w=765&auto=format&fit=crop',
      pointsValue: 35,
      condition: 'Like New',
    },
    {
      id: 104,
      name: 'Leather Boots',
      image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=987&auto=format&fit=crop',
      pointsValue: 60,
      condition: 'Good',
    },
  ]);

  // Mock similar items
  const similarItems = [
    {
      id: 2,
      name: 'Blue Denim Jacket',
      image: 'https://images.unsplash.com/photo-1605450081927-6b40c11c661f?q=80&w=987&auto=format&fit=crop',
      category: 'Outerwear',
      size: 'L',
      pointsValue: 40,
    },
    {
      id: 3,
      name: 'Black Leather Jacket',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=870&auto=format&fit=crop',
      category: 'Outerwear',
      size: 'M',
      pointsValue: 60,
    },
    {
      id: 4,
      name: 'Winter Coat',
      image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=987&auto=format&fit=crop',
      category: 'Outerwear',
      size: 'S',
      pointsValue: 50,
    },
    {
      id: 5,
      name: 'Khaki Jacket',
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1036&auto=format&fit=crop',
      category: 'Outerwear',
      size: 'XL',
      pointsValue: 35,
    },
  ];
  
  // Swap request state
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [pointDifference, setPointDifference] = useState(0);
  const [requestSent, setRequestSent] = useState(false);
  
  // Redeem with points state
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [redemptionComplete, setRedemptionComplete] = useState(false);
  const [userPoints, setUserPoints] = useState(100); // Mock user points
  
  // State for the currently selected image in the gallery
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Calculate point difference when selected item changes
  useEffect(() => {
    if (selectedItem) {
      const difference = item.pointsValue - selectedItem.pointsValue;
      setPointDifference(difference);
    } else {
      setPointDifference(0);
    }
  }, [selectedItem, item.pointsValue]);
  
  // Handle swap request submission
  const handleSwapRequest = () => {
    // In a real app, this would be an API call
    console.log('Swap request sent for:', {
      requestingItem: selectedItem,
      requestedItem: item,
      pointDifference: pointDifference,
      pointsToAdd: pointDifference > 0 ? pointDifference : 0
    });
    
    // Show success message
    setRequestSent(true);
    
    // Close modal after delay
    setTimeout(() => {
      setShowSwapModal(false);
      setRequestSent(false);
      setSelectedItem(null);
    }, 2000);
  };
  
  // Handle redemption with points
  const handleRedemption = () => {
    // In a real app, this would be an API call
    console.log('Item redeemed with points:', {
      item: item,
      pointsCost: item.pointsValue
    });
    
    // Update user points (mock)
    setUserPoints(prevPoints => prevPoints - item.pointsValue);
    
    // Show success message
    setRedemptionComplete(true);
    
    // Close modal after delay
    setTimeout(() => {
      setShowRedeemModal(false);
      setRedemptionComplete(false);
    }, 2000);
  };
  
  // Check if user has enough points
  const hasEnoughPoints = userPoints >= item.pointsValue;
  
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-[#1F77B4F2] hover:text-[#1F77B4] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to listings
          </button>
        </div>

        {/* Item detail main section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left side - Image gallery */}
            <div className="lg:w-1/2 p-4">
              <div className="mb-4 relative">
                <img 
                  src={item.images[selectedImage]} 
                  alt={item.name} 
                  className="w-full h-[400px] object-cover object-center rounded-lg"
                />
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${
                  item.status === 'Available' 
                    ? 'bg-green-100 text-green-800' 
                    : item.status === 'Pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {item.status}
                </div>
              </div>
              
              {/* Thumbnails */}
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {item.images.map((image, index) => (
                  <div 
                    key={index}
                    className={`cursor-pointer border-2 rounded ${selectedImage === index ? 'border-[#1F77B4F2]' : 'border-transparent'}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img 
                      src={image} 
                      alt={`${item.name} thumbnail ${index + 1}`} 
                      className="w-20 h-20 object-cover object-center rounded"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Item details */}
            <div className="lg:w-1/2 p-4 lg:p-6 flex flex-col">
              {/* Item info */}
              <div className="mb-6">
                <div className="flex justify-between items-start">
                  <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>
                  <div className="bg-[#1F77B4F2] text-white px-3 py-1 rounded-lg">
                    {item.pointsValue} points
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
                  <div>
                    <span className="text-sm text-gray-500">Size:</span>
                    <span className="ml-1 text-sm font-medium">{item.size}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Category:</span>
                    <span className="ml-1 text-sm font-medium">{item.category}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Brand:</span>
                    <span className="ml-1 text-sm font-medium">{item.brand}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Condition:</span>
                    <span className="ml-1 text-sm font-medium">{item.condition}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Original Price:</span>
                    <span className="ml-1 text-sm font-medium">{item.originalPrice}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Listed:</span>
                    <span className="ml-1 text-sm font-medium">{new Date(item.dateAdded).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h2 className="text-lg font-medium text-gray-900">Description</h2>
                  <p className="mt-1 text-gray-600">{item.description}</p>
                </div>
              </div>
              
              {/* Uploader info */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-2">Listed by</h2>
                <div className="flex items-center">
                  <img 
                    src={item.uploader.profileImage} 
                    alt={item.uploader.name} 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{item.uploader.name}</div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1">{item.uploader.rating}</span>
                      </span>
                      <span className="mx-2">•</span>
                      <span>{item.uploader.successfulSwaps} successful swaps</span>
                    </div>
                    <div className="text-xs text-gray-500">Member since {item.uploader.memberSince}</div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-auto pt-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    className="flex-1 bg-[#1F77B4F2] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#1F77B4] transition-colors"
                    disabled={item.status !== 'Available'}
                    onClick={() => setShowSwapModal(true)}
                  >
                    Request to Swap
                  </button>
                  <button 
                    className="flex-1 border border-[#1F77B4F2] text-[#1F77B4F2] py-3 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                    disabled={item.status !== 'Available'}
                    onClick={() => setShowRedeemModal(true)}
                  >
                    Redeem with Points
                  </button>
                </div>
                {item.status !== 'Available' && (
                  <p className="text-center text-sm text-red-500 mt-2">
                    This item is currently not available for swap or redemption
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Swap Modal */}
        {showSwapModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Request a Swap</h2>
                  <button
                    onClick={() => setShowSwapModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal body */}
              <div className="px-6 py-4">
                {requestSent ? (
                  <div className="text-center py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mt-2">Swap request sent successfully!</h3>
                    <p className="text-gray-600 mt-1">
                      You'll receive a notification when {item.uploader.name} responds to your request.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Item they want */}
                    <div className="mb-6">
                      <h3 className="text-md font-medium text-gray-900 mb-2">Item you want</h3>
                      <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md mr-4"
                        />
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.condition} • {item.size}</div>
                          <div className="text-sm font-medium text-[#1F77B4F2]">{item.pointsValue} points</div>
                        </div>
                      </div>
                    </div>

                    {/* Select your item to swap */}
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-2">Select your item to swap</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {userItems.map(userItem => (
                          <div
                            key={userItem.id}
                            onClick={() => setSelectedItem(userItem)}
                            className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                              selectedItem?.id === userItem.id
                                ? 'border-[#1F77B4F2] bg-blue-50'
                                : 'border-gray-200 hover:border-[#1F77B4F2]'
                            }`}
                          >
                            <img
                              src={userItem.image}
                              alt={userItem.name}
                              className="w-16 h-16 object-cover rounded-md mr-4"
                            />
                            <div>
                              <div className="font-medium">{userItem.name}</div>
                              <div className="text-sm text-gray-500">{userItem.condition}</div>
                              <div className="text-sm font-medium text-[#1F77B4F2]">{userItem.pointsValue} points</div>
                            </div>
                            {selectedItem?.id === userItem.id && (
                              <div className="ml-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1F77B4F2]" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Point difference calculation */}
                    {selectedItem && (
                      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-md font-medium text-gray-900 mb-2">Swap Summary</h3>
                        <div className="flex justify-between items-center">
                          <div>Item you want:</div>
                          <div className="font-medium">{item.pointsValue} points</div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <div>Your item:</div>
                          <div className="font-medium">{selectedItem.pointsValue} points</div>
                        </div>
                        <div className="border-t border-gray-200 my-2"></div>
                        <div className="flex justify-between items-center">
                          <div>Point difference:</div>
                          <div className={`font-medium ${pointDifference > 0 ? 'text-red-600' : pointDifference < 0 ? 'text-green-600' : ''}`}>
                            {pointDifference > 0 ? `+${pointDifference} points needed` : 
                             pointDifference < 0 ? `${Math.abs(pointDifference)} points extra` : 
                             'Even swap'}
                          </div>
                        </div>
                        {pointDifference > 0 && (
                          <p className="mt-2 text-sm text-gray-600">
                            You'll need to add {pointDifference} points to complete this swap.
                          </p>
                        )}
                        {pointDifference < 0 && (
                          <p className="mt-2 text-sm text-gray-600">
                            Great deal! Your item is worth more points than what you're requesting.
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Modal footer */}
              {!requestSent && (
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={() => setShowSwapModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSwapRequest}
                    disabled={!selectedItem}
                    className={`px-4 py-2 rounded-md text-white ${
                      selectedItem ? 'bg-[#1F77B4F2] hover:bg-[#1F77B4]' : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {pointDifference > 0 ? `Send Request (+${pointDifference} points)` : 'Send Swap Request'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Redeem with Points Modal */}
        {showRedeemModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="relative bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Modal header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Redeem with Points</h2>
                  <button
                    onClick={() => setShowRedeemModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal body */}
              <div className="px-6 py-4">
                {redemptionComplete ? (
                  <div className="text-center py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mt-2">Item redeemed successfully!</h3>
                    <p className="text-gray-600 mt-1">
                      {item.name} has been redeemed for {item.pointsValue} points.
                      Your remaining balance is {userPoints} points.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Item to redeem */}
                    <div className="mb-6">
                      <h3 className="text-md font-medium text-gray-900 mb-2">Item you want to redeem</h3>
                      <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md mr-4"
                        />
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.condition} • {item.size}</div>
                          <div className="text-sm font-medium text-[#1F77B4F2]">{item.pointsValue} points</div>
                        </div>
                      </div>
                    </div>

                    {/* Point calculation */}
                    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-md font-medium text-gray-900 mb-2">Redemption Summary</h3>
                      <div className="flex justify-between items-center">
                        <div>Your current balance:</div>
                        <div className="font-medium">{userPoints} points</div>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <div>Item cost:</div>
                        <div className="font-medium">{item.pointsValue} points</div>
                      </div>
                      <div className="border-t border-gray-200 my-2"></div>
                      <div className="flex justify-between items-center">
                        <div>Remaining balance:</div>
                        <div className={`font-medium ${hasEnoughPoints ? 'text-green-600' : 'text-red-600'}`}>
                          {userPoints - item.pointsValue} points
                        </div>
                      </div>
                      {!hasEnoughPoints && (
                        <p className="mt-2 text-sm text-red-600">
                          You don't have enough points to redeem this item.
                          You need {item.pointsValue - userPoints} more points.
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Modal footer */}
              {!redemptionComplete && (
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={() => setShowRedeemModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRedemption}
                    disabled={!hasEnoughPoints}
                    className={`px-4 py-2 rounded-md text-white ${
                      hasEnoughPoints ? 'bg-[#1F77B4F2] hover:bg-[#1F77B4]' : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    Confirm Redemption
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Similar Items Section */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">More Items Like This</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-sm text-gray-500">
                      {item.category} • {item.size}
                    </div>
                    <div className="bg-[#1F77B4F2] text-white text-xs px-2 py-1 rounded">
                      {item.pointsValue} pts
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/item/${item.id}`)}
                    className="mt-3 w-full bg-gray-100 text-gray-800 py-2 rounded text-sm hover:bg-gray-200 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail; 