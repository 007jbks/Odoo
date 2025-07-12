import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const FeaturedItem = ({ image, title, category, size }) => (
  <div className="flex-shrink-0 w-64 mx-2 rounded-lg overflow-hidden shadow-lg bg-white">
    <img src={image} alt={title} className="w-full h-64 object-cover" />
    <div className="p-4">
      <span className="inline-block bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full mb-2">
        {category}
      </span>
      <h3 className="font-medium text-gray-900">{title}</h3>
      <div className="flex justify-between items-center mt-2">
        <span className="text-gray-600 text-sm">Size: {size}</span>
        <button className="bg-[#1F77B4F2] text-white text-xs px-3 py-1 rounded-full hover:bg-[#1F77B4] transition-colors">
          View Item
        </button>
      </div>
    </div>
  </div>
);

const LandingPage = () => {
  const navigate = useNavigate();

  const featuredItems = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=870&auto=format&fit=crop",
      title: "Denim Jacket",
      category: "Outerwear",
      size: "M"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=327&auto=format&fit=crop",
      title: "Summer Dress",
      category: "Women's",
      size: "S"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=464&auto=format&fit=crop",
      title: "Casual T-Shirt",
      category: "Men's",
      size: "L"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=415&auto=format&fit=crop",
      title: "Vintage Sweater",
      category: "Knitwear",
      size: "XL"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=870&auto=format&fit=crop",
      title: "Leather Boots",
      category: "Footwear",
      size: "EU 40"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0 bg-cover bg-center" 
             style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=870&auto=format&fit=crop')", filter: "brightness(0.5)" }}>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              ReWear
              <span className="block text-2xl md:text-3xl mt-2 text-[#1F77B4F2]">Community Clothing Exchange</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl">
              Promote sustainable fashion and reduce textile waste by exchanging your unused garments 
              with others in your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="px-6 py-3 bg-[#1F77B4F2] text-white rounded-full font-semibold shadow hover:bg-[#1F77B4] transition-colors text-lg"
                onClick={() => navigate("/auth")}
              >
                Start Swapping
              </button>
              <button
                className="px-6 py-3 bg-white text-[#1F77B4F2] rounded-full font-semibold shadow hover:bg-gray-100 transition-colors text-lg"
                onClick={() => navigate('/browse')}
              >
                Browse Items
              </button>
              <button
                className="px-6 py-3 bg-transparent text-white border-2 border-white rounded-full font-semibold hover:bg-white hover:text-[#1F77B4F2] transition-colors text-lg"
                onClick={() => navigate("/auth")}
              >
                List an Item
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#1F77B4F2] rounded-full w-16 h-16 flex items-center justify-center text-white text-2xl font-bold mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">List Your Items</h3>
              <p className="text-gray-600">Take photos and describe your unused clothing items that are still in good condition.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#1F77B4F2] rounded-full w-16 h-16 flex items-center justify-center text-white text-2xl font-bold mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Connect & Exchange</h3>
              <p className="text-gray-600">Find items you like and arrange direct swaps or use our point-based redemption system.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#1F77B4F2] rounded-full w-16 h-16 flex items-center justify-center text-white text-2xl font-bold mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Reduce & Reuse</h3>
              <p className="text-gray-600">Give your clothes a second life and reduce textile waste while refreshing your wardrobe.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section id="featured" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">Featured Items</h2>
          <p className="text-center text-gray-600 mb-8">Discover some of the latest additions to our community exchange</p>
          
          <div className="relative">
            <div className="overflow-x-auto py-4 scrollbar-hide">
              <div className="flex space-x-4 w-max px-6">
                {featuredItems.map((item) => (
                  <FeaturedItem
                    key={item.id}
                    image={item.image}
                    title={item.title}
                    category={item.category}
                    size={item.size}
                  />
                ))}
              </div>
            </div>
            {/* Scroll indicators */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
              <button className="bg-white p-2 rounded-full shadow-md text-gray-700 hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
              <button className="bg-white p-2 rounded-full shadow-md text-gray-700 hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <button
              className="px-6 py-3 bg-[#1F77B4F2] text-white rounded-full font-semibold shadow hover:bg-[#1F77B4] transition-colors"
              onClick={() => navigate("/auth")}
            >
              View All Items
            </button>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Environmental Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-[#1F77B4F2] text-4xl font-bold mb-2">85%</div>
              <p className="text-gray-600">of textiles end up in landfills each year</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-[#1F77B4F2] text-4xl font-bold mb-2">700</div>
              <p className="text-gray-600">gallons of water saved per swapped item</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-[#1F77B4F2] text-4xl font-bold mb-2">1,200+</div>
              <p className="text-gray-600">successful exchanges in our community</p>
            </div>
          </div>
          <div className="text-center mt-8 text-gray-600">
            <p className="max-w-2xl mx-auto">
              By participating in the ReWear community, you're helping reduce the environmental footprint
              of the fashion industry and promoting a more sustainable approach to clothing consumption.
            </p>
          </div>
        </div>
      </section>

      {/* Join Community CTA */}
      <section className="py-16 bg-[#1F77B4F2] text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Growing Community</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Start swapping, reduce waste, and refresh your wardrobe today.
            It's free to join!
          </p>
          <button
            className="px-8 py-4 bg-white text-[#1F77B4F2] rounded-full font-bold text-lg shadow hover:bg-gray-100 transition-colors"
            onClick={() => navigate("/auth")}
          >
            Sign Up Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-400">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="text-2xl font-bold text-white">ReWear</div>
              </div>
              <p className="text-sm mt-2">Community Clothing Exchange</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white transition-colors">About Us</a>
              <a href="#" className="hover:text-white transition-colors">How It Works</a>
              <a href="#" className="hover:text-white transition-colors">FAQ</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-center">
            &copy; {new Date().getFullYear()} ReWear. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
