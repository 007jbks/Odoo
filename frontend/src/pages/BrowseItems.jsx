import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const BrowseItems = () => {
  const navigate = useNavigate();
  
  // Mock data - in a real app, this would come from an API
  const [allItems, setAllItems] = useState([
    {
      id: 1,
      name: 'Vintage Denim Jacket',
      category: 'Outerwear',
      size: 'M',
      condition: 'Excellent',
      brand: "Levi's",
      gender: 'Unisex',
      pointsValue: 45,
      image: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=992&auto=format&fit=crop',
      uploader: {
        name: 'Alex Johnson',
        rating: 4.8
      }
    },
    {
      id: 2,
      name: 'Black Leather Jacket',
      category: 'Outerwear',
      size: 'L',
      condition: 'Good',
      brand: 'H&M',
      gender: 'Men',
      pointsValue: 60,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=870&auto=format&fit=crop',
      uploader: {
        name: 'Emma Wilson',
        rating: 4.6
      }
    },
    {
      id: 3,
      name: 'Summer Dress',
      category: 'Dresses',
      size: 'S',
      condition: 'Like New',
      brand: 'Zara',
      gender: 'Women',
      pointsValue: 35,
      image: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?q=80&w=1287&auto=format&fit=crop',
      uploader: {
        name: 'Sophia Miller',
        rating: 4.9
      }
    },
    {
      id: 4,
      name: 'Winter Coat',
      category: 'Outerwear',
      size: 'XL',
      condition: 'Excellent',
      brand: 'North Face',
      gender: 'Unisex',
      pointsValue: 75,
      image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=987&auto=format&fit=crop',
      uploader: {
        name: 'Noah Taylor',
        rating: 4.7
      }
    },
    {
      id: 5,
      name: 'Casual T-Shirt',
      category: 'Tops',
      size: 'M',
      condition: 'Good',
      brand: 'Gap',
      gender: 'Men',
      pointsValue: 20,
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=464&auto=format&fit=crop',
      uploader: {
        name: 'Liam Davis',
        rating: 4.5
      }
    },
    {
      id: 6,
      name: 'Silk Blouse',
      category: 'Tops',
      size: 'M',
      condition: 'Excellent',
      brand: 'Banana Republic',
      gender: 'Women',
      pointsValue: 40,
      image: 'https://images.unsplash.com/photo-1624655107778-a263e18550d7?q=80&w=987&auto=format&fit=crop',
      uploader: {
        name: 'Olivia Brown',
        rating: 4.8
      }
    },
    {
      id: 7,
      name: 'Jeans',
      category: 'Bottoms',
      size: '32',
      condition: 'Good',
      brand: 'Levi\'s',
      gender: 'Men',
      pointsValue: 30,
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1026&auto=format&fit=crop',
      uploader: {
        name: 'Noah Taylor',
        rating: 4.7
      }
    },
    {
      id: 8,
      name: 'Sneakers',
      category: 'Footwear',
      size: '9',
      condition: 'Like New',
      brand: 'Nike',
      gender: 'Unisex',
      pointsValue: 50,
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=987&auto=format&fit=crop',
      uploader: {
        name: 'Emma Wilson',
        rating: 4.6
      }
    },
    {
      id: 9,
      name: 'Winter Sweater',
      category: 'Knitwear',
      size: 'S',
      condition: 'Good',
      brand: 'J.Crew',
      gender: 'Women',
      pointsValue: 35,
      image: 'https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?q=80&w=765&auto=format&fit=crop',
      uploader: {
        name: 'Sophia Miller',
        rating: 4.9
      }
    },
    {
      id: 10,
      name: 'Formal Shirt',
      category: 'Tops',
      size: 'L',
      condition: 'Excellent',
      brand: 'Ralph Lauren',
      gender: 'Men',
      pointsValue: 40,
      image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1025&auto=format&fit=crop',
      uploader: {
        name: 'Liam Davis',
        rating: 4.5
      }
    },
    {
      id: 11,
      name: 'Canvas Tote Bag',
      category: 'Accessories',
      size: 'One Size',
      condition: 'Like New',
      brand: 'Everlane',
      gender: 'Unisex',
      pointsValue: 25,
      image: 'https://images.unsplash.com/photo-1628149453636-23e882b3c1fc?q=80&w=1036&auto=format&fit=crop',
      uploader: {
        name: 'Olivia Brown',
        rating: 4.8
      }
    },
    {
      id: 12,
      name: 'Beanie Hat',
      category: 'Accessories',
      size: 'One Size',
      condition: 'Good',
      brand: 'Carhartt',
      gender: 'Unisex',
      pointsValue: 15,
      image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=687&auto=format&fit=crop',
      uploader: {
        name: 'Alex Johnson',
        rating: 4.8
      }
    },
  ]);

  const data = axios.get('https://api.example.com/items')
    .then(response => {
      setAllItems(response.data);
    })
    .catch(error => {
      console.error('Error fetching items:', error);
    });

    
  
  // States for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [pointsRange, setPointsRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState('newest');
  
  // Filtered items based on search and filters
  const [filteredItems, setFilteredItems] = useState(allItems);
  
  // List of unique categories for filter
  const categories = ['All', ...new Set(allItems.map(item => item.category))];
  
  // Apply filters when any filter state changes
  useEffect(() => {
    let result = [...allItems];
    
    // Apply search term
    if (searchTerm) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'All') {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    // Apply gender filter
    if (selectedGender !== 'All') {
      result = result.filter(item => item.gender === selectedGender);
    }
    
    // Apply condition filter
    if (selectedCondition !== 'All') {
      result = result.filter(item => item.condition === selectedCondition);
    }
    
    // Apply points range filter
    result = result.filter(item => 
      item.pointsValue >= pointsRange[0] && 
      item.pointsValue <= pointsRange[1]
    );
    
    // Apply sorting
    if (sortBy === 'newest') {
      // For demo purposes, we'll just use the id as a proxy for recency
      result = result.sort((a, b) => b.id - a.id);
    } else if (sortBy === 'points-low-high') {
      result = result.sort((a, b) => a.pointsValue - b.pointsValue);
    } else if (sortBy === 'points-high-low') {
      result = result.sort((a, b) => b.pointsValue - a.pointsValue);
    }
    
    setFilteredItems(result);
  }, [searchTerm, selectedCategory, selectedGender, selectedCondition, pointsRange, sortBy, allItems]);
  
  // Mobile filter menu state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Browse Items</h1>
        
        {/* Search and Sort Controls */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full md:w-2/3">
            <input
              type="text"
              placeholder="Search items by name, brand, or category"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F77B4F2]"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 md:flex-none bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1F77B4F2]"
            >
              <option value="newest">Newest First</option>
              <option value="points-low-high">Points: Low to High</option>
              <option value="points-high-low">Points: High to Low</option>
            </select>
            
            <button 
              className="md:hidden flex-1 bg-[#1F77B4F2] text-white px-4 py-2 rounded-lg"
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            >
              <div className="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>Filters</span>
              </div>
            </button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white p-4 rounded-lg shadow-sm sticky top-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-medium text-lg">Filters</h2>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setSelectedGender('All');
                    setSelectedCondition('All');
                    setPointsRange([0, 100]);
                  }}
                  className="text-sm text-[#1F77B4F2] hover:underline"
                >
                  Clear All
                </button>
              </div>
              
              {/* Category filter */}
              <div className="mb-6">
                <h3 className="font-medium text-sm mb-2">Category</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {categories.map(category => (
                    <div key={category} className="flex items-center">
                      <input
                        type="radio"
                        id={`category-${category}`}
                        name="category"
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                        className="h-4 w-4 text-[#1F77B4F2] focus:ring-[#1F77B4F2]"
                      />
                      <label htmlFor={`category-${category}`} className="ml-2 text-sm text-gray-700">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Gender filter */}
              <div className="mb-6">
                <h3 className="font-medium text-sm mb-2">Gender</h3>
                <div className="space-y-2">
                  {['All', 'Men', 'Women', 'Unisex'].map(gender => (
                    <div key={gender} className="flex items-center">
                      <input
                        type="radio"
                        id={`gender-${gender}`}
                        name="gender"
                        checked={selectedGender === gender}
                        onChange={() => setSelectedGender(gender)}
                        className="h-4 w-4 text-[#1F77B4F2] focus:ring-[#1F77B4F2]"
                      />
                      <label htmlFor={`gender-${gender}`} className="ml-2 text-sm text-gray-700">
                        {gender}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Condition filter */}
              <div className="mb-6">
                <h3 className="font-medium text-sm mb-2">Condition</h3>
                <div className="space-y-2">
                  {['All', 'Like New', 'Excellent', 'Good', 'Fair'].map(condition => (
                    <div key={condition} className="flex items-center">
                      <input
                        type="radio"
                        id={`condition-${condition}`}
                        name="condition"
                        checked={selectedCondition === condition}
                        onChange={() => setSelectedCondition(condition)}
                        className="h-4 w-4 text-[#1F77B4F2] focus:ring-[#1F77B4F2]"
                      />
                      <label htmlFor={`condition-${condition}`} className="ml-2 text-sm text-gray-700">
                        {condition}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Points range filter */}
              <div className="mb-4">
                <h3 className="font-medium text-sm mb-2">Points Range</h3>
                <div className="px-2">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">{pointsRange[0]}</span>
                    <span className="text-sm text-gray-600">{pointsRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={pointsRange[0]}
                    onChange={(e) => setPointsRange([parseInt(e.target.value), pointsRange[1]])}
                    className="w-full accent-[#1F77B4F2]"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={pointsRange[1]}
                    onChange={(e) => setPointsRange([pointsRange[0], parseInt(e.target.value)])}
                    className="w-full accent-[#1F77B4F2]"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Filters - Mobile */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 overflow-hidden">
              <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setMobileFiltersOpen(false)} />
              
              <div className="fixed inset-y-0 right-0 flex max-w-full">
                <div className="w-screen max-w-md transform transition ease-in-out duration-300">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                      <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={() => setMobileFiltersOpen(false)}
                      >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto px-4 py-6">
                      {/* Category filter */}
                      <div className="mb-6">
                        <h3 className="font-medium text-sm mb-2">Category</h3>
                        <div className="space-y-2">
                          {categories.map(category => (
                            <div key={category} className="flex items-center">
                              <input
                                type="radio"
                                id={`mobile-category-${category}`}
                                name="mobile-category"
                                checked={selectedCategory === category}
                                onChange={() => setSelectedCategory(category)}
                                className="h-4 w-4 text-[#1F77B4F2] focus:ring-[#1F77B4F2]"
                              />
                              <label htmlFor={`mobile-category-${category}`} className="ml-2 text-sm text-gray-700">
                                {category}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Gender filter */}
                      <div className="mb-6">
                        <h3 className="font-medium text-sm mb-2">Gender</h3>
                        <div className="space-y-2">
                          {['All', 'Men', 'Women', 'Unisex'].map(gender => (
                            <div key={gender} className="flex items-center">
                              <input
                                type="radio"
                                id={`mobile-gender-${gender}`}
                                name="mobile-gender"
                                checked={selectedGender === gender}
                                onChange={() => setSelectedGender(gender)}
                                className="h-4 w-4 text-[#1F77B4F2] focus:ring-[#1F77B4F2]"
                              />
                              <label htmlFor={`mobile-gender-${gender}`} className="ml-2 text-sm text-gray-700">
                                {gender}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Condition filter */}
                      <div className="mb-6">
                        <h3 className="font-medium text-sm mb-2">Condition</h3>
                        <div className="space-y-2">
                          {['All', 'Like New', 'Excellent', 'Good', 'Fair'].map(condition => (
                            <div key={condition} className="flex items-center">
                              <input
                                type="radio"
                                id={`mobile-condition-${condition}`}
                                name="mobile-condition"
                                checked={selectedCondition === condition}
                                onChange={() => setSelectedCondition(condition)}
                                className="h-4 w-4 text-[#1F77B4F2] focus:ring-[#1F77B4F2]"
                              />
                              <label htmlFor={`mobile-condition-${condition}`} className="ml-2 text-sm text-gray-700">
                                {condition}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Points range filter */}
                      <div className="mb-6">
                        <h3 className="font-medium text-sm mb-2">Points Range</h3>
                        <div className="px-2">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-600">{pointsRange[0]}</span>
                            <span className="text-sm text-gray-600">{pointsRange[1]}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={pointsRange[0]}
                            onChange={(e) => setPointsRange([parseInt(e.target.value), pointsRange[1]])}
                            className="w-full accent-[#1F77B4F2]"
                          />
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={pointsRange[1]}
                            onChange={(e) => setPointsRange([pointsRange[0], parseInt(e.target.value)])}
                            className="w-full accent-[#1F77B4F2]"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 px-4 py-6">
                      <button
                        className="w-full bg-[#1F77B4F2] text-white py-2 rounded-lg"
                        onClick={() => setMobileFiltersOpen(false)}
                      >
                        Apply Filters
                      </button>
                      <button
                        className="w-full mt-2 border border-gray-300 text-gray-700 py-2 rounded-lg"
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('All');
                          setSelectedGender('All');
                          setSelectedCondition('All');
                          setPointsRange([0, 100]);
                          setMobileFiltersOpen(false);
                        }}
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Items Grid */}
          <div className="flex-1">
            {filteredItems.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <div className="text-gray-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No items found</h3>
                <p className="text-gray-500">Try adjusting your filters or search term</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500 mb-4">{filteredItems.length} items found</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map(item => (
                    <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="relative h-48 overflow-hidden group">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                          onClick={() => navigate(`/item/${item.id}`)}
                        />
                        <div className="absolute top-0 right-0 bg-[#1F77B4F2] text-white px-2 py-1 text-sm font-medium">
                          {item.pointsValue} pts
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 
                          className="font-medium text-gray-900 hover:text-[#1F77B4F2] cursor-pointer truncate"
                          onClick={() => navigate(`/item/${item.id}`)}
                        >
                          {item.name}
                        </h3>
                        <div className="mt-1 flex justify-between items-center">
                          <span className="text-sm text-gray-500 truncate">{item.brand}</span>
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{item.size}</span>
                        </div>
                        <div className="mt-2 flex justify-between">
                          <span className="text-sm text-gray-500">{item.category}</span>
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{item.condition}</span>
                        </div>
                        <div className="mt-3 flex items-center text-sm">
                          <span className="text-gray-500">Listed by</span>
                          <span className="ml-1 font-medium truncate">{item.uploader.name}</span>
                          <div className="ml-2 flex items-center text-yellow-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="ml-1 text-xs text-gray-600">{item.uploader.rating}</span>
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseItems; 