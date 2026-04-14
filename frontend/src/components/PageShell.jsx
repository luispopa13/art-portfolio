/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

export default function PageShell({ 
  children, 
  maxWidth = "max-w-6xl", 
  noPadding = false,
  className = "" 
}) {
  return (
    <motion.main 
      className={`pt-24 pb-20 min-h-screen transition-colors duration-300 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`${maxWidth} mx-auto ${noPadding ? "" : "px-6"}`}>
        {children}
      </div>
    </motion.main>
  );
}
