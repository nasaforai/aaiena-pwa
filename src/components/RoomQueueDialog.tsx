import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock } from 'lucide-react';
import { Room } from '@/hooks/useRooms';

interface RoomQueueDialogProps {
  open: boolean;
  onClose: () => void;
  room: Room | null;
  estimatedWaitMinutes: number;
  onJoinQueue: (phoneNumber: string) => void;
  loading: boolean;
}

export function RoomQueueDialog({ 
  open, 
  onClose, 
  room, 
  estimatedWaitMinutes,
  onJoinQueue,
  loading 
}: RoomQueueDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = () => {
    if (!phoneNumber.trim()) {
      return;
    }
    onJoinQueue(phoneNumber);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Room {room?.room_number} is Occupied</DialogTitle>
          <DialogDescription>
            This room is currently in use. Join the queue to be notified when it becomes available.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Estimated Wait Time */}
          <div className="flex items-center justify-center space-x-2 p-4 bg-muted rounded-lg">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Estimated wait time</p>
              <p className="text-2xl font-bold text-foreground">
                {estimatedWaitMinutes} {estimatedWaitMinutes === 1 ? 'minute' : 'minutes'}
              </p>
            </div>
          </div>

          {/* Phone Number Input */}
          <div className="space-y-2">
            <Label htmlFor="queue-phone">Phone Number</Label>
            <Input
              id="queue-phone"
              type="tel"
              placeholder="+92 300 1234567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              We'll send you a WhatsApp message when the room is ready
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleSubmit}
              disabled={!phoneNumber.trim() || loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Joining Queue...' : 'Join Queue'}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Choose Another Room
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
