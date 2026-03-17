// HPI 1.7-G
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Sparkles, Trophy, Star, Zap, Shield } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Image } from '@/components/ui/image';
import { PlayerCards } from '@/entities';
import { BaseCrudService } from '@/integrations';

const PLACEHOLDER_IMAGE = "https://static.wixstatic.com/media/5ff994_5f7c20baa11c4ab2b7faa4415cdfa077~mv2.png?originWidth=256&originHeight=384";

// --- Helper Components for the Joyful Experience ---

const FoilPack = ({ onOpen, disabled }: { onOpen: () => void, disabled: boolean }) => {
  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.05, rotate: [-2, 2, -2, 0], y: -10 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={!disabled ? onOpen : undefined}
      className={`relative w-72 h-[400px] rounded-[24px] cursor-pointer transition-all duration-300 ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : 'shadow-[0_20px_50px_rgba(255,107,107,0.3)] hover:shadow-[0_30px_60px_rgba(255,107,107,0.5)]'}`}
    >
      {/* Pack Background with Gradient */}
      <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-primary via-accent-purple to-secondary overflow-hidden">
        {/* Foil Texture Overlay */}
        <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-50" />
        
        {/* Pack Design Elements */}
        <div className="absolute inset-2 border-4 border-white/20 rounded-[16px] flex flex-col items-center justify-center p-6 text-white text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-10 opacity-20"
          >
            <Sparkles className="w-48 h-48" />
          </motion.div>
          
          <Trophy className="w-16 h-16 mb-4 text-accent-orange drop-shadow-lg" />
          <h3 className="font-heading text-4xl font-bold leading-tight tracking-wider drop-shadow-md">
            CHAMPIONS<br/>PACK
          </h3>
          <div className="mt-8 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
            <p className="text-sm font-bold tracking-widest uppercase">5 Players Inside</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const PlayerCardVisual = ({ card }: { card: PlayerCards }) => {
  const getRarityStyles = (rarity?: string) => {
    switch (rarity?.toLowerCase()) {
      case 'legendary':
        return { bg: 'bg-gradient-to-br from-accent-orange to-yellow-600', border: 'border-accent-orange', text: 'text-accent-orange', icon: <Star className="w-4 h-4" /> };
      case 'epic':
        return { bg: 'bg-gradient-to-br from-accent-purple to-purple-800', border: 'border-accent-purple', text: 'text-accent-purple', icon: <Zap className="w-4 h-4" /> };
      case 'rare':
        return { bg: 'bg-gradient-to-br from-secondary to-teal-700', border: 'border-secondary', text: 'text-secondary', icon: <Shield className="w-4 h-4" /> };
      default:
        return { bg: 'bg-gradient-to-br from-gray-300 to-gray-500', border: 'border-gray-400', text: 'text-gray-600', icon: null };
    }
  };

  const styles = getRarityStyles(card.rarityLevel);

  return (
    <div className={`w-[280px] h-[400px] rounded-[24px] border-4 ${styles.border} bg-white shadow-2xl overflow-hidden flex flex-col relative group`}>
      {/* Image Section */}
      <div className={`h-[55%] relative ${styles.bg} p-1`}>
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8Y2lyY2xlIGN4PSI0IiBjeT0iNCIgcj0iMSIgZmlsbD0iI2ZmZiIvPgo8L3N2Zz4=')]" />
        <div className="w-full h-full rounded-t-[16px] overflow-hidden relative bg-white/10 backdrop-blur-sm">
          <Image 
            src={card.cardImage || PLACEHOLDER_IMAGE} 
            alt={card.playerName || 'Player'} 
            className="w-full h-full object-cover object-top mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-500"
          />
          {/* Overall Rating Badge */}
          <div className="absolute top-3 left-3 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-current text-foreground">
            <span className="font-heading text-xl font-bold">{card.overallRating || '--'}</span>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="flex-1 p-5 flex flex-col justify-between bg-white relative z-10">
        <div>
          <h4 className="font-heading text-2xl font-bold text-foreground uppercase tracking-tight leading-none mb-1">
            {card.playerName || 'Unknown Player'}
          </h4>
          <p className="text-sm font-bold text-foreground/50 uppercase tracking-wider">
            {card.teamName || 'Free Agent'}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t-2 border-gray-100">
          <div className="flex items-center gap-2">
            <span className={`flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 ${styles.text}`}>
              {styles.icon || <div className="w-2 h-2 rounded-full bg-current" />}
            </span>
            <span className={`text-xs font-bold uppercase tracking-widest ${styles.text}`}>
              {card.rarityLevel || 'Common'}
            </span>
          </div>
          <span className="text-lg font-heading font-bold text-foreground/30">
            {card.playerPosition || 'POS'}
          </span>
        </div>
      </div>
    </div>
  );
};

const InteractiveCardStack = ({ cards, onClose }: { cards: PlayerCards[], onClose: () => void }) => {
  const [order, setOrder] = useState(cards.map((_, i) => i));

  const handleCardClick = (index: number) => {
    if (order[0] === index) {
      setOrder(prev => {
        const newOrder = [...prev];
        const first = newOrder.shift();
        if (first !== undefined) newOrder.push(first);
        return newOrder;
      });
    }
  };

  return (
    <div className="relative w-full max-w-2xl h-[500px] mx-auto flex items-center justify-center perspective-1000">
      <AnimatePresence>
        {cards.map((card, i) => {
          const positionIndex = order.indexOf(i);
          const isTop = positionIndex === 0;

          return (
            <motion.div
              key={card._id || i}
              className="absolute origin-bottom-left"
              initial={{ opacity: 0, scale: 0.5, y: 100 }}
              animate={{
                opacity: 1,
                x: positionIndex * 45, // Fan out to the right
                y: positionIndex * -15, // Stack slightly upwards
                scale: 1 - positionIndex * 0.04,
                zIndex: 10 - positionIndex,
                rotate: positionIndex * 3, // Slight rotation for organic feel
              }}
              exit={{ opacity: 0, scale: 0.5, y: -100 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              onClick={() => handleCardClick(i)}
              whileHover={isTop ? { scale: 1.02, y: -5, rotate: -2 } : {}}
              style={{ cursor: isTop ? 'pointer' : 'default' }}
            >
              <PlayerCardVisual card={card} />
              
              {/* Hint to click */}
              {isTop && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs font-bold px-4 py-2 rounded-full whitespace-nowrap pointer-events-none"
                >
                  Click to reveal next
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={onClose}
        className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-10 py-4 bg-foreground text-white rounded-full font-heading font-bold text-lg shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:bg-primary hover:shadow-[0_10px_30px_rgba(255,107,107,0.3)] transition-all duration-300 z-20"
      >
        Collect All to Gallery
      </motion.button>
    </div>
  );
};

// --- Main Page Component ---

export default function HomePage() {
  const [availablePacks, setAvailablePacks] = useState(5);
  const [timeUntilNextPack, setTimeUntilNextPack] = useState(120);
  const [isOpening, setIsOpening] = useState(false);
  const [revealedCards, setRevealedCards] = useState<PlayerCards[]>([]);
  const [allPlayers, setAllPlayers] = useState<PlayerCards[]>([]);
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    loadPlayers();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeUntilNextPack((prev) => {
        if (prev <= 1) {
          setAvailablePacks((packs) => packs + 1);
          return 120;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const loadPlayers = async () => {
    try {
      const { items } = await BaseCrudService.getAll<PlayerCards>('playercards');
      setAllPlayers(items);
    } catch (error) {
      console.error('Failed to load players:', error);
    }
  };

  const getRandomCards = (count: number): PlayerCards[] => {
    const cards: PlayerCards[] = [];
    const playersCopy = [...allPlayers];
    
    for (let i = 0; i < count && playersCopy.length > 0; i++) {
      const rarityWeights: Record<string, number> = {
        'Common': 50,
        'Rare': 30,
        'Epic': 15,
        'Legendary': 5
      };
      
      const weightedPlayers = playersCopy.map(player => ({
        player,
        weight: rarityWeights[player.rarityLevel || 'Common'] || 50
      }));
      
      const totalWeight = weightedPlayers.reduce((sum, wp) => sum + wp.weight, 0);
      let random = Math.random() * totalWeight;
      
      let selectedPlayer = playersCopy[0];
      for (const wp of weightedPlayers) {
        random -= wp.weight;
        if (random <= 0) {
          selectedPlayer = wp.player;
          break;
        }
      }
      
      cards.push(selectedPlayer);
      const index = playersCopy.indexOf(selectedPlayer);
      if (index > -1) {
        playersCopy.splice(index, 1);
      }
    }
    
    return cards;
  };

  const handleOpenPack = () => {
    if (availablePacks > 0 && !isOpening && allPlayers.length > 0) {
      setIsOpening(true);
      setAvailablePacks((prev) => prev - 1);
      
      // Simulate opening animation delay
      setTimeout(() => {
        const cards = getRandomCards(5);
        setRevealedCards(cards);
        setIsOpening(false);
        setShowCards(true);
      }, 1500);
    }
  };

  const handleCloseCards = () => {
    setShowCards(false);
    setRevealedCards([]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background font-paragraph overflow-clip relative selection:bg-primary selection:text-white">
      <style>{`
        .bg-pattern {
          background-image: radial-gradient(#4ECDC4 2px, transparent 2px);
          background-size: 40px 40px;
          opacity: 0.1;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
      
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 pointer-events-none bg-pattern z-0" />
      
      <Header />
      
      <main className="relative z-10 w-full max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 flex flex-col items-center">
        
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 w-full max-w-4xl"
        >
          <motion.div
            initial={{ scale: 0.8, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, type: 'spring', bounce: 0.5 }}
            className="inline-block mb-6"
          >
            <div className="bg-white px-8 py-4 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.08)] border-4 border-primary/10 inline-flex items-center gap-4">
              <Sparkles className="w-8 h-8 text-accent-orange animate-pulse" />
              <h1 className="text-5xl md:text-7xl font-heading text-primary font-bold tracking-tight">
                Pack Opener
              </h1>
              <Sparkles className="w-8 h-8 text-accent-orange animate-pulse" />
            </div>
          </motion.div>
          <p className="text-xl md:text-2xl text-foreground/80 font-medium max-w-2xl mx-auto leading-relaxed">
            Tear open packs, discover legendary World Cup stars, and build your ultimate dream team!
          </p>
        </motion.section>

        {/* Dashboard / Timer Section */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full max-w-3xl mb-16 sticky top-24 z-30"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.05)] border-2 border-white p-6 md:p-8 flex flex-col md:flex-row items-center justify-around gap-8">
            
            {/* Packs Available */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm font-bold text-foreground/50 uppercase tracking-widest mb-1">Available Packs</p>
              <motion.div 
                key={availablePacks}
                initial={{ scale: 1.5, color: '#FFC857' }}
                animate={{ scale: 1, color: '#FF6B6B' }}
                className="text-6xl font-heading font-bold text-primary"
              >
                {availablePacks}
              </motion.div>
            </div>
            
            {/* Divider */}
            <div className="w-full md:w-px h-px md:h-24 bg-gradient-to-b from-transparent via-foreground/10 to-transparent" />
            
            {/* Timer */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-secondary" />
              </div>
              <p className="text-sm font-bold text-foreground/50 uppercase tracking-widest mb-1">Next Free Pack</p>
              <motion.div 
                key={timeUntilNextPack}
                className="text-6xl font-heading font-bold text-secondary tabular-nums"
              >
                {formatTime(timeUntilNextPack)}
              </motion.div>
            </div>

          </div>
        </motion.section>

        {/* The Stage (Pack Opening Area) */}
        <section className="w-full min-h-[600px] flex items-center justify-center relative z-20 mb-24">
          {/* Decorative Stage Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent rounded-[64px] -z-10" />
          
          <AnimatePresence mode="wait">
            {!showCards ? (
              <motion.div
                key="pack-container"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  ...(isOpening ? {
                    scale: [1, 1.1, 1.1, 0],
                    rotate: [0, -5, 5, -5, 5, 0],
                    filter: ["brightness(1)", "brightness(1.5)", "brightness(2)", "brightness(0)"]
                  } : {})
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: isOpening ? 1.5 : 0.5 }}
                className="relative"
              >
                {isOpening && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 2 }}
                    className="absolute inset-0 bg-white rounded-full blur-3xl z-[-1]"
                  />
                )}
                <FoilPack 
                  onOpen={handleOpenPack} 
                  disabled={availablePacks === 0 || allPlayers.length === 0 || isOpening} 
                />
                
                {availablePacks === 0 && !isOpening && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-6 py-3 rounded-full shadow-md text-foreground font-bold"
                  >
                    Waiting for next pack...
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="cards-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex justify-center"
              >
                <InteractiveCardStack cards={revealedCards} onClose={handleCloseCards} />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Rules / Info Section */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { icon: <Sparkles className="w-8 h-8 text-primary" />, title: "Tear It Open", desc: "Click a pack to reveal 5 random players. Watch out for the shiny ones!", color: "bg-primary/10" },
            { icon: <Clock className="w-8 h-8 text-secondary" />, title: "Always Free", desc: "A fresh pack drops every 2 minutes. The fun never stops!", color: "bg-secondary/10" },
            { icon: <Star className="w-8 h-8 text-accent-orange" />, title: "Find Legends", desc: "Collect Common, Rare, Epic, and Legendary stars from top teams.", color: "bg-accent-orange/10" }
          ].map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white rounded-[32px] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border-2 border-transparent hover:border-primary/10 transition-colors text-center flex flex-col items-center"
            >
              <div className={`w-20 h-20 ${item.color} rounded-[24px] flex items-center justify-center mb-6 rotate-3`}>
                {item.icon}
              </div>
              <h3 className="text-2xl font-heading font-bold text-foreground mb-4">{item.title}</h3>
              <p className="text-foreground/70 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.section>

      </main>

      <Footer />
    </div>
  );
}