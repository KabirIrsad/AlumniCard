import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function AlumniCard() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (!state) navigate('/', { replace: true });
  }, [state, navigate]);

  if (!state) return null;

  const { name, batch, degree, photoUrl, qrUrl } = state;

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotateX = useTransform(mouseY, [0, 1], [15, -15]);
  const rotateY = useTransform(mouseX, [0, 1], [-15, 15]);
  const smoothRotateX = useSpring(rotateX, { stiffness: 120, damping: 15 });
  const smoothRotateY = useSpring(rotateY, { stiffness: 120, damping: 15 });
  const [isHover, setIsHover] = useState(false);
  const scale = useSpring(isHover ? 1.07 : 1, { stiffness: 200, damping: 25 });
  const z = useSpring(isHover ? -80 : 0, { stiffness: 200, damping: 25 });
  const shadowOffsetX = useTransform(smoothRotateY, v => -v * 2);
  const shadowOffsetY = useTransform(smoothRotateX, v => v * 2);
  const tiltMag = useTransform([smoothRotateX, smoothRotateY], ([x, y]) => Math.min(Math.abs(x) + Math.abs(y), 30));
  const shadowBlur = useTransform(tiltMag, [0, 30], [20, 40]);
  const shadowSpread = useTransform(tiltMag, [0, 30], [10, 20]);
  const boxShadow = useTransform(
    [shadowOffsetX, shadowOffsetY, shadowBlur, shadowSpread],
    ([x, y, blur, spread]) => `rgba(0,0,0,0.5) ${x}px ${y}px ${blur}px ${spread}px`
  );

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };
  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
    setIsHover(false);
  };
  const handleMouseEnter = () => setIsHover(true);

  const flipTrans = { type: 'spring', stiffness: 400, damping: 30 };

  const logo1 = '/leftlogo.png';
  const logo2 = '/100logo.png';
  const logo3 = '/celebration2.png';
  const banner = '/logowhite.png';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        {/* Navigation */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-8 transition-colors duration-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Form
        </motion.button>

        {/* Card Container */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-[95vw] sm:w-[640px]" style={{ perspective: 2200 }}>
            <motion.div
              className="relative w-full h-[360px] sm:h-[400px] rounded-3xl cursor-pointer"
              style={{
                rotateX: smoothRotateX,
                rotateY: smoothRotateY,
                scale,
                z,
                boxShadow,
                transformStyle: 'preserve-3d',
                willChange: 'transform'
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onMouseEnter={handleMouseEnter}
              onClick={() => setFlipped(!flipped)}
            >
              {/* FRONT */}
              <motion.div
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={flipTrans}
                className="absolute inset-0 rounded-3xl"
                style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
              >
                <div
                  className="w-full h-full rounded-3xl px-6 sm:px-12 py-8 sm:py-10 overflow-hidden border border-gray-600"
                  style={{ background: 'linear-gradient(135deg,#8a6b23 0%,#7a5b1c 50%,#5e4614 100%)' }}
                >
                  {/* Logos */}
                  <img src={logo1} alt="" className="absolute top-4 sm:top-5 left-4 sm:left-6 w-14 sm:w-18 h-14 sm:h-20 object-fill" />
                  <img src={logo2} alt="" className="absolute top-4 sm:top-5 left-1/2 -translate-x-1/2 w-28 sm:w-36 h-10 sm:h-14 object-fill" />
                  <img src={logo3} alt="" className="absolute top-4 sm:top-5 right-4 sm:right-6 w-16 sm:w-20 h-16 sm:h-20 object-fill" />

                  {/* Banner */}
                  <img src={banner} alt="" className="absolute top-20 left-0 w-full px-6 object-contain max-h-[80px] sm:max-h-[90px]" />

                  {/* Title */}
                  <div
                    className="absolute top-[44%] left-1/2 text-white text-2xl sm:text-5xl font-semibold uppercase tracking-wide whitespace-nowrap"
                    style={{ transform: 'translate(-50%,-10%)', textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}
                  >
                    LIFE TIME ALUMNI CARD
                  </div>

                  {/* Info */}
                  <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 space-y-1 sm:space-y-2 pr-24 sm:pr-36">
                    <p className="text-lg sm:text-2xl font-bold text-black drop-shadow">{name.toUpperCase()}</p>
                    <p className="text-sm sm:text-base font-semibold text-black uppercase">Batch: {batch}</p>
                    <p className="text-sm sm:text-base font-semibold text-black uppercase leading-tight">Bachelor of Technology in {degree}</p>
                  </div>

                  {/* Photo */}
                  <img
                    src={photoUrl || 'https://via.placeholder.com/80x100'}
                    alt={name}
                    className="absolute bottom-6 sm:bottom-10 right-6 sm:right-10 w-20 sm:w-28 h-24 sm:h-32 rounded-xl border-2 border-white object-cover shadow-lg"
                  />
                </div>
              </motion.div>

              {/* BACK */}
              <motion.div
                animate={{ rotateY: flipped ? 0 : -180 }}
                transition={flipTrans}
                className="absolute inset-0 rounded-3xl flex justify-center items-center border border-gray-600"
                style={{
                  background: 'linear-gradient(135deg,#8a6b23 0%,#7a5b1c 50%,#5e4614 100%)',
                  color: 'white',
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden'
                }}
              >
                <div className="text-center">
                  <h3 className="text-white text-xl font-semibold mb-4">QR Code</h3>
                  <img
                    src={qrUrl}
                    alt="QR Code"
                    className="w-32 sm:w-44 h-32 sm:h-44 rounded-lg shadow-lg border border-gray-400 mx-auto"
                  />
                  <p className="text-white/80 text-sm mt-4">Click to flip back</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-gray-600 text-base">
            Click on the card to flip and view the QR code
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}