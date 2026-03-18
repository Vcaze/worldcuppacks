// HPI 1.7-G
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Sparkles, Trophy, Star, Zap, Shield, Plus, Lock } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { PlayerCards } from '@/entities';
import { BaseCrudService } from '@/integrations';
import { useMember } from '@/integrations/members/providers';
import { updateUser, getUserPredictions } from '@/lib/api';
import { seedPlayers } from '@/lib/seed-players';
import { useNavigate } from 'react-router';

const PLACEHOLDER_IMAGE = "https://static.wixstatic.com/media/5ff994_5f7c20baa11c4ab2b7faa4415cdfa077~mv2.png?originWidth=256&originHeight=384";

// --- Helper Components for the Joyful Experience ---

const FoilPack = ({ onOpen, disabled }: { onOpen: () => void, disabled: boolean }) => {
  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      onClick={!disabled ? onOpen : undefined}
      className={`relative w-56 h-[340px] rounded-[20px] cursor-pointer transition-all duration-300 ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : 'shadow-[0_15px_40px_rgba(0,0,0,0.15)]'}`}
    >
      {/* Pack Background */}
      <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-sky-600 via-indigo-700 to-purple-700 overflow-hidden">
        {/* Decorative Stripe (like a sealed pack) */}
        <div className="absolute top-12 left-0 right-0 h-14 bg-white/20 backdrop-blur-sm" />
        <div className="absolute top-14 left-0 right-0 h-6 bg-white/10" />

        {/* Label & Branding */}
        <div className="absolute inset-4 rounded-[20px] border-2 border-white/20 flex flex-col items-center justify-center text-white text-center p-6">
          <div className="text-sm font-bold tracking-widest uppercase opacity-80">Official</div>
          <h3 className="font-heading text-4xl font-extrabold leading-tight tracking-widest mt-2 drop-shadow-lg">
            World Cup
          </h3>
          <p className="mt-1 text-sm font-semibold uppercase opacity-80 tracking-wide">Card Pack</p>

          <div className="mt-6 px-5 py-2 bg-white/15 backdrop-blur-sm rounded-full border border-white/20">
            <p className="text-sm font-bold tracking-widest uppercase">5 Cards</p>
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
        <div className="w-full h-full rounded-t-[16px] overflow-hidden relative bg-white/10 backdrop-blur-sm">
          <Image 
            src={card.cardImage || PLACEHOLDER_IMAGE} 
            alt={card.playerName || 'Player'} 
            className="w-full h-full object-cover object-top transition-all duration-500"
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
  const { member, isAuthenticated, actions } = useMember();
  const navigate = useNavigate();
  const [availablePacks, setAvailablePacks] = useState<number>(member?.packsRemaining ?? 0);
  const [timeUntilNextPack, setTimeUntilNextPack] = useState(120);
  const [isOpening, setIsOpening] = useState(false);
  const [revealedCards, setRevealedCards] = useState<PlayerCards[]>([]);
  const [allPlayers, setAllPlayers] = useState<PlayerCards[]>([]);
  const [playersByRarity, setPlayersByRarity] = useState<Record<string, PlayerCards[]>>({});
  const [showCards, setShowCards] = useState(false);
  const [hasPredictions, setHasPredictions] = useState(false);
  const [hasCompletedTenaball, setHasCompletedTenaball] = useState(false);

  useEffect(() => {
    // Initialize players from seed data using their seed IDs
    const playersWithIds = seedPlayers.map((player) => ({
      ...player,
      _id: String(player.id),
    } as PlayerCards));
    
    setAllPlayers(playersWithIds);
    
    // Group players by rarity for efficient drawing
    const byRarity: Record<string, PlayerCards[]> = {};
    playersWithIds.forEach(player => {
      const rarity = player.rarityLevel || 'Common';
      if (!byRarity[rarity]) byRarity[rarity] = [];
      byRarity[rarity].push(player);
    });
    setPlayersByRarity(byRarity);
  }, []);

  useEffect(() => {
    setAvailablePacks(member?.packsRemaining ?? 0);
  }, [member?.packsRemaining]);

  useEffect(() => {
    let mounted = true;
    const timer = setInterval(() => {
      setTimeUntilNextPack((prev) => {
        if (prev <= 1) {
          setAvailablePacks((packs) => {
            const next = packs + 1;
            if (member?._id) {
              updateUser(member._id, { packsRemaining: next }).catch((err) => {
                console.error('Failed to sync pack count:', err);
              });
            }
            return next;
          });
          return 120; // reset to 2 minutes
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [member]);

  useEffect(() => {
    if (!isAuthenticated || !member?.email) return;

    getUserPredictions(member.email)
      .then((predictions) => {
        const existingDoc = Array.isArray(predictions) ? predictions[0] : predictions;
        const existingPreds = existingDoc?.predictions;
        setHasPredictions(Array.isArray(existingPreds) && existingPreds.length > 0);
      })
      .catch((err) => {
        console.error('Failed to check predictions:', err);
        setHasPredictions(false);
      });
  }, [isAuthenticated, member]);

  const loadPlayers = async () => {
    if (!isAuthenticated) return;

    try {
      const { items } = await BaseCrudService.getAll<PlayerCards>('playercards');
      setAllPlayers(items);
    } catch (error) {
      console.error('Failed to load players:', error);
    }
  };

  const getRandomCards = (count: number): PlayerCards[] => {
    const cards: PlayerCards[] = [];
    const usedIds = new Set<string>();
    
    const rarityWeights = {
      'Common': 50,
      'Rare': 30,
      'Epic': 15,
      'Legendary': 5
    };
    
    while (cards.length < count) {
      // Step 1: Randomly select rarity based on weights
      const totalWeight = Object.values(rarityWeights).reduce((a, b) => a + b, 0);
      let random = Math.random() * totalWeight;
      let selectedRarity = 'Common';
      
      for (const [rarity, weight] of Object.entries(rarityWeights)) {
        random -= weight;
        if (random <= 0) {
          selectedRarity = rarity;
          break;
        }
      }
      
      // Step 2: Pick a random player from that rarity (avoiding duplicates in this pack)
      const playersOfRarity = playersByRarity[selectedRarity] || [];
      const availablePlayers = playersOfRarity.filter(p => !usedIds.has(p._id));
      
      if (availablePlayers.length > 0) {
        const randomPlayer = availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
        cards.push(randomPlayer);
        usedIds.add(randomPlayer._id);
      } else {
        // If no unique players left for this rarity, allow duplicates
        const allPlayersOfRarity = playersByRarity[selectedRarity] || [];
        if (allPlayersOfRarity.length > 0) {
          const randomPlayer = allPlayersOfRarity[Math.floor(Math.random() * allPlayersOfRarity.length)];
          cards.push(randomPlayer);
          usedIds.add(randomPlayer._id);
        }
      }
    }
    
    return cards;
  };

  const updateUserPackState = useCallback(
    async (newPackCount: number, newCards: PlayerCards[] = []) => {
      if (!member?._id) return;
      try {
        const existing = member.collectedCardIds ?? [];
        const existingIds = new Set(existing as number[]);
        
        // Only add card IDs that aren't already in the collection
        const newCardIds = newCards
          .map(card => card.id)
          .filter((id): id is number => id !== undefined && !existingIds.has(id));
        
        const updatedCollectedIds = [...existing, ...newCardIds];

        await updateUser(member._id, {
          packsRemaining: newPackCount,
          collectedCardIds: updatedCollectedIds,
        });

        // Reload member state (including latest pack count)
        actions.loadCurrentMember();
      } catch (err) {
        console.error('Failed to update user pack state:', err);
      }
    },
    [member, actions]
  );
  
  // Helper to convert card IDs back to full player data
  const getPlayersByIds = useCallback((cardIds: string[]): PlayerCards[] => {
    return cardIds
      .map(id => allPlayers.find(p => p._id === id))
      .filter((p): p is PlayerCards => p !== undefined);
  }, [allPlayers]);

  const handleOpenPack = () => {
    if (!isAuthenticated) {
      actions.login();
      return;
    }

    if (availablePacks > 0 && !isOpening) {
      setIsOpening(true);
      setAvailablePacks((prev) => prev - 1);

      // Simulate opening animation delay
      setTimeout(async () => {
        const cards = getRandomCards(5);
        setRevealedCards(cards);
        setIsOpening(false);
        setShowCards(true);

        // Persist pack decrement + save collected card IDs
        const nextPacks = Math.max(0, (member?.packsRemaining ?? 0) - 1);
        await updateUserPackState(nextPacks, cards);
      }, 1500);
    }
  };

  const handleAddPack = () => {
    if (!isAuthenticated) {
      actions.login();
      return;
    }

    if (member?._id) {
      const newPackCount = (member?.packsRemaining ?? 0) + 1;
      updateUser(member._id, { packsRemaining: newPackCount })
        .then(() => {
          setAvailablePacks(newPackCount);
          actions.loadCurrentMember();
        })
        .catch((err) => {
          console.error('Failed to add pack:', err);
        });
    }
  };

  const handleWorldCupPredictions = () => {
    if (!isAuthenticated) {
      actions.login();
      return;
    }

    // Navigate to predictions page (packs are awarded when saving predictions)
    navigate('/predictions');
  };

  const handleDailyTenaball = () => {
    if (!isAuthenticated) {
      actions.login();
      return;
    }

    // Navigate to Tenaball game (not implemented yet)
    navigate('/tenaball');
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
      <main className="relative z-10 w-full max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col items-center">
        
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-4 w-full max-w-3xl"
        >
          <motion.div
            initial={{ scale: 0.8, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, type: 'spring', bounce: 0.5 }}
            className="inline-block mb-2"
          >
            <div className="bg-white px-5 py-2 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.06)] border-2 border-primary/10 inline-flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent-orange animate-pulse" />
              <h1 className="text-3xl md:text-4xl font-heading text-primary font-bold tracking-tight">
                World Cup Packs
              </h1>
              <Sparkles className="w-5 h-5 text-accent-orange animate-pulse" />
            </div>
          </motion.div>
          <p className="text-base md:text-lg text-foreground/80 font-medium max-w-2xl mx-auto leading-relaxed">
            Open packs and discover all the stars!
          </p>
        </motion.section>

        {/* Dashboard / Timer Section */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="w-full max-w-3xl mb-6"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.04)] border border-white p-4 md:p-5 flex flex-col md:flex-row items-center justify-around gap-3">
            
            {/* Packs Available */}
            <div className="flex flex-col items-center text-center">
              <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center mb-1">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs font-bold text-foreground/50 uppercase tracking-wide">Packs</p>
              <motion.div 
                key={availablePacks}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                className="text-3xl font-heading font-bold text-primary"
              >
                {availablePacks}
              </motion.div>
            </div>
            
            {/* Divider */}
            <div className="w-full md:w-px h-px md:h-14 bg-gradient-to-b from-transparent via-foreground/10 to-transparent" />
            
            {/* Timer */}
            <div className="flex flex-col items-center text-center">
              <div className="w-9 h-9 bg-secondary/10 rounded-full flex items-center justify-center mb-1">
                <Clock className="w-5 h-5 text-secondary" />
              </div>
              <p className="text-xs font-bold text-foreground/50 uppercase tracking-wide">Next Pack</p>
              <motion.div 
                key={timeUntilNextPack}
                className="text-3xl font-heading font-bold text-secondary tabular-nums"
              >
                {formatTime(timeUntilNextPack)}
              </motion.div>
            </div>

          </div>
        </motion.section>

        {/* The Stage (Pack Opening Area) */}
        <section className="w-full min-h-[400px] flex items-center justify-between relative z-20 mb-6 px-8">
          {/* Decorative Stage Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent rounded-[40px] -z-10" />
          
          <AnimatePresence mode="wait">
            {!showCards ? (
              <>
                {/* Left side - Add Pack Button */}
                <motion.button
                  onClick={handleAddPack}
                  disabled={!isAuthenticated || isOpening}
                  whileHover={!isAuthenticated || isOpening ? {} : { scale: 1.05 }}
                  whileTap={!isAuthenticated || isOpening ? {} : { scale: 0.95 }}
                  className={`relative w-20 h-32 rounded-[16px] transition-all duration-300 ${
                    !isAuthenticated || isOpening 
                      ? 'opacity-50 grayscale cursor-not-allowed' 
                      : 'shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.15)]'
                  } bg-gradient-to-br from-green-500 via-emerald-600 to-green-700 text-white font-bold text-sm`}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <Plus className="w-6 h-6 mb-2" />
                    <span>Add Pack</span>
                  </div>
                  {!isAuthenticated && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-[16px]">
                      <Lock className="w-4 h-4" />
                    </div>
                  )}
                </motion.button>

                {/* Center - Main Pack */}
                <motion.div
                  key="pack-container"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    ...(isOpening ? {
                      scale: [1, 1.1, 1.1, 0],
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
                    disabled={!isAuthenticated || availablePacks === 0 || allPlayers.length === 0 || isOpening} 
                  />

                  {!isAuthenticated && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-6 py-3 rounded-full shadow-md text-foreground font-bold"
                    >
                      Log in to open packs
                    </motion.div>
                  )}

                  {isAuthenticated && availablePacks === 0 && !isOpening && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-6 py-3 rounded-full shadow-md text-foreground font-bold"
                    >
                      Waiting for next pack...
                    </motion.div>
                  )}
                </motion.div>

                {/* Right side - Pack Options */}
                <div className="flex flex-col gap-3">
                  <motion.button
                    onClick={handleWorldCupPredictions}
                    disabled={!isAuthenticated || isOpening || hasPredictions}
                    whileHover={!isAuthenticated || isOpening || hasPredictions ? {} : { scale: 1.05 }}
                    whileTap={!isAuthenticated || isOpening || hasPredictions ? {} : { scale: 0.95 }}
                    className={`relative w-32 h-20 rounded-[16px] transition-all duration-300 ${
                      !isAuthenticated || isOpening || hasPredictions
                        ? 'opacity-50 grayscale cursor-not-allowed' 
                        : 'shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.15)]'
                    } bg-gradient-to-br ${hasPredictions ? 'from-gray-400 via-gray-500 to-gray-600' : 'from-blue-500 via-indigo-600 to-blue-700'} text-white font-bold text-sm`}
                  >
                    <div className="flex flex-col items-center justify-center h-full px-2">
                      <Trophy className="w-5 h-5 mb-1" />
                      <span className="text-xs font-semibold">
                        World Cup Predictions
                      </span>
                      {hasPredictions && (
                        <span className="text-xs italic font-serif">
                          Completed
                        </span>
                      )}
                      <span className="text-lg font-bold">
                        {hasPredictions ? '✓' : '+5 packs'}
                      </span>
                    </div>
                    {!isAuthenticated && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-[16px]">
                        <Lock className="w-4 h-4" />
                      </div>
                    )}
                  </motion.button>

                  <motion.button
                    onClick={handleDailyTenaball}
                    disabled={!isAuthenticated || isOpening || hasCompletedTenaball}
                    whileHover={!isAuthenticated || isOpening || hasCompletedTenaball ? {} : { scale: 1.05 }}
                    whileTap={!isAuthenticated || isOpening || hasCompletedTenaball ? {} : { scale: 0.95 }}
                    className={`relative w-32 h-20 rounded-[16px] transition-all duration-300 ${
                      !isAuthenticated || isOpening || hasCompletedTenaball
                        ? 'opacity-50 grayscale cursor-not-allowed' 
                        : 'shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.15)]'
                    } bg-gradient-to-br ${hasCompletedTenaball ? 'from-gray-400 via-gray-500 to-gray-600' : 'from-purple-500 via-violet-600 to-purple-700'} text-white font-bold text-sm`}
                  >
                    <div className="flex flex-col items-center justify-center h-full px-2">
                      <Zap className="w-5 h-5 mb-1" />
                      <span className="text-xs font-semibold">
                        {hasCompletedTenaball ? 'Daily Tenaball' : 'Play daily'}
                      </span>
                      <span className="text-xs">Tenaball</span>
                      <span className="text-lg font-bold">
                        {hasCompletedTenaball ? '✓' : '+1 pack'}
                      </span>
                    </div>
                    {!isAuthenticated && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-[16px]">
                        <Lock className="w-4 h-4" />
                      </div>
                    )}
                  </motion.button>
                </div>
              </>
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          {[
            { icon: <Sparkles className="w-5 h-5 text-primary" />, title: "Tear It Open", desc: "Reveal 5 random players!", color: "bg-primary/10" },
            { icon: <Clock className="w-5 h-5 text-secondary" />, title: "Always Free", desc: "New pack every 2 minutes!", color: "bg-secondary/10" },
            { icon: <Star className="w-5 h-5 text-accent-orange" />, title: "Find Legends", desc: "Collect all rarities!", color: "bg-accent-orange/10" }
          ].map((item, i) => (
            <motion.div 
              key={i}
              className="bg-white rounded-xl p-4 shadow-[0_5px_12px_rgba(0,0,0,0.04)] border border-transparent transition-colors text-center flex flex-col items-center"
            >
              <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center mb-2`}>
                {item.icon}
              </div>
              <h3 className="text-base font-heading font-bold text-foreground mb-1">{item.title}</h3>
              <p className="text-xs text-foreground/70">{item.desc}</p>
            </motion.div>
          ))}
        </motion.section>

      </main>
    </div>
  );
}