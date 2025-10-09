import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Timer, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [dialogState, setDialogState] = useState<DialogState>();
  const [selectedRoom, setSelectedRoom] = useState("3A");
  const [phoneNumber, setPhoneNumber] = useState("8131378626");
  const navigate = useNavigate();

  useEffect(() => {
    if (isJoinDialogOpen) {
      if (isMobile) {
        setDialogState("checking");
        setTimeout(() => {
          setDialogState("confirmed");
        }, 2000);
      } else {
        setDialogState("form");
      }
    }
  }, [isMobile, isJoinDialogOpen]);

  // useEffect(() => {
  //   if (isOpen) {
  //     setDialogState(isVirtualTryOn ? "form" : "form");
  //   }
  // }, [isOpen, isVirtualTryOn]);

  const handleConfirmRoom = () => {
    if (isVirtualDialogOpen) {
      // For virtual try-on, skip to confirmed state
      setDialogState("confirmed");
    } else {
      // For regular room booking, go through checking process
      setDialogState("checking");
      setTimeout(() => {
        setDialogState("confirmed");
      }, 2000);
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

  const rooms = ["1A", "2A", "3A", "1B", "4C", "2B", "3B", "1C", "2C", "3C"];

  if (!isJoinDialogOpen && !isVirtualDialogOpen) return null;

  return (
    <Dialog
      open={isJoinDialogOpen || isVirtualDialogOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="lg:max-w-sm mx-auto p-0 gap-0 bg-white rounded-2xl overflow-hidden border-0">
        {!isVirtualDialogOpen && (
          <>
            {" "}
            {dialogState === "form" && (
              <>
                {/* Header */}
                <div className="bg-gradient-to-l from-[#DBACFF] to-[#6A00FF] text-white p-4 relative">
                  {/* <button
                onClick={onClose}
                className="absolute right-4 top-4 text-white hover:bg-white/20 rounded-full p-1"
              >
                <X className="w-5 h-5" />
              </button> */}
                  <h2 className="font-bold text-lg">You're In Line!</h2>
                  <p className="text-sm opacity-90">
                    We'll Send Updates To Your Phone.
                  </p>
                </div>

                {/* Session Timer */}
                <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                  <div className="flex items-center space-x-2">
                    <img
                      src="/icons/watch.svg"
                      alt="watch icon"
                      width={32}
                      height={32}
                    />
                    <span className="text-sm text-gray-600">
                      Session Expired
                    </span>
                  </div>
                  <span className="text-sm font-medium">4:00 minute</span>
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
                        <option>+62</option>
                      </select>
                      <Input
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="flex-1"
                        placeholder="Phone number"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      We'll text you when your room is ready.
                    </p>
                  </div>

                  {/* Room Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 mt-10">
                      Choose Your Room
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {rooms.map((room) => (
                        <button
                          key={room}
                          onClick={() => setSelectedRoom(room)}
                          className={`px-2 py-4 text-sm font-medium rounded-lg border-2 transition-colors ${
                            selectedRoom === room
                              ? "bg-yellow-400 border-yellow-500 text-gray-900"
                              : "bg-gray-100 border-gray-200 text-gray-700 hover:border-yellow-500 hover:bg-yellow-400"
                          }`}
                        >
                          {room}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Confirm Button */}
                  <div>
                    <Button
                      onClick={handleConfirmRoom}
                      className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800"
                    >
                      Confirm Room
                    </Button>
                    <p className="text-xs text-gray-500 text-center mt-1">
                      Your room will be reserved for 10 minutes after
                      confirmation
                    </p>
                  </div>
                </div>
              </>
            )}
            {dialogState === "checking" && (
              <div className="p-8 text-center">
                <div className="mb-6">
                  <div className="w-12 h-12 mx-auto mb-4 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Checking your room availability.
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div className="bg-purple-500 h-2 rounded-full w-1/3 animate-pulse"></div>
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
                  Thank You For Confirmation
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  We'll Notify You About Your Room.
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
  );
};
