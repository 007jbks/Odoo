import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState({ users: true, products: true });

  useEffect(() => {
    // Fetch users data
    const fetchUsers = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('http://localhost:8000/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        // For demo, populate with mock data if API fails
        setUsers([
          { id: 1, name: 'John Doe', email: 'john@example.com', joined: '2023-10-15' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', joined: '2023-11-02' },
          { id: 3, name: 'Michael Brown', email: 'michael@example.com', joined: '2023-09-28' },
          { id: 4, name: 'Sarah Johnson', email: 'sarah@example.com', joined: '2023-12-05' },
          { id: 5, name: 'Alex Wilson', email: 'alex@example.com', joined: '2024-01-10' },
        ]);
      } finally {
        setLoading(prev => ({ ...prev, users: false }));
      }
    };

    // Fetch products data
    const fetchProducts = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('http://localhost:8000/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        // For demo, populate with mock data if API fails
        setProducts([
          { id: 1, name: 'Vintage Denim Jacket', owner: 'John Doe', category: 'Outerwear', condition: 'Good', listed: '2024-01-05' },
          { id: 2, name: 'Cotton T-Shirt', owner: 'Jane Smith', category: 'Tops', condition: 'Like New', listed: '2024-02-12' },
          { id: 3, name: 'Leather Boots', owner: 'Michael Brown', category: 'Footwear', condition: 'Fair', listed: '2024-01-28' },
          { id: 4, name: 'Summer Dress', owner: 'Sarah Johnson', category: 'Dresses', condition: 'Excellent', listed: '2024-03-01' },
          { id: 5, name: 'Winter Coat', owner: 'Alex Wilson', category: 'Outerwear', condition: 'Good', listed: '2024-02-20' },
        ]);
      } finally {
        setLoading(prev => ({ ...prev, products: false }));
      }
    };

    fetchUsers();
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // Replace with your actual API endpoint
        await fetch(`http://localhost:8000/api/products/${productId}`, {
          method: 'DELETE',
        });
        // Remove the product from the state
        setProducts(products.filter(product => product.id !== productId));
        alert('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-[#1F77B4F2] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-white">ReWear</div>
            <div className="ml-4 text-white bg-[#1F77B4] px-3 py-1 rounded-full text-xs">Admin Panel</div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-white">Admin User</div>
            <Link to="/" className="text-white hover:text-gray-200 text-sm">
              Logout
            </Link>
          </div>
        </div>
      </header>

      {/* Admin Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Admin Dashboard</h1>
        
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm font-medium uppercase mb-2">Total Users</h3>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-gray-900">1,254</div>
              <div className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">+12%</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm font-medium uppercase mb-2">Active Listings</h3>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-gray-900">845</div>
              <div className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">+5%</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm font-medium uppercase mb-2">Completed Exchanges</h3>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-gray-900">348</div>
              <div className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">+8%</div>
            </div>
          </div>
        </div>

        {/* Users Management Section */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">All Users</h2>
            <input 
              type="text" 
              placeholder="Search users..." 
              className="border rounded-md px-3 py-1 text-sm"
            />
          </div>
          <div className="p-6 overflow-x-auto">
            {loading.users ? (
              <p className="text-center py-4">Loading users...</p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joined}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-blue-600 hover:text-blue-800 mr-3">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="px-6 py-3 border-t border-gray-200 flex justify-between">
            <div className="text-sm text-gray-500">Showing {users.length} users</div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border rounded text-sm">Previous</button>
              <button className="px-3 py-1 border rounded text-sm">Next</button>
            </div>
          </div>
        </div>

        {/* Products Management Section */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">All Listed Products</h2>
            <input 
              type="text" 
              placeholder="Search products..." 
              className="border rounded-md px-3 py-1 text-sm"
            />
          </div>
          <div className="p-6 overflow-x-auto">
            {loading.products ? (
              <p className="text-center py-4">Loading products...</p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listed Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{product.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.owner}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.condition}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.listed}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-blue-600 hover:text-blue-800 mr-3">View</button>
                        <button 
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="px-6 py-3 border-t border-gray-200 flex justify-between">
            <div className="text-sm text-gray-500">Showing {products.length} products</div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border rounded text-sm">Previous</button>
              <button className="px-3 py-1 border rounded text-sm">Next</button>
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[1, 2, 3, 4, 5].map((item) => (
                  <tr key={item} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">User #{Math.floor(Math.random() * 900) + 100}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {['Listed Item', 'Requested Swap', 'Completed Exchange', 'Updated Profile'][Math.floor(Math.random() * 4)]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {['T-Shirt', 'Jeans', 'Dress', 'Jacket', 'Shoes'][Math.floor(Math.random() * 5)]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {`${Math.floor(Math.random() * 12) + 1} hours ago`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Admin Controls */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Admin Controls</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="bg-[#1F77B4F2] hover:bg-[#1F77B4] text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors">
                Manage Users
              </button>
              <button className="bg-[#1F77B4F2] hover:bg-[#1F77B4] text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors">
                Moderate Listings
              </button>
              <button className="bg-[#1F77B4F2] hover:bg-[#1F77B4] text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors">
                View Reports
              </button>
              <button className="bg-[#1F77B4F2] hover:bg-[#1F77B4] text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors">
                System Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 