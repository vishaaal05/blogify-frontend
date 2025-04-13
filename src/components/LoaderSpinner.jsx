import { motion } from "framer-motion";

export const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <motion.div
        className="w-16 h-16 border-4 border-rose-200 border-t-rose-500 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.p
        className="mt-4 text-lg text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Preparing your reading journey...
      </motion.p>
    </div>
  );
};