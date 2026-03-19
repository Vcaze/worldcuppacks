import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, User, Calendar, MapPin, Building, Flag } from 'lucide-react';

interface Player {
  player_id: string;
  first_name: string;
  last_name: string;
  name: string;
  last_season: string;
  country_of_citizenship: string;
  date_of_birth: string;
  sub_position: string;
  position: string;
  current_club_name: string;
}

export default function TenaballPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load all players from CSV on mount
  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const response = await fetch('/data/players.csv');
        const csvText = await response.text();
        
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');
        
        const players: Player[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',');
          if (values.length >= headers.length) {
            const player: Player = {
              player_id: values[0] || '',
              first_name: values[1] || '',
              last_name: values[2] || '',
              name: values[3] || '',
              last_season: values[4] || '',
              country_of_citizenship: values[9] || '',
              date_of_birth: values[10] || '',
              sub_position: values[11] || '',
              position: values[12] || '',
              current_club_name: values[19] || ''
            };
            players.push(player);
          }
        }
        
        setAllPlayers(players);
      } catch (err) {
        console.error('Failed to load players:', err);
      }
    };

    loadPlayers();
  }, []);

  // Search players when query changes
  useEffect(() => {
    if (searchQuery.trim().length < 2 || allPlayers.length === 0) {
      setSearchResults([]);
      return;
    }

    const searchPlayers = () => {
      const query = searchQuery.toLowerCase().trim();
      const filtered = allPlayers.filter(player => 
        player.name.toLowerCase().includes(query) ||
        player.first_name.toLowerCase().includes(query) ||
        player.last_name.toLowerCase().includes(query) ||
        player.current_club_name.toLowerCase().includes(query) ||
        player.country_of_citizenship.toLowerCase().includes(query)
      );
      
      setSearchResults(filtered.slice(0, 10)); // Limit to 10 results
    };

    const debounceTimer = setTimeout(searchPlayers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, allPlayers]);

  const handlePlayerSelect = (player: Player) => {
    setSelectedPlayer(player);
    setSearchQuery('');
    setSearchResults([]);
    searchInputRef.current?.blur();
  };

  const clearSelection = () => {
    setSelectedPlayer(null);
    searchInputRef.current?.focus();
  };

  const calculateAge = (dateString: string) => {
    if (!dateString) return 'Unknown';
    try {
      const birthDate = new Date(dateString);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1;
      }
      
      return age;
    } catch {
      return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-[70vh] py-12 px-4" style={{backgroundColor: '#333333'}}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-heading font-bold text-white mb-6">Tenaball Player Search</h1>
        <p className="text-white/70 mb-8">
          Search for football players and view their detailed information.
        </p>

        {/* Search Section */}
        <div className="relative mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a player..."
              className="w-full pl-12 pr-4 py-4 bg-[#242424] border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500/60 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full mt-2 w-full bg-[#242424] border border-white/20 rounded-xl shadow-xl max-h-96 overflow-y-auto overflow-x-hidden z-50"
              >
                {searchResults.map((player) => (
                  <motion.button
                    key={player.player_id}
                    onClick={() => handlePlayerSelect(player)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#333333] transition-colors text-left border-b border-white/10 last:border-b-0"
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex-1">
                      <div className="text-white font-medium">{player.name}</div>
                      <div className="text-white/60 text-sm">
                        {player.sub_position} • {calculateAge(player.date_of_birth)}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading State */}
          {isLoading && (
            <div className="absolute top-full mt-2 w-full bg-[#242424] border border-white/20 rounded-xl p-4 text-center">
              <div className="text-white/60">Searching...</div>
            </div>
          )}

          {/* Error State */}
          {searchError && (
            <div className="absolute top-full mt-2 w-full bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
              <div className="text-red-400">{searchError}</div>
            </div>
          )}
        </div>

        {/* Selected Player Details */}
        <AnimatePresence>
          {selectedPlayer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-[#242424] rounded-2xl p-8 shadow-xl"
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedPlayer.name}</h2>
                <button
                  onClick={clearSelection}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                  
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-purple-400" />
                    <div>
                      <div className="text-white/60 text-sm">Full Name</div>
                      <div className="text-white">
                        {selectedPlayer.first_name} {selectedPlayer.last_name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    <div>
                      <div className="text-white/60 text-sm">Date of Birth</div>
                      <div className="text-white">{formatDate(selectedPlayer.date_of_birth)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Flag className="w-5 h-5 text-purple-400" />
                    <div>
                      <div className="text-white/60 text-sm">Country of Citizenship</div>
                      <div className="text-white">{selectedPlayer.country_of_citizenship}</div>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Professional Information</h3>
                  
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-purple-400" />
                    <div>
                      <div className="text-white/60 text-sm">Current Club</div>
                      <div className="text-white">
                        {selectedPlayer.last_season === '2025' ? selectedPlayer.current_club_name : 'Unknown or retired'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-purple-400" />
                    <div>
                      <div className="text-white/60 text-sm">Position</div>
                      <div className="text-white">{selectedPlayer.position}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-purple-400" />
                    <div>
                      <div className="text-white/60 text-sm">Sub Position</div>
                      <div className="text-white">{selectedPlayer.sub_position}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    <div>
                      <div className="text-white/60 text-sm">Last Season</div>
                      <div className="text-white">{selectedPlayer.last_season}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Initial State */}
        {!selectedPlayer && !searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Search for Players</h3>
            <p className="text-white/60">
              Start typing a player name above to search and view their detailed information.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
