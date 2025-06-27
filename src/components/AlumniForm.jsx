import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, Check, User, Calendar, BookOpen, QrCode, ChevronDown } from 'lucide-react';
import QRCode from 'qrcode';

const engineeringBranches = [
  'Computer Science and Engineering',
  'Mathematics and Computing',
  'Electronics and Communication Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Mining Engineering',
  'Mining Machinery Engineering',
  'Engineering Physics',
  'Environmental Engineering',
  'Mineral and Metallurgical Engineering',
  'Petroleum Engineering'
];

const AlumniForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    batch: '',
    branch: '',
    photoFile: null,
    photoUrl: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [qrImage, setQrImage] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'photoFile' && files && files[0]) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        photoFile: file,
        photoUrl: url,
      }));
      setErrors(prev => ({ ...prev, photo: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBranchSelect = (branch) => {
    setFormData(prev => ({ ...prev, branch }));
    setErrors(prev => ({ ...prev, branch: '' }));
    setIsDropdownOpen(false);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.batch.trim()) newErrors.batch = 'Batch is required';
    if (!formData.branch.trim()) newErrors.branch = 'Branch is required';
    if (!formData.photoFile) newErrors.photo = 'Photo is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmitted(true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith('image/')) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        photoFile: file,
        photoUrl: url,
      }));
      setErrors(prev => ({ ...prev, photo: '' }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  useEffect(() => {
    if (!submitted) return;

    const { photoFile, photoUrl, ...qrData } = formData;
    QRCode.toDataURL(JSON.stringify(qrData), { 
      width: 300, 
      margin: 2,
      color: {
        dark: '#1e40af',
        light: '#ffffff'
      }
    })
      .then((url) => setQrImage(url))
      .catch(console.error);
  }, [submitted, formData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const goToCard = () => {
    navigate('/card', {
      state: {
        name: formData.name,
        batch: formData.batch,
        degree: formData.branch,
        photoUrl: formData.photoUrl,
        qrUrl: qrImage,
      },
    });
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 sm:p-12 border border-white/20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-10"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">Alumni Registration</h1>
            <p className="text-gray-600 text-lg">Create your digital alumni card</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <label className="block text-base font-semibold text-gray-700 mb-3">
                <User className="w-5 h-5 inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-6 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-0 text-lg ${
                  errors.name 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-blue-500'
                } bg-gray-50 focus:bg-white`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2"
                >
                  {errors.name}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <label className="block text-base font-semibold text-gray-700 mb-3">
                <Calendar className="w-5 h-5 inline mr-2" />
                Batch Year
              </label>
              <input
                type="number"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                min={1900}
                max={new Date().getFullYear() + 5}
                className={`w-full px-6 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-0 text-lg ${
                  errors.batch 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-blue-500'
                } bg-gray-50 focus:bg-white`}
                placeholder="e.g., 2022"
              />
              {errors.batch && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2"
                >
                  {errors.batch}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              ref={dropdownRef}
            >
              <label className="block text-base font-semibold text-gray-700 mb-3">
                <BookOpen className="w-5 h-5 inline mr-2" />
                Branch/Department
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full px-6 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-0 text-lg text-left flex items-center justify-between ${
                    errors.branch 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-blue-500'
                  } bg-gray-50 hover:bg-white`}
                >
                  <span className={formData.branch ? 'text-gray-900' : 'text-gray-500'}>
                    {formData.branch || 'Select your branch'}
                  </span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                    >
                      {engineeringBranches.map((branch) => (
                        <button
                          key={branch}
                          type="button"
                          onClick={() => handleBranchSelect(branch)}
                          className="w-full px-6 py-3 text-left hover:bg-blue-50 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
                        >
                          {branch}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {errors.branch && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2"
                >
                  {errors.branch}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <label className="block text-base font-semibold text-gray-700 mb-3">
                <Camera className="w-5 h-5 inline mr-2" />
                Profile Photo
              </label>
              
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                  isDragOver
                    ? 'border-blue-400 bg-blue-50'
                    : errors.photo
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  name="photoFile"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
                
                {formData.photoUrl ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-4"
                  >
                    <img
                      src={formData.photoUrl}
                      alt="Preview"
                      className="w-40 h-40 object-cover rounded-xl mx-auto shadow-lg"
                    />
                    <p className="text-base text-gray-600">Click to change photo</p>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-gray-600 font-medium text-lg">Upload your photo</p>
                      <p className="text-base text-gray-500 mt-2">Drag and drop or click to browse</p>
                    </div>
                  </div>
                )}
              </div>
              
              {errors.photo && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2"
                >
                  {errors.photo}
                </motion.p>
              )}
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              type="submit"
              disabled={submitted}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-5 rounded-xl font-semibold text-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {submitted ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Generating QR Code...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <QrCode className="w-6 h-6 mr-3" />
                  Generate QR Code
                </div>
              )}
            </motion.button>
          </form>

          <AnimatePresence>
            {submitted && qrImage && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="mt-10 p-8 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200"
              >
                <div className="flex flex-col items-center space-y-6">
                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">QR Code Generated!</h3>
                  
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="bg-white p-6 rounded-xl shadow-sm"
                  >
                    <img
                      src={qrImage}
                      alt="Generated QR Code"
                      className="w-48 h-48 mx-auto"
                    />
                  </motion.div>
                  
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    onClick={goToCard}
                    className="bg-emerald-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    View Alumni Card
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default AlumniForm;