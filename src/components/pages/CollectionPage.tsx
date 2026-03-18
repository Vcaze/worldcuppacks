import { useEffect, useMemo, useState } from 'react';
import { useMember } from '@/integrations/members/providers';
import { Image } from '@/components/ui/image';
import { getTeams } from '@/lib/api';
import { PlayerCards } from '@/entities';
import { seedPlayers } from '@/lib/seed-players';
import { useNavigate } from 'react-router';

export default function CollectionPage() {
  const { member, isAuthenticated } = useMember();
  const navigate = useNavigate();
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);
  const allPlayers: PlayerCards[] = useMemo(
    () =>
      seedPlayers.map((player) => ({
        ...player,
        _id: String(player.id),
      })) as PlayerCards[],
    []
  );

  const cards = useMemo(() => {
    const collectedIds = member?.collectedCardIds ?? [];
    if (!collectedIds.length) return [];

    const map = new Map<number, PlayerCards>();
    allPlayers.forEach((p) => {
      if (p.id !== undefined) {
        map.set(p.id, p);
      }
    });

    return collectedIds
      .map((id) => map.get(id))
      .filter((p): p is PlayerCards => Boolean(p));
  }, [member?.collectedCardIds, allPlayers]);
  const [teams, setTeams] = useState<any[]>([]);

  // Sort teams by group and then alphabetically within each group
  const sortedTeams = useMemo(() => {
    return [...teams].sort((a, b) => {
      // First sort by group (A, B, C, etc.)
      const groupComparison = a.group.localeCompare(b.group);
      if (groupComparison !== 0) return groupComparison;
      
      // Then sort alphabetically by team name within each group
      return a.name.localeCompare(b.name);
    });
  }, [teams]);

  useEffect(() => {
    let mounted = true;
    getTeams()
      .then((data) => {
        if (mounted) setTeams(data || []);
      })
      .catch(() => {
        if (mounted) setTeams([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Get cards for a specific team by ID range
  const getTeamCards = (teamName: string) => {
    // Map team names to their ID ranges based on seed-players.ts
    const teamIdMap: Record<string, number> = {
      'Argentina': 1000,
      'Brazil': 1100,
      'Italy': 2000,
      'Canada': 2100,
      'Switzerland': 2200,
      'Qatar': 2300,
      'Mexico': 2400,
      'Poland': 2500,
      'Saudi Arabia': 2600,
      'Costa Rica': 2700,
      'Tunisia': 2900,
      'Japan': 3000,
      'Ghana': 3100,
      'Spain': 3200,
      'Germany': 3400,
      'Ecuador': 3700,
      'Curaçao': 3600,
      'Ivory Coast': 3800
    };
    
    let startId: number;
    if (teamIdMap[teamName]) {
      startId = teamIdMap[teamName];
    } else {
      // Generate a unique ID for teams not in the map based on team name
      // This ensures each team gets its own unique card range
      const hash = teamName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      startId = 2000 + (hash % 50) * 100; // Start from 2000, unique ranges for other teams
    }
    
    const teamCardIds = Array.from({ length: 20 }, (_, i) => startId + i);
    
    return teamCardIds.map(id => {
      const card = allPlayers.find(p => p.id === id);
      const isOwned = member?.collectedCardIds?.includes(id);
      return {
        id,
        position: id - startId + 1,
        card,
        isOwned
      };
    });
  };

  const handleTeamClick = (team: any) => {
    setSelectedTeam(team);
    // Scroll to top when viewing team details
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setSelectedTeam(null);
  };
  const countsByTeam = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of cards) {
      const name = c.teamName || 'Unknown';
      map[name] = (map[name] || 0) + 1;
    }
    return map;
  }, [cards]);

  if (selectedTeam) {
    const teamCards = getTeamCards(selectedTeam.name);
    
    return (
      <div className="min-h-[70vh] py-12 px-4">
        <div className="max-w-[120rem] mx-auto">
          <button
            onClick={handleBack}
            className="mb-6 flex items-center gap-2 text-primary hover:underline"
          >
            ← Back to Collection
          </button>
          
          <div className="flex items-center justify-center gap-3 mb-8">
            {selectedTeam.flagUrl && (
              <img className="h-8 w-10 rounded-sm object-cover" src={selectedTeam.flagUrl} alt="flag" />
            )}
            <h1 className="text-4xl font-heading font-bold text-primary">{selectedTeam.name}</h1>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-4">
            {teamCards.map((teamCard) => (
              <div key={teamCard.id} className="relative">
                {teamCard.isOwned && teamCard.card ? (
                  <div className="w-full h-40 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="h-24 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="text-lg font-bold px-2">{teamCard.card.playerName}</div>
                      </div>
                    </div>
                    <div className="p-2">
                      <div className="text-xs text-gray-600 truncate">{teamCard.card.playerPosition}</div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-40 bg-gray-100 rounded-lg border border-gray-300 shadow-sm flex items-center justify-center">
                    <div className="text-4xl text-gray-400 font-bold">?</div>
                  </div>
                )}
                <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                  {teamCard.position}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-2">Not logged in</h2>
          <p className="text-foreground/70">Log in to see your collection.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] py-12 px-4">
      <div className="max-w-[120rem] mx-auto">
        <h1 className="text-4xl font-heading font-bold text-primary mb-8">Your Collection</h1>

        <p className="text-foreground/70 mb-6">Teams are shown as decks. Each deck displays a small stacked preview of cards you own for that country and a count of how many out of 20 cards you have (e.g. 7/20).</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center">
          {sortedTeams.map((team) => {
            const have = countsByTeam[team.name] || 0;
            const total = 20; // show out of 20 per team

            // create up to 6 stacked thumbnails to represent the deck visually
            const thumbs = Array.from({ length: Math.min(6, have || 1) }).map((_, i) => {
              const opacity = 0.9 - i * 0.12;
              const left = i * 8;
              const top = i * 6;
              return (
                <div
                  key={i}
                  className={`absolute w-32 h-40 rounded-md overflow-hidden bg-slate-100 border border-white/20 shadow-sm`}
                  style={{ left: '50%', transform: 'translateX(-50%)', opacity }}
                >
                </div>
              );
            });

            return (
              <div 
                key={team.name} 
                className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleTeamClick(team)}
              >
                <div className="relative w-36 h-44">
                  {thumbs}
                  <div className="absolute top-0 left-0 right-0 flex flex-col items-center p-2">
                    <p className="font-semibold text-foreground text-xs mb-1">{team.name}</p>
                    {team.flagUrl && (
                      <img className="h-5 w-7 rounded-sm object-cover mb-1" src={team.flagUrl} alt="flag" />
                    )}
                    <p className="text-xs text-foreground/70">{have}/{total}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
