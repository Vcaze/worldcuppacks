import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface PackCardProps {
  isOpening: boolean;
  canOpen: boolean;
  onOpen: () => void;
}

export default function PackCard({ isOpening, canOpen, onOpen }: PackCardProps) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      exit={{ scale: 0, rotate: 180, opacity: 0 }}
      transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }}
      className="relative"
    >
      <motion.button
        onClick={onOpen}
        disabled={!canOpen || isOpening}
        whileHover={canOpen && !isOpening ? { scale: 1.05, rotate: [0, -2, 2, 0] } : {}}
        whileTap={canOpen && !isOpening ? { scale: 0.95 } : {}}
        className={`relative w-80 h-96 rounded-[32px] shadow-2xl overflow-hidden ${
          canOpen && !isOpening ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
        }`}
        style={{
          background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 50%, #FFC857 100%)',
        }}
      >
        {/* Pack Design */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          {/* Sparkle Effects */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute top-8 left-8"
          >
            <Sparkles className="w-8 h-8 text-white/50" />
          </motion.div>
          
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, -180, -360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
              delay: 1.5,
            }}
            className="absolute bottom-8 right-8"
          >
            <Sparkles className="w-8 h-8 text-white/50" />
          </motion.div>

          {/* Main Content */}
          <motion.div
            animate={isOpening ? {
              scale: [1, 1.2, 0.8, 1.2, 0],
              rotate: [0, 10, -10, 20, -20, 0],
            } : {}}
            transition={{ duration: 2 }}
            className="text-center"
          >
            <div className="text-8xl mb-4">⚽</div>
            <h2 className="text-4xl font-heading text-white font-bold mb-2">
              Player Pack
            </h2>
            <p className="text-xl font-paragraph text-white/90">
              5 Cards Inside
            </p>
          </motion.div>

          {/* Shine Effect */}
          <motion.div
            animate={{
              x: ['-200%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            style={{ width: '50%' }}
          />
        </div>

        {/* Opening Animation Overlay */}
        {isOpening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-white/90 flex items-center justify-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                rotate: [0, 360],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
            >
              <Sparkles className="w-20 h-20 text-primary" />
            </motion.div>
          </motion.div>
        )}
      </motion.button>

      {/* Floating Particles */}
      {canOpen && !isOpening && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-accent-orange"
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + (i % 3) * 30}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
}
