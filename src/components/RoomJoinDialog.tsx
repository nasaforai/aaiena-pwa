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
                  <div className="bg-gradient-to-l from-[#DBACFF] to-[#6A00FF] text-white p-4 relative">
                    <h2 className="font-bold text-lg">You're In Line!</h2>
                    <p className="text-sm opacity-90">
                      Choose an available room to get started.
                    </p>
                  </div>

                  {/* Form Content */}
                  <div className="px-4 py-6 space-y-4">
                    {/* Room Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Choose Your Room
                      </label>
                      {roomsLoading ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-3">
                          {rooms.map((room) => {
                            const occupied = isRoomOccupied(room.id);
                            const timeLeft = timeRemaining[room.id] || 0;
                            
                            return (
                              <button
                                key={room.id}
                                onClick={() => handleRoomClick(room)}
                                className={`relative px-4 py-6 rounded-lg border-2 transition-all text-white font-semibold ${
                                  occupied
                                    ? 'bg-red-500 border-red-600 hover:bg-red-600'
                                    : 'bg-green-500 border-green-600 hover:bg-green-600'
                                }`}
                              >
                                <div className="text-lg">{room.room_number}</div>
                                {occupied && timeLeft > 0 && (
                                  <div className="text-xs mt-1 flex items-center justify-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatTime(timeLeft)}
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Green = Available, Red = Occupied
                      </p>
                    </div>
                  </div>
                </>
              )}

              {dialogState === "form" && selectedRoom && (
                <>
                  {/* Header */}
                  <div className="bg-gradient-to-l from-[#DBACFF] to-[#6A00FF] text-white p-4 relative">
                    <h2 className="font-bold text-lg">Confirm Your Booking</h2>
                    <p className="text-sm opacity-90">
                      Room {selectedRoom.room_number} - 5 minute session
                    </p>
                  </div>

                  {/* Form Content */}
                  <div className="px-4 py-6 space-y-4">
                    {/* Phone Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Phone Number
                      </label>
                      <div className="flex space-x-2">
                        <select className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm">
                          <option>+92</option>
                        </select>
                        <Input
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="flex-1"
                          placeholder="Phone number"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        We'll text you when your session starts or if you're in queue.
                      </p>
                    </div>

                    {/* Confirm Button */}
                    <div className="space-y-2">
                      <Button
                        onClick={handleConfirmRoom}
                        disabled={!phoneNumber.trim() || actionLoading}
                        className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800"
                      >
                        {actionLoading ? 'Booking...' : 'Confirm Room'}
                      </Button>
                      <Button
                        onClick={() => setSelectedRoom(null)}
                        variant="outline"
                        className="w-full py-3 rounded-xl font-medium"
                      >
                        Choose Different Room
                      </Button>
                      <p className="text-xs text-gray-500 text-center">
                        Your room will be reserved for 5 minutes after confirmation
                      </p>
                    </div>
                  </div>
                </>
              )}

              {dialogState === "checking" && (
                <div className="p-8 text-center">
                  <div className="mb-6">
                    <Loader2 className="w-12 h-12 mx-auto mb-4 text-purple-500 animate-spin" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Booking your room...
                  </h3>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div className="bg-purple-500 h-2 rounded-full w-2/3 animate-pulse"></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    "In Aaaina, we help you save your time."
                  </p>
                </div>
              )}

              {dialogState === "confirmed" && (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Room Booked Successfully!
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    You have 5 minutes. We'll notify you about your room.
                  </p>
                  <Button
                    onClick={handleContinueShopping}
                    className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800"
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
