import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Clock, Loader2, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useRooms, Room } from "@/hooks/useRooms";
import { useRoomSession } from "@/hooks/useRoomSession";
import { RoomQueueDialog } from "./RoomQueueDialog";
import { useUserQueueStatus } from "@/hooks/useUserQueueStatus";

interface RoomJoinDialogProps {
  isJoinDialogOpen?: boolean;
  isVirtualDialogOpen?: boolean;
  onClose: () => void;
}

type DialogState = "form" | "checking" | "confirmed";

export const RoomJoinDialog: React.FC<RoomJoinDialogProps> = ({
  isJoinDialogOpen,
  isVirtualDialogOpen,
  onClose,
}) => {
  const isMobile = useIsMobile();
  const [dialogState, setDialogState] = useState<DialogState>("form");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [timeRemaining, setTimeRemaining] = useState<Record<string, number>>({});
  const [showQueueDialog, setShowQueueDialog] = useState(false);
  const [queueRoom, setQueueRoom] = useState<Room | null>(null);
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { rooms, loading: roomsLoading, isRoomOccupied, getTimeRemaining } = useRooms();
  const { createSession, joinQueue, loading: actionLoading } = useRoomSession();
  const { queueStatuses } = useUserQueueStatus(user?.id);

  // Helper function to convert number to ordinal
  const getOrdinal = (n: number): string => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  // Update countdown timers for occupied rooms
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeRemaining: Record<string, number> = {};
      rooms.forEach(room => {
        if (isRoomOccupied(room.id)) {
          newTimeRemaining[room.id] = getTimeRemaining(room.id);
        }
      });
      setTimeRemaining(newTimeRemaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [rooms, isRoomOccupied, getTimeRemaining]);

  useEffect(() => {
    if (isJoinDialogOpen && !isMobile) {
      setDialogState("form");
      setSelectedRoom(null);
      setPhoneNumber("");
    }
  }, [isJoinDialogOpen, isMobile]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleRoomClick = async (room: Room) => {
    if (isRoomOccupied(room.id)) {
      // Room is occupied, show queue dialog
      setQueueRoom(room);
      setShowQueueDialog(true);
    } else {
      // Room is available - book immediately without phone number
      setSelectedRoom(room);
      setDialogState("checking");
      
      const result = await createSession(room.id, undefined, user?.id);
      
      if (result.success) {
        setDialogState("confirmed");
        setTimeout(() => {
          onClose();
          setDialogState("form");
          setSelectedRoom(null);
        }, 2000);
      } else {
        setDialogState("form");
      }
    }
  };

  const handleConfirmRoom = async () => {
    if (!selectedRoom || !phoneNumber.trim()) return;

    setDialogState("checking");

    // Create session
    const result = await createSession(selectedRoom.id, phoneNumber, user?.id);
    
    if (result.success) {
      setDialogState("confirmed");
      setTimeout(() => {
        onClose();
        setDialogState("form");
        setSelectedRoom(null);
        setPhoneNumber("");
      }, 2000);
    } else {
      if (result.error === 'Room is occupied') {
        // Room was just occupied, show queue dialog
        setDialogState("form");
        setQueueRoom(selectedRoom);
        setShowQueueDialog(true);
      } else {
        setDialogState("form");
      }
    }
  };

  const handleJoinQueue = async (queuePhoneNumber: string) => {
    if (!queueRoom) return;

    const result = await joinQueue(queueRoom.id, queuePhoneNumber, user?.id);
    
    if (result.success) {
      setShowQueueDialog(false);
      onClose();
      setQueueRoom(null);
    }
  };

  const handleContinueShopping = () => {
    navigate("/store");
    onClose();
  };

  const handleVirtualTryOn = () => {
    onClose();
    if (isMobile) {
      navigate("/try-virtually");
    } else {
      navigate("/signup-options");
    }
  };

  if (!isJoinDialogOpen && !isVirtualDialogOpen) return null;

  return (
    <>
      <Dialog
        open={isJoinDialogOpen || isVirtualDialogOpen}
        onOpenChange={onClose}
      >
        <DialogContent className="lg:max-w-sm mx-auto p-0 gap-0 bg-white rounded-2xl overflow-hidden border-0">
          {!isVirtualDialogOpen && (
            <>
              {dialogState === "form" && !selectedRoom && (
                <>
                  {/* Header */}
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">Choose Your Room</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Select an available room to begin
                    </p>
                  </div>

                  {/* Queue Status Banner */}
                  {queueStatuses.length > 0 && (
                    <div className="mx-6 mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <Bell className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          {queueStatuses.map((status, index) => (
                            <p key={status.queueId} className={`text-sm font-medium text-blue-900 ${index > 0 ? 'mt-1' : ''}`}>
                              You are {getOrdinal(status.position)} in queue for Room {status.roomNumber}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Form Content */}
                  <div className="p-6">
                    {roomsLoading ? (
                      <div className="flex justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-3 gap-2">
                          {rooms.map((room) => {
                            const occupied = isRoomOccupied(room.id);
                            const timeLeft = timeRemaining[room.id] || 0;
                            const inQueue = queueStatuses.some(q => q.roomId === room.id);
                            
                            return (
                              <button
                                key={room.id}
                                onClick={() => handleRoomClick(room)}
                                className={`relative p-3 rounded-lg border transition-all ${
                                  inQueue
                                    ? 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100'
                                    : occupied
                                    ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                                    : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                                }`}
                              >
                                <div className="text-sm font-medium">{room.room_number}</div>
                                {inQueue && (
                                  <div className="text-xs mt-1 flex items-center justify-center gap-0.5 opacity-70">
                                    <Bell className="h-2.5 w-2.5" />
                                    In Queue
                                  </div>
                                )}
                                {occupied && timeLeft > 0 && !inQueue && (
                                  <div className="text-xs mt-1 flex items-center justify-center gap-0.5 opacity-70">
                                    <Clock className="h-2.5 w-2.5" />
                                    {formatTime(timeLeft)}
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                        <div className="flex items-center gap-3 mt-4 text-xs text-gray-500 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded bg-green-200 border border-green-300"></div>
                            <span>Available</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded bg-red-200 border border-red-300"></div>
                            <span>Occupied</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded bg-blue-200 border border-blue-300"></div>
                            <span>In Queue</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}


              {dialogState === "checking" && (
                <div className="p-12 text-center">
                  <Loader2 className="w-8 h-8 mx-auto mb-4 text-gray-400 animate-spin" />
                  <p className="text-sm text-gray-600">Booking your room...</p>
                </div>
              )}

              {dialogState === "confirmed" && (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">
                    Booking Confirmed
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    5 minutes reserved • Check WhatsApp for updates
                  </p>
                  <Button
                    onClick={handleContinueShopping}
                    className="w-full py-5 rounded-lg"
                  >
                    Continue Shopping
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Virtual Try-On Popup */}
          {isVirtualDialogOpen && (
            <div className="p-6 text-center bg-white">
              <h3 className="text-lg font-semibold mb-2">
                No waiting in virtual try-on.
              </h3>
              <p className="text-lg font-semibold mb-6">Want to try now?</p>
              <div className="space-y-3">
                <Button
                  onClick={handleVirtualTryOn}
                  className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800"
                >
                  Yes, I'll Join Virtually
                </Button>
                <button
                  onClick={onClose}
                  className="w-full text-gray-600 py-2 font-medium"
                >
                  No, Thank You
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Queue Dialog */}
      <RoomQueueDialog
        open={showQueueDialog}
        onClose={() => {
          setShowQueueDialog(false);
          setQueueRoom(null);
        }}
        room={queueRoom}
        estimatedWaitMinutes={
          queueRoom && isRoomOccupied(queueRoom.id)
            ? Math.ceil(getTimeRemaining(queueRoom.id) / 60000)
            : 0
        }
        onJoinQueue={handleJoinQueue}
        loading={actionLoading}
      />
    </>
  );
};
