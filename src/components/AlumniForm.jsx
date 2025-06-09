// src/AlumniForm.jsx
import React, { useState, useEffect } from 'react';
import { toDataURL } from 'qrcode';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function AlumniForm() {
  const [formData, setFormData] = useState({
    name: '',
    batch: '',
    branch: '',
    photoUrl: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [qrImage, setQrImage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  // generate QR data-URL when submitted
  useEffect(() => {
    if (!submitted) return;
    const payload = JSON.stringify(formData);
    toDataURL(payload, { width: 200, margin: 2 })
      .then(url => setQrImage(url))
      .catch(err => console.error(err));
  }, [submitted, formData]);

  const goToCard = () => {
    navigate('/card', {
      state: {
        name: formData.name,
        batch: formData.batch,
        degree: formData.branch,
        photoUrl: formData.photoUrl,
        qrUrl: qrImage
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {/* Form container with entrance animation */}
      <motion.div
        className="w-full max-w-md bg-white rounded-lg shadow p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* NEW HEADER */}
        <h2 className="text-2xl font-bold text-center mb-4">
          Fill out this form to generate your personalized Alumni Card!
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {['name','batch','branch','photoUrl'].map((field, idx) => (
            <motion.div
              key={field}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * (idx + 1) }}
            >
              <label className="block mb-1 font-medium">
                {field === 'photoUrl'
                  ? 'Photo URL'
                  : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === 'photoUrl' ? 'url' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required={field !== 'photoUrl'}
              />
            </motion.div>
          ))}

          {/* Submit button with hover/tap animation */}
          <motion.button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Generate QR
          </motion.button>
        </form>

        {/* QR & “See Card” reveal */}
        <AnimatePresence>
          {submitted && qrImage && (
            <motion.div
              className="mt-6 text-center space-y-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
            >
              <div>
                <h3 className="text-lg font-semibold mb-2">Your QR Code</h3>
                <motion.img
                  src={qrImage}
                  alt="QR Code"
                  className="mx-auto"
                  initial={{ rotate: -10 }}
                  animate={{ rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 12 }}
                />
              </div>
              <motion.button
                onClick={goToCard}
                className="bg-green-600 text-white py-2 px-4 rounded"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                See your Alumni Card
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
