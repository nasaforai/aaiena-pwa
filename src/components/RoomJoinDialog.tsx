import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Clock, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useRooms, Room } from "@/hooks/useRooms";
import { useRoomSession } from "@/hooks/useRoomSession";
import { RoomQueueDialog } from "./RoomQueueDialog";

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
      // Room is available
      setSelectedRoom(room);
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
                            
                            return (
                              <button
                                key={room.id}
                                onClick={() => handleRoomClick(room)}
                                className={`relative p-3 rounded-lg border transition-all ${
                                  occupied
                                    ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                                    : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                                }`}
                              >
                                <div className="text-sm font-medium">{room.room_number}</div>
                                {occupied && timeLeft > 0 && (
                                  <div className="text-xs mt-1 flex items-center justify-center gap-0.5 opacity-70">
                                    <Clock className="h-2.5 w-2.5" />
                                    {formatTime(timeLeft)}
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                        <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded bg-green-200 border border-green-300"></div>
                            <span>Available</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded bg-red-200 border border-red-300"></div>
                            <span>Occupied</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}

              {dialogState === "form" && selectedRoom && (
                <>
                  {/* Header */}
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">Confirm Booking</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Room {selectedRoom.room_number} • 5 minute session
                    </p>
                  </div>

                  {/* Form Content */}
                  <div className="p-6 space-y-4">
                    {/* Phone Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="flex gap-2">
                        <select className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm w-20">
                          <option>+92</option>
                        </select>
                        <Input
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="flex-1"
                          placeholder="Enter your number"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1.5">
                        We'll notify you via WhatsApp
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-2 pt-2">
                      <Button
                        onClick={handleConfirmRoom}
                        disabled={!phoneNumber.trim() || actionLoading}
                        className="w-full py-5 rounded-lg"
                      >
                        {actionLoading ? 'Booking...' : 'Confirm Booking'}
                      </Button>
                      <Button
                        onClick={() => setSelectedRoom(null)}
                        variant="ghost"
                        className="w-full py-5 rounded-lg"
                      >
                        Back
                      </Button>
                    </div>
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
