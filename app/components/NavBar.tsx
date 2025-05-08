'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { navBarOptions } from '@/data/navBarOptions';

const NavBar = () => {
  const [visible, setVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const router = useRouter();

  const goTo = (path: any) => {
    router.push(path);
  };

  useEffect(() => {
    setIsMounted(true);

    const handleMouseMove = (e: any) => {
      const { clientY } = e;
      const showAt = 100;

      if (clientY < showAt) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div
      className={`hidden md:flex lg:flex xl:flex bg-slate-100 fixed top-1 left-1/2 transform -translate-x-1/2 grid grid-cols-13 text-white p-3 transition-opacity duration-300 gap-3 rounded-3xl z-10 ${
        visible ? 'opacity-95' : 'opacity-0'
      }`}
    >
      {navBarOptions.map((navBarOption) => (
        <motion.div
          key={navBarOption.id}
          onClick={navBarOption.slug ? () => goTo(navBarOption.slug) : navBarOption.onClick}
          whileHover={navBarOption.whileHover}
          whileTap={navBarOption.whileTap}
        >
          <Image
            className="hover:scale-110 rounded-2xl"
            src={navBarOption.image.src}
            alt={navBarOption.image.alt}
            height={navBarOption.image.height}
            width={navBarOption.image.width}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default NavBar;