import React from 'react';
import { Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const Preloader: React.FC = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50">
      <Loader className="w-16 h-16 text-white-500 animate-spin" />
      <motion.h1
        className="mt-4 text-2xl font-semibold text-gray-100"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Loading...
      </motion.h1>
    </div>
  );
};

export default Preloader;
