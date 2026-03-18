import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useMember } from '@/integrations/members/providers';
import { getTeams, getUserPredictions, savePredictions } from '@/lib/api';
import { updateUser } from '@/lib/api';

const GROUP_IDS = Array.from({ length: 12 }, (_, i) => String.fromCharCode(65 + i));

function makeEmptySlots() {
  const obj: Record<string, (any | null)[]> = {};
  GROUP_IDS.forEach((g) => (obj[g] = [null, null, null, null]));
  return obj;
}

export default function PredictionsPage() {
  const navigate = useNavigate();
  const { member, isAuthenticated, actions } = useMember();

  const [loading, setLoading] = useState(true);
  const [pools, setPools] = useState<Record<string, any[]>>({});
  const [slots, setSlots] = useState<Record<string, (any | null)[]>>(makeEmptySlots());
  const [finalMode, setFinalMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasExistingPredictions, setHasExistingPredictions] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const email = member?.email;
    if (!email) {
      setError('User email not available');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    Promise.all([getTeams(), getUserPredictions(email)])
      .then(([teams, userPredictions]) => {
        const existingDoc = Array.isArray(userPredictions) ? userPredictions[0] : userPredictions;
        const existingPreds = existingDoc?.predictions;

        if (Array.isArray(existingPreds) && existingPreds.length > 0) {
          const loadedSlots: Record<string, (any | null)[]> = {};
          GROUP_IDS.forEach((g) => {
            const entry = existingPreds.find((p: any) => p.group === g);
            loadedSlots[g] = entry?.positions ?? [null, null, null, null];
          });
          setSlots(loadedSlots);
          setFinalMode(true);
          setPools({});
          setHasExistingPredictions(true);
        } else {
          const grouped: Record<string, any[]> = {};
          GROUP_IDS.forEach((g) => {
            grouped[g] = teams.filter((t: any) => t.group === g) ?? [];
          });
          setPools(grouped);
          setSlots(makeEmptySlots());
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load predictions');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isAuthenticated, member, navigate]);

  const renderTeam = (team: any) => {
    if (!team) return null;
    return (
      <div className="flex items-center gap-2">
        {team.flagUrl && (
          <img className="h-5 w-7 rounded-sm object-cover" src={team.flagUrl} alt="flag" />
        )}
        <span className="text-sm font-medium text-foreground">{team.name}</span>
      </div>
    );
  };

  const onDragEnd = (result: any) => {
    if (finalMode) return;
    const { source, destination } = result;
    if (!destination) return;

    const [sourceType, sourceGroup, sourceIdxStr] = source.droppableId.split(":");
    const [destType, destGroup, destIdxStr] = destination.droppableId.split(":");

    const sourceIdx = parseInt(sourceIdxStr, 10);
    const destIdx = parseInt(destIdxStr, 10);

    const newPools = { ...pools };
    const newSlots = { ...slots };
    let draggedTeam: any = null;

    if (sourceType === "pool") {
      draggedTeam = (newPools[sourceGroup] || [])[source.index];
      if (!draggedTeam) return;
      newPools[sourceGroup] = [...(newPools[sourceGroup] || [])];
      newPools[sourceGroup].splice(source.index, 1);
    } else if (sourceType === "slot") {
      draggedTeam = (newSlots[sourceGroup] || [])[sourceIdx] || null;
      if (!draggedTeam) return;
      newSlots[sourceGroup] = [...(newSlots[sourceGroup] || [])];
      newSlots[sourceGroup][sourceIdx] = null;
    }

    if (destType === "pool") {
      newPools[destGroup] = [...(newPools[destGroup] || [])];
      newPools[destGroup].splice(destination.index, 0, draggedTeam);
    } else if (destType === "slot") {
      const destOccupied = (newSlots[destGroup] || [])[destIdx];
      newSlots[destGroup] = [...(newSlots[destGroup] || [])];

      if (destOccupied) {
        const displaced = destOccupied;
        newSlots[destGroup][destIdx] = draggedTeam;
        if (sourceType === "slot") {
          newSlots[sourceGroup][sourceIdx] = displaced;
        } else if (sourceType === "pool") {
          newPools[sourceGroup].splice(source.index, 0, displaced);
        }
      } else {
        newSlots[destGroup][destIdx] = draggedTeam;
      }
    }

    setPools(newPools);
    setSlots(newSlots);
  };

  const allSlotsFilled = () => {
    return GROUP_IDS.every((g) => (slots[g] || []).every((t) => t));
  };

  const shuffleArray = (arr: any[]) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const fillRandom = () => {
    if (finalMode) return;
    const nextPools = { ...pools };
    const nextSlots = { ...slots };

    GROUP_IDS.forEach((g) => {
      const currentSlots = (nextSlots[g] || []).filter(Boolean);
      const currentPool = nextPools[g] || [];
      const all = [...currentSlots, ...currentPool];
      if (all.length === 0) return;
      const shuffled = shuffleArray(all);
      nextSlots[g] = [
        shuffled[0] || null,
        shuffled[1] || null,
        shuffled[2] || null,
        shuffled[3] || null,
      ];
      nextPools[g] = [];
    });

    setPools(nextPools);
    setSlots(nextSlots);
  };

  const saveSlots = async (slotsState: Record<string, (any | null)[]>) => {
    if (!member?.email) {
      setError('Missing authentication');
      return;
    }

    if (!allSlotsFilled()) return;

    const predictionsPayload = GROUP_IDS.map((g) => ({
      group: g,
      positions: (slotsState[g] || []).map((t) =>
        t ? { name: t.name, group: t.group, flagUrl: t.flagUrl } : null
      ),
    }));

    try {
      await savePredictions(predictionsPayload);
      
      // Award packs only for first-time predictions
      if (!hasExistingPredictions && member?._id) {
        const newPackCount = (member?.packsRemaining ?? 0) + 5;
        await updateUser(member._id, { packsRemaining: newPackCount });
        actions.loadCurrentMember();
        setHasExistingPredictions(true);
      }
      
      setFinalMode(true);
    } catch (e) {
      console.error(e);
      setError('Failed to save predictions');
    }
  };

  const enableEditMode = () => {
    // Check if edit deadline has passed (June 11, 2026 18:00 GMT)
    const deadlineDate = new Date('2026-06-11T18:00:00Z');
    const currentDate = new Date();
    
    if (currentDate > deadlineDate) {
      setError('Prediction editing deadline has passed. World Cup has started!');
      return;
    }

    // Get all teams and filter out teams that are already in slots
    Promise.all([getTeams()])
      .then(([teams]) => {
        const newPools: Record<string, any[]> = {};
        GROUP_IDS.forEach((g) => {
          const slotTeams = (slots[g] || []).filter(Boolean);
          const slotTeamNames = new Set(slotTeams.map(t => t.name));
          
          // Only add teams to pool that aren't already in slots
          const availableTeams = teams.filter((t: any) => 
            t.group === g && !slotTeamNames.has(t.name)
          );
          newPools[g] = availableTeams;
        });
        setPools(newPools);
        setFinalMode(false);
      })
      .catch((err) => {
        console.error('Failed to load teams for edit mode:', err);
      });
  };

  if (loading) {
    return <div className="min-h-[70vh] flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <p className="text-destructive">{error}</p>
        <button className="text-primary hover:underline" onClick={() => navigate('/')}>Go back</button>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] py-12 px-4">
      <div className="max-w-[120rem] mx-auto">
        <h1 className="text-4xl font-heading font-bold text-primary mb-6">Predictions</h1>
        <p className="text-foreground/70 mb-8">
          Drag and drop teams into the slots to predict how the groups will finish.
        </p>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {GROUP_IDS.map((g) => (
              <div key={g} className="rounded-3xl bg-white/70 border border-white/20 p-5 shadow-sm">
                <h2 className="text-xl font-semibold text-foreground mb-3">Group {g}</h2>

                {!finalMode && (
                  <Droppable droppableId={`pool:${g}:0`} direction="vertical" isDropDisabled={finalMode}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`mb-4 min-h-[70px] rounded-xl border border-dashed p-3 ${
                          snapshot.isDraggingOver ? 'border-primary/50 bg-primary/10' : 'border-foreground/20'
                        }`}
                      >
                        {(pools[g] || []).map((team, idx) => (
                          <Draggable
                            key={`${team.name}-${g}`}
                            draggableId={`${team.name}-${g}`}
                            index={idx}
                            isDragDisabled={finalMode}
                          >
                            {(prov, snapshot) => (
                              <div
                                ref={prov.innerRef}
                                {...prov.draggableProps}
                                {...prov.dragHandleProps}
                                className={`flex items-center justify-between rounded-lg bg-white p-2 shadow-sm transition ${
                                  snapshot.isDragging ? 'opacity-80' : ''
                                }`}
                              >
                                {renderTeam(team)}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                )}

                <div className="space-y-2">
                  {(slots[g] || []).map((slotVal, idx) => (
                    <Droppable key={idx} droppableId={`slot:${g}:${idx}`} isDropDisabled={finalMode}>
                      {(provided, slotSnap) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`flex items-center gap-3 rounded-xl border p-3 ${
                            slotSnap.isDraggingOver ? 'border-primary/60 bg-primary/10' : 'border-foreground/10 bg-white'
                          }`}
                        >
                          <div className="w-7 font-semibold text-foreground/70">{idx + 1}.</div>
                          <div className="flex-1">
                            {slotVal ? (
                              <Draggable
                                key={`${slotVal.name}-${g}-slot-${idx}`}
                                draggableId={`${slotVal.name}-${g}`}
                                index={0}
                                isDragDisabled={finalMode}
                              >
                                {(prov, dragSnap) => (
                                  <div
                                    ref={prov.innerRef}
                                    {...prov.draggableProps}
                                    {...prov.dragHandleProps}
                                    className={`flex items-center justify-between rounded-lg bg-white p-2 shadow-sm transition ${
                                      dragSnap.isDragging ? 'opacity-80' : ''
                                    }`}
                                  >
                                    {renderTeam(slotVal)}
                                  </div>
                                )}
                              </Draggable>
                            ) : (
                              <div className="text-sm text-foreground/50">(empty)</div>
                            )}
                          </div>
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DragDropContext>

        {!finalMode && (
          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <button
              className="rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground shadow hover:bg-secondary/90"
              onClick={fillRandom}
            >
              Fill with random predictions
            </button>
            <button
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
              disabled={!allSlotsFilled()}
              onClick={() => saveSlots(slots)}
            >
              {hasExistingPredictions ? 'Update predictions' : 'Save predictions'}
            </button>
          </div>
        )}

        {finalMode && (
          <div className="mt-8 flex justify-center">
            <button
              className="rounded-full bg-accent-orange px-6 py-3 text-sm font-semibold text-white shadow hover:bg-accent-orange/90 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={enableEditMode}
              disabled={new Date() > new Date('2026-06-11T18:00:00Z')}
            >
              {new Date() > new Date('2026-06-11T18:00:00Z') ? 'Editing closed' : 'Edit predictions'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
