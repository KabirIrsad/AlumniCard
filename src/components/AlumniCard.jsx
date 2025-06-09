// src/AlumniCard.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function AlumniCard() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (!state) navigate('/', { replace: true });
  }, [state, navigate]);

  if (!state) return null;

  const { name, batch, degree, photoUrl, qrUrl } = state;

  // tilt & shadow
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
  const tiltMag = useTransform([smoothRotateX, smoothRotateY], ([x,y]) => Math.min(Math.abs(x)+Math.abs(y),30));
  const shadowBlur = useTransform(tiltMag, [0,30], [20,40]);
  const shadowSpread = useTransform(tiltMag, [0,30], [10,20]);
  const boxShadow = useTransform(
    [shadowOffsetX, shadowOffsetY, shadowBlur, shadowSpread],
    ([x,y,blur,spread]) => `rgba(0,0,0,0.5) ${x}px ${y}px ${blur}px ${spread}px`
  );

  const handleMouseMove = e => {
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

  // replace these with your actual public assets
  const logo1 = '/leftlogo.png';
  const logo2 = '/100logo.png';
  const logo3 = '/celebration2.png';
  const banner = '/logowhite.png';

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-200 to-gray-300 p-4">
      <div style={{ perspective: 2200 }}>
        <motion.div
          className="relative w-[640px] h-[400px] rounded-3xl cursor-pointer"
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
              className="w-full h-full rounded-3xl px-12 py-10 overflow-hidden border border-gray-600"
              style={{ background: 'linear-gradient(135deg,#8a6b23 0%,#7a5b1c 50%,#5e4614 100%)' }}
            >
              {/* Logos */}
              <img src={logo1} alt="" className="absolute top-5 left-6 w-18 h-20 object-fill" />
              <img src={logo2} alt="" className="absolute top-5 left-1/2 -translate-x-1/2 w-35 h-14 object-fill" />
              <img src={logo3} alt="" className="absolute top-5 right-6 w-20 h-20 object-fill" />

              {/* Banner */}
              <img src={banner} alt="" className="absolute top-20 left-0 w-full px-6 object-contain max-h-[90px]" />

              {/* Title */}
              <div
                className="absolute top-[44%] left-1/2 text-white text-5xl font-semibold uppercase tracking-wide whitespace-nowrap"
                style={{ transform: 'translate(-50%,-10%)', textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}
              >
                LIFE TIME ALUMNI CARD
              </div>

              {/* Info */}
              <div className="absolute bottom-10 left-10 space-y-2 pr-36">
                <p className="text-2xl font-bold text-black drop-shadow">{name.toUpperCase()}</p>
                <p className="font-semibold text-black uppercase">Batch: {batch}</p>
                <p className="font-semibold text-black uppercase leading-tight">Bachelor of Technology in {degree}</p>
              </div>

              {/* Photo */}
              <img
                src={photoUrl || 'https://via.placeholder.com/80x100'}
                alt={name}
                className="absolute bottom-10 right-10 w-28 h-32 rounded-xl border-2 border-white object-cover shadow-lg"
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
            <img
              src={qrUrl}
              alt="QR Code"
              className="w-44 h-44 rounded-lg shadow-lg border border-gray-400"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
