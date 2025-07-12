import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddItem = () => {
  const navigate = useNavigate();
  
  // Available categories for dropdown
  const categories = [
    'Outerwear', 'Tops', 'Bottoms', 'Dresses', 'Knitwear', 
    'Footwear', 'Accessories', 'Activewear', 'Formal', 'Sleepwear'
  ];
  
  // Available conditions for dropdown
  const conditions = ['Like New', 'Excellent', 'Good', 'Fair'];
  
  // Available sizes
  const sizes = {
    tops: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
    bottoms: ['26', '28', '30', '32', '34', '36', '38', '40', '42'],
    shoes: ['5', '6', '7', '8', '9', '10', '11', '12', '13']
  };

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    size: '',
    brand: '',
    originalPrice: '',
    condition: '',
    pointsValue: '',
    gender: 'Unisex',
    dateAdded: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
  });
  
  // Selected images state
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  
  // Validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Handle image selection
  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Check if too many images are selected (max 5)
      if (selectedImages.length + filesArray.length > 5) {
        setErrors({
          ...errors,
          images: 'You can upload a maximum of 5 images'
        });
        return;
      }
      
      // Update selected files
      setSelectedImages([...selectedImages, ...filesArray]);
      
      // Create preview URLs
      const newPreviewImages = filesArray.map(file => URL.createObjectURL(file));
      setPreviewImages([...previewImages, ...newPreviewImages]);
      
      // Clear any previous image error
      if (errors.images) {
        setErrors({
          ...errors,
          images: null
        });
      }
    }
  };
  
  // Remove an image from selection
  const removeImage = (index) => {
    const updatedSelectedImages = [...selectedImages];
    const updatedPreviewImages = [...previewImages];
    
    // Release object URL to prevent memory leaks
    URL.revokeObjectURL(updatedPreviewImages[index]);
    
    // Remove from arrays
    updatedSelectedImages.splice(index, 1);
    updatedPreviewImages.splice(index, 1);
    
    setSelectedImages(updatedSelectedImages);
    setPreviewImages(updatedPreviewImages);
  };
  
  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Item name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.size) newErrors.size = 'Size is required';
    if (!formData.condition) newErrors.condition = 'Condition is required';
    if (!formData.originalPrice) newErrors.originalPrice = 'Original price is required';
    if (!formData.pointsValue) newErrors.pointsValue = 'Points value is required';
    if (selectedImages.length === 0) newErrors.images = 'At least one image is required';
    
    return newErrors;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      // Scroll to the first error
      const firstErrorField = document.querySelector(`.${Object.keys(formErrors)[0]}`);
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call to submit the form data and images
      // For demo purposes, we're just simulating success after a short delay
      setTimeout(() => {
        console.log('Form submitted:', formData);
        console.log('Images to upload:', selectedImages);
        
        // Show success message
        setSubmitSuccess(true);
        
        // Reset form after 2 seconds and redirect to user dashboard
        setTimeout(() => {
          navigate('/user-dashboard');
        }, 2000);
      }, 1500);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({
        ...errors,
        submit: 'Failed to submit. Please try again.'
      });
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
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
            Back
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">List a New Item</h1>
          
          {submitSuccess ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
              <strong className="font-bold">Success! </strong>
              <span className="block sm:inline">Your item has been listed successfully.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Item name */}
              <div className="name">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Item Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#1F77B4F2] focus:border-[#1F77B4F2]`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
              
              {/* Description */}
              <div className="description">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your item in detail (condition, measurements, material, etc.)"
                  className={`mt-1 block w-full border ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#1F77B4F2] focus:border-[#1F77B4F2]`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>
              
              {/* Two columns layout for smaller inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <div className="category">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border ${
                      errors.category ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#1F77B4F2] focus:border-[#1F77B4F2]`}
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                  )}
                </div>
                
                {/* Size */}
                <div className="size">
                  <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                    Size *
                  </label>
                  <input
                    type="text"
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border ${
                      errors.size ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#1F77B4F2] focus:border-[#1F77B4F2]`}
                  />
                  {errors.size && <p className="mt-1 text-sm text-red-600">{errors.size}</p>}
                </div>
                
                {/* Brand */}
                <div>
                  <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                    Brand
                  </label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#1F77B4F2] focus:border-[#1F77B4F2]"
                  />
                </div>
                
                {/* Gender */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#1F77B4F2] focus:border-[#1F77B4F2]"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
                
                {/* Original Price */}
                <div className="originalPrice">
                  <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700">
                    Original Price ($) *
                  </label>
                  <input
                    type="number"
                    id="originalPrice"
                    name="originalPrice"
                    min="0"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className={`mt-1 block w-full border ${
                      errors.originalPrice ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#1F77B4F2] focus:border-[#1F77B4F2]`}
                  />
                  {errors.originalPrice && (
                    <p className="mt-1 text-sm text-red-600">{errors.originalPrice}</p>
                  )}
                </div>
                
                {/* Condition */}
                <div className="condition">
                  <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                    Condition *
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border ${
                      errors.condition ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#1F77B4F2] focus:border-[#1F77B4F2]`}
                  >
                    <option value="">Select condition</option>
                    {conditions.map(condition => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                  {errors.condition && (
                    <p className="mt-1 text-sm text-red-600">{errors.condition}</p>
                  )}
                </div>
                
                {/* Points Value */}
                <div className="pointsValue">
                  <label htmlFor="pointsValue" className="block text-sm font-medium text-gray-700">
                    Points Value *
                  </label>
                  <input
                    type="number"
                    id="pointsValue"
                    name="pointsValue"
                    min="1"
                    step="1"
                    value={formData.pointsValue}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border ${
                      errors.pointsValue ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#1F77B4F2] focus:border-[#1F77B4F2]`}
                  />
                  {errors.pointsValue && (
                    <p className="mt-1 text-sm text-red-600">{errors.pointsValue}</p>
                  )}
                </div>
                
                {/* Date Added */}
                <div>
                  <label htmlFor="dateAdded" className="block text-sm font-medium text-gray-700">
                    Date Added
                  </label>
                  <input
                    type="date"
                    id="dateAdded"
                    name="dateAdded"
                    value={formData.dateAdded}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#1F77B4F2] focus:border-[#1F77B4F2]"
                    readOnly
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Current date is automatically selected
                  </p>
                </div>
              </div>
              
              {/* Image Upload */}
              <div className="images">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Images * (Maximum 5)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="images"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-[#1F77B4F2] hover:text-[#1F77B4] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#1F77B4F2]"
                      >
                        <span>Upload files</span>
                        <input
                          id="images"
                          name="images"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="sr-only"
                          disabled={selectedImages.length >= 5}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5 files</p>
                  </div>
                </div>
                
                {/* Image preview */}
                {previewImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {previewImages.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="h-24 w-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}
              </div>
              
              {/* Submit error */}
              {errors.submit && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{errors.submit}</span>
                </div>
              )}
              
              {/* Submit button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 bg-[#1F77B4F2] text-white rounded-lg shadow hover:bg-[#1F77B4] transition-colors ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'List Item'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddItem; 