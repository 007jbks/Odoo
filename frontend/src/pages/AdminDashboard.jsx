import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState({ users: true, products: true, transactions: true });
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'transactions'
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    // Fetch users data
    const fetchUsers = async () => {
      try {
        // Replace with your actual Odoo API endpoint
        const response = await fetch('http://localhost:8000/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        // For demo, populate with mock data if API fails
        setUsers([
          { id: 1, name: 'John Doe', email: 'john@example.com', joined: '2023-10-15', phone: '+1234567890', status: 'Active', role: 'User' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', joined: '2023-11-02', phone: '+1987654321', status: 'Active', role: 'User' },
          { id: 3, name: 'Michael Brown', email: 'michael@example.com', joined: '2023-09-28', phone: '+1122334455', status: 'Inactive', role: 'User' },
          { id: 4, name: 'Sarah Johnson', email: 'sarah@example.com', joined: '2023-12-05', phone: '+1556677889', status: 'Active', role: 'User' },
          { id: 5, name: 'Alex Wilson', email: 'alex@example.com', joined: '2024-01-10', phone: '+1223344556', status: 'Active', role: 'User' },
        ]);
      } finally {
        setLoading(prev => ({ ...prev, users: false }));
      }
    };

    // Fetch products data
    const fetchProducts = async () => {
      try {
        // Replace with your actual Odoo API endpoint
        const response = await fetch('http://localhost:8000/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        // For demo, populate with mock data if API fails
        setProducts([
          { id: 1, name: 'Vintage Denim Jacket', owner: 'John Doe', category: 'Outerwear', condition: 'Good', listed: '2024-01-05', description: 'Classic vintage denim jacket in good condition', price: '$45', location: 'New York', image: 'https://via.placeholder.com/150' },
          { id: 2, name: 'Cotton T-Shirt', owner: 'Jane Smith', category: 'Tops', condition: 'Like New', listed: '2024-02-12', description: 'Plain white cotton t-shirt, barely worn', price: '$15', location: 'Los Angeles', image: 'https://via.placeholder.com/150' },
          { id: 3, name: 'Leather Boots', owner: 'Michael Brown', category: 'Footwear', condition: 'Fair', listed: '2024-01-28', description: 'Brown leather boots, some wear on soles', price: '$35', location: 'Chicago', image: 'https://via.placeholder.com/150' },
          { id: 4, name: 'Summer Dress', owner: 'Sarah Johnson', category: 'Dresses', condition: 'Excellent', listed: '2024-03-01', description: 'Floral summer dress, perfect for warm weather', price: '$25', location: 'Miami', image: 'https://via.placeholder.com/150' },
          { id: 5, name: 'Winter Coat', owner: 'Alex Wilson', category: 'Outerwear', condition: 'Good', listed: '2024-02-20', description: 'Heavy winter coat with hood, very warm', price: '$60', location: 'Boston', image: 'https://via.placeholder.com/150' },
        ]);
      } finally {
        setLoading(prev => ({ ...prev, products: false }));
      }
    };

    // Fetch transactions data
    const fetchTransactions = async () => {
      try {
        // Replace with your actual Odoo API endpoint
        const response = await fetch('http://localhost:8000/api/transactions');
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        // For demo, populate with mock data if API fails
        setTransactions([
          { id: 1, user: 'John Doe', type: 'Purchase', amount: '$45.00', date: '2024-03-01', status: 'Completed', item: 'Vintage Denim Jacket' },
          { id: 2, user: 'Jane Smith', type: 'Sale', amount: '$15.00', date: '2024-03-02', status: 'Completed', item: 'Cotton T-Shirt' },
          { id: 3, user: 'Michael Brown', type: 'Purchase', amount: '$35.00', date: '2024-03-05', status: 'Pending', item: 'Leather Boots' },
          { id: 4, user: 'Sarah Johnson', type: 'Sale', amount: '$25.00', date: '2024-03-08', status: 'Completed', item: 'Summer Dress' },
          { id: 5, user: 'Alex Wilson', type: 'Exchange', amount: '-', date: '2024-03-10', status: 'Processing', item: 'Winter Coat' },
        ]);
      } finally {
        setLoading(prev => ({ ...prev, transactions: false }));
      }
    };

    fetchUsers();
    fetchProducts();
    fetchTransactions();
  }, []);

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // Replace with your actual Odoo API endpoint
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

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  // Filter items based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransactions = transactions.filter(transaction => 
    transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(
    activeTab === 'users' 
      ? filteredUsers.length / itemsPerPage 
      : activeTab === 'products' 
        ? filteredProducts.length / itemsPerPage
        : filteredTransactions.length / itemsPerPage
  );

  // User Detail Modal
  const UserModal = () => {
    if (!selectedUser) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">User Details</h3>
            <button 
              onClick={() => setShowUserModal(false)} 
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500">User ID</p>
              <p className="text-gray-900">{selectedUser.id}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-gray-900">{selectedUser.name}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-gray-900">{selectedUser.email}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500">Join Date</p>
              <p className="text-gray-900">{selectedUser.joined}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className={`${selectedUser.status === 'Active' ? 'text-green-600' : 'text-red-600'} font-medium`}>
                {selectedUser.status}
              </p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500">Role</p>
              <p className="text-gray-900">{selectedUser.role}</p>
            </div>
          </div>
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-2">User Activity</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[1, 2, 3].map((item) => (
                    <tr key={item} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {['Listed Item', 'Updated Profile', 'Made Purchase'][Math.floor(Math.random() * 3)]}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {`${Math.floor(Math.random() * 28) + 1}-${Math.floor(Math.random() * 12) + 1}-2023`}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500">
                        {['Added new clothing item', 'Changed profile picture', 'Purchased winter coat'][Math.floor(Math.random() * 3)]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              onClick={() => setShowUserModal(false)}
            >
              Close
            </button>
            <button 
              className="px-4 py-2 bg-[#1F77B4F2] text-white rounded-md hover:bg-[#1F77B4]"
            >
              Edit User
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Product Detail Modal
  const ProductModal = () => {
    if (!selectedProduct) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Product Details</h3>
            <button 
              onClick={() => setShowProductModal(false)} 
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <img 
                src={selectedProduct.image || 'https://via.placeholder.com/300'} 
                alt={selectedProduct.name} 
                className="w-full rounded-md"
              />
            </div>
            <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Product ID</p>
                <p className="text-gray-900">#{selectedProduct.id}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-gray-900">{selectedProduct.name}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Owner</p>
                <p className="text-gray-900">{selectedProduct.owner}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Category</p>
                <p className="text-gray-900">{selectedProduct.category}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Condition</p>
                <p className="text-gray-900">{selectedProduct.condition}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Listed Date</p>
                <p className="text-gray-900">{selectedProduct.listed}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Price</p>
                <p className="text-gray-900">{selectedProduct.price}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="text-gray-900">{selectedProduct.location}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="text-gray-900">{selectedProduct.description}</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              onClick={() => setShowProductModal(false)}
            >
              Close
            </button>
            <button 
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              onClick={() => {
                setShowProductModal(false);
                handleDeleteProduct(selectedProduct.id);
              }}
            >
              Delete Product
            </button>
          </div>
        </div>
      </div>
    );
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
              <div className="text-3xl font-bold text-gray-900">{users.length > 5 ? '1,254' : users.length}</div>
              <div className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">+12%</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm font-medium uppercase mb-2">Active Listings</h3>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-gray-900">{products.length > 5 ? '845' : products.length}</div>
              <div className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">+5%</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-500 text-sm font-medium uppercase mb-2">Completed Exchanges</h3>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-gray-900">{transactions.length > 5 ? '348' : transactions.length}</div>
              <div className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">+8%</div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="flex border-b">
            <button
              className={`px-6 py-3 font-medium text-sm ${activeTab === 'users' ? 'border-b-2 border-[#1F77B4] text-[#1F77B4]' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => {
                setActiveTab('users');
                setCurrentPage(1);
              }}
            >
              All Users
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm ${activeTab === 'transactions' ? 'border-b-2 border-[#1F77B4] text-[#1F77B4]' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => {
                setActiveTab('transactions');
                setCurrentPage(1);
              }}
            >
              All Transactions
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm ${activeTab === 'products' ? 'border-b-2 border-[#1F77B4] text-[#1F77B4]' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => {
                setActiveTab('products');
                setCurrentPage(1);
              }}
            >
              All Products
            </button>
          </div>

          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              {activeTab === 'users' ? 'Users Management' : activeTab === 'transactions' ? 'Transaction Records' : 'Product Listings'}
            </h2>
            <div className="flex items-center">
              <input 
                type="text" 
                placeholder={`Search ${activeTab}...`} 
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="border rounded-md px-3 py-1 text-sm"
              />
            </div>
          </div>

          <div className="p-6 overflow-x-auto">
            {/* Users Table */}
            {activeTab === 'users' && (
              loading.users ? (
                <p className="text-center py-4">Loading users...</p>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{user.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold leading-5 rounded-full ${
                            user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joined}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button 
                            className="text-blue-600 hover:text-blue-800 mr-3"
                            onClick={() => handleViewUser(user)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}

            {/* Transactions Table */}
            {activeTab === 'transactions' && (
              loading.transactions ? (
                <p className="text-center py-4">Loading transactions...</p>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{transaction.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.user}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.item}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold leading-5 rounded-full ${
                            transaction.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                            transaction.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}

            {/* Products Table */}
            {activeTab === 'products' && (
              loading.products ? (
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
                    {currentProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{product.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.owner}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.condition}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.listed}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button 
                            className="text-blue-600 hover:text-blue-800 mr-3"
                            onClick={() => handleViewProduct(product)}
                          >
                            View
                          </button>
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
              )
            )}

            {/* No Results */}
            {(activeTab === 'users' && currentUsers.length === 0 && !loading.users) ||
             (activeTab === 'transactions' && currentTransactions.length === 0 && !loading.transactions) ||
             (activeTab === 'products' && currentProducts.length === 0 && !loading.products) ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No results found. Please try a different search term.</p>
              </div>
            ) : null}
          </div>

          {/* Pagination */}
          <div className="px-6 py-3 border-t border-gray-200 flex justify-between">
            <div className="text-sm text-gray-500">
              Showing {
                activeTab === 'users' ? 
                  `${Math.min(indexOfFirstItem + 1, filteredUsers.length)} - ${Math.min(indexOfLastItem, filteredUsers.length)} of ${filteredUsers.length}` :
                activeTab === 'transactions' ?
                  `${Math.min(indexOfFirstItem + 1, filteredTransactions.length)} - ${Math.min(indexOfLastItem, filteredTransactions.length)} of ${filteredTransactions.length}` :
                  `${Math.min(indexOfFirstItem + 1, filteredProducts.length)} - ${Math.min(indexOfLastItem, filteredProducts.length)} of ${filteredProducts.length}`
              } results
            </div>
            <div className="flex space-x-2">
              <button 
                className={`px-3 py-1 border rounded text-sm ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button 
                className={`px-3 py-1 border rounded text-sm ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
        
        {/* Admin Controls */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Admin Controls</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button 
                className="bg-[#1F77B4F2] hover:bg-[#1F77B4] text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors"
                onClick={() => setActiveTab('users')}
              >
                Manage Users
              </button>
              <button 
                className="bg-[#1F77B4F2] hover:bg-[#1F77B4] text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors"
                onClick={() => setActiveTab('products')}
              >
                Moderate Listings
              </button>
              <button 
                className="bg-[#1F77B4F2] hover:bg-[#1F77B4] text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors"
                onClick={() => setActiveTab('transactions')}
              >
                View Transactions
              </button>
              <button className="bg-[#1F77B4F2] hover:bg-[#1F77B4] text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors">
                System Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showUserModal && <UserModal />}
      {showProductModal && <ProductModal />}
    </div>
  );
};

export default AdminDashboard; 