import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', bounce: 0.3 }}
      className="bg-white shadow-md sticky top-0 z-50"
    >
      <div className="max-w-[120rem] mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-10 h-10 text-primary" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-heading text-primary font-bold">
              Football Pack Opener
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a 
              href="#home" 
              className="text-lg font-paragraph text-foreground hover:text-primary transition-colors duration-300"
            >
              Home
            </a>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}
