import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
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