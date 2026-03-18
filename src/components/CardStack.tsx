import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { PlayerCards } from '@/entities';
import { Image } from '@/components/ui/image';

interface CardStackProps {
  cards: PlayerCards[];
  onClose: () => void;
}

export default function CardStack({ cards, onClose }: CardStackProps) {
  const [cardOrder, setCardOrder] = useState<PlayerCards[]>(cards);

  const handleCardClick = () => {
    if (cardOrder.length > 1) {
      setCardOrder((prev) => {
        const newOrder = [...prev];
        const topCard = newOrder.shift();
        if (topCard) {
          newOrder.push(topCard);
        }
        return newOrder;
      });
    }
  };

  const getRarityColor = (rarity?: string) => {
    // Subtle color tones per new rarities:
    // Common -> gray, Uncommon -> green, Rare -> blue, Very Rare / Legendary -> red
    switch (rarity) {
      case 'Very Rare':
      case 'Legendary':
        return 'from-red-200 to-red-300';
      case 'Rare':
      case 'Epic':
        return 'from-blue-200 to-blue-300';
      case 'Uncommon':
        return 'from-green-200 to-green-300';
      case 'Common':
      default:
        return 'from-gray-100 to-gray-200';
    }
  };

  const getRarityBadgeColor = (rarity?: string) => {
    switch (rarity) {
      case 'Very Rare':
      case 'Legendary':
        return 'bg-red-200';
      case 'Rare':
      case 'Epic':
        return 'bg-blue-200';
      case 'Uncommon':
        return 'bg-green-200';
      case 'Common':
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.button
        onClick={onClose}
        className="absolute top-8 right-8 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-foreground/10 transition-colors z-50"
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
      >
        <X className="w-6 h-6 text-foreground" />
      </motion.button>

      <div className="relative w-full max-w-6xl h-[600px] flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          {cardOrder.map((card, index) => {
            const isTop = index === 0;
            const offset = index * 40;
            const rotation = index * 2;

            return (
              <motion.div
                key={`${card._id}-${index}`}
                layoutId={card._id}
                initial={{ x: 300, opacity: 0, scale: 0.8 }}
                animate={{
                  x: offset,
                  opacity: 1,
                  scale: 1,
                  rotate: rotation,
                  zIndex: cardOrder.length - index,
                }}
                exit={{ x: -300, opacity: 0, scale: 0.8 }}
                transition={{
                  type: 'spring',
                  bounce: 0.4,
                  duration: 0.6,
                }}
                onClick={handleCardClick}
                className={`absolute ${isTop ? 'cursor-pointer' : 'cursor-default'}`}
                style={{
                  transformOrigin: 'center center',
                }}
              >
                <motion.div
                  whileHover={isTop ? { scale: 1.05, y: -10 } : {}}
                  whileTap={isTop ? { scale: 0.95 } : {}}
                  className="w-80 h-[480px] rounded-[24px] shadow-2xl overflow-hidden bg-white"
                >
                  {/* Card Header with Gradient */}
                  <div className={`h-12 bg-gradient-to-r ${getRarityColor(card.rarityLevel)} flex items-center justify-between px-6`}>
                    <span className="text-white font-heading text-lg font-bold">
                      {card.playerPosition || 'Player'}
                    </span>
                    <span className={`${getRarityBadgeColor(card.rarityLevel)} text-white px-3 py-1 rounded-full text-sm font-heading font-bold`}>
                      {card.rarityLevel || 'Common'}
                    </span>
                  </div>

                  {/* Player Image */}
                  <div className="relative h-64 bg-gradient-to-b from-background to-white overflow-hidden">
                    {card.cardImage ? (
                      <Image
                        src={card.cardImage}
                        alt={card.playerName || 'Player'}
                        className="w-full h-full object-cover"
                        width={320}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-8xl">
                        ⚽
                      </div>
                    )}
                    
                    {/* Shine Effect */}
                    <motion.div
                      animate={{
                        x: ['-200%', '200%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      style={{ width: '50%' }}
                    />
                  </div>

                  {/* Player Info */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-3xl font-heading text-foreground font-bold mb-1">
                        {card.playerName || 'Unknown Player'}
                      </h3>
                      <p className="text-lg text-foreground/70 font-paragraph">
                        {card.teamName || 'Unknown Team'}
                      </p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center justify-between">
                      <span className="text-base text-foreground/70 font-paragraph">
                        Overall Rating
                      </span>
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring', bounce: 0.6 }}
                        className="text-4xl font-heading text-primary font-bold"
                      >
                        {card.overallRating || 75}
                      </motion.span>
                    </div>
                  </div>

                  {/* Card Border Glow */}
                  <div className={`absolute inset-0 rounded-[24px] bg-gradient-to-r ${getRarityColor(card.rarityLevel)} opacity-0 hover:opacity-20 transition-opacity pointer-events-none`} />
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Instruction Text */}
        {cardOrder.length > 1 && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-xl font-paragraph bg-black/50 px-6 py-3 rounded-full"
          >
            Click the card to see the next one
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
