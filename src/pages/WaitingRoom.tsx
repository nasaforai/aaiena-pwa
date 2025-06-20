import React, { useState } from 'react';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RoomJoinDialog } from '@/components/RoomJoinDialog';

export default function WaitingRoom() {
  const navigate = useNavigate();
  const [notifyToggle, setNotifyToggle] = useState(true);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [showVirtualDialog, setShowVirtualDialog] = useState(false);

  const handleBack = () => {
    navigate('/product-details');
  };

  const handleJoinRoom = () => {
    setShowJoinDialog(true);
  };

  const handleVirtualTryOn = () => {
    setShowVirtualDialog(true);
  };

  const rooms = [
    { id: 'A1', status: 'occupied', estimate: '3mins' },
    { id: 'B1', status: 'empty', estimate: '' },
    { id: 'A2', status: 'occupied', estimate: '3mins' },
    { id: 'A2', status: 'occupied', estimate: '3mins' },
    { id: 'A3', status: 'occupied', estimate: '3mins' },
    { id: 'A3', status: 'occupied', estimate: '3mins' }
  ];

  return (
    <>
      <div className="bg-white flex max-w-[480px] w-full flex-col overflow-hidden mx-auto min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white">
          <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <ShoppingCart className="w-6 h-6 text-gray-700" />
        </div>

        {/* Main Purple Section */}
        <div className="mx-4 mb-4 bg-purple-400 rounded-2xl p-6 text-white text-center">
          <h2 className="text-xl font-bold mb-2">Secure Your Room In Seconds</h2>
          <p className="text-sm opacity-90 mb-4">Join Quickly And Check Your Fittings</p>
          
          <div className="w-16 h-16 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-orange-400 rounded"></div>
          </div>

          <button 
            onClick={handleJoinRoom}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium mb-3"
          >
            Join Room
          </button>
          
          <button 
            onClick={handleVirtualTryOn}
            className="text-xs opacity-75 hover:opacity-100 transition-opacity"
          >
            Great News! Skip Waiting—Try Clothes Virtually Now
          </button>
        </div>

        {/* Live Queue Section */}
        <div className="px-4 mb-4">
          <div className="flex items-center space-x-2 mb-3">
            <span className="font-medium text-gray-900">Live Queue</span>
            <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-xs font-medium">BUSY</span>
          </div>
          
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-blue-300 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-pink-300 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-yellow-300 rounded-full border-2 border-white"></div>
            </div>
            <span className="text-sm text-gray-600">3 people ahead of you checked in</span>
          </div>

          {/* Room Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {rooms.map((room, index) => (
              <div key={index} className={`p-3 rounded-lg flex items-center justify-between ${
                room.status === 'empty' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <div className={`w-8 h-8 rounded flex items-center justify-center text-white text-sm font-bold ${
                  room.status === 'empty' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {room.id}
                </div>
                <div className="text-right">
                  <div className={`text-xs font-medium ${
                    room.status === 'empty' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {room.status === 'empty' ? 'Empty' : 'Occupied'}
                  </div>
                  {room.estimate && (
                    <div className="text-xs text-gray-500">Time estimate: {room.estimate}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Notification Toggle */}
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium text-gray-900">Notify me when it's my turn</span>
            <button 
              onClick={() => setNotifyToggle(!notifyToggle)}
              className={`w-12 h-6 rounded-full transition-colors ${
                notifyToggle ? 'bg-purple-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                notifyToggle ? 'translate-x-6' : 'translate-x-1'
              }`}></div>
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mb-6">We'll notify you 2 mins before it's your turn. Stay Close!</p>

          {/* QR Code Section */}
          <div className="bg-yellow-100 rounded-2xl p-4 mb-4">
            <h3 className="font-bold text-gray-900 mb-2">Get Live Queue Updates on Your Phone</h3>
            <p className="text-sm text-gray-600 mb-3">Scan the QR code using your phone to get real-time updates and alerts</p>
            
            <div className="w-24 h-24 bg-white rounded-lg mx-auto mb-3 flex items-center justify-center">
              <div className="w-20 h-20 bg-gray-900 rounded grid grid-cols-3 gap-1 p-1">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className={`bg-white rounded-sm ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`}></div>
                ))}
              </div>
            </div>
            
            <button className="w-full bg-yellow-400 text-gray-900 py-2 rounded-xl font-medium mb-2">
              📱 Connect My Phone
            </button>
            
            <p className="text-xs text-gray-500 text-center">Already connected? Check your phone for updates</p>
          </div>

          {/* Live Update Section */}
          <div className="bg-green-100 rounded-lg p-3 mb-4">
            <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">Live Update</span>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Now serving</span>
                <span className="text-sm font-medium">5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Occupied rooms</span>
                <span className="text-sm font-medium">5/6</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Avg. wait per person</span>
                <span className="text-sm font-medium">3 mins</span>
              </div>
            </div>
          </div>

          {/* While Waiting Section */}
          <h3 className="font-bold text-lg mb-3">While Waiting, Explore Popular Styles!</h3>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-gray-100 rounded-xl overflow-hidden">
                <div className="h-32 bg-gray-200 relative">
                  <button className="absolute bottom-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <span className="text-xs">👍</span>
                  </button>
                </div>
                <div className="p-2">
                  <button className="text-xs text-purple-600">View Details</button>
                  <p className="text-xs font-semibold">₹500 <span className="text-gray-400 line-through">₹700</span></p>
                </div>
              </div>
            ))}
          </div>

          {/* More T-Shirts Section */}
          <h3 className="font-bold text-lg mb-3">More T-Shirts</h3>
          
          <div className="grid grid-cols-2 gap-3">
            {[1, 2].map((item) => (
              <div key={item} className="bg-gray-100 rounded-xl overflow-hidden">
                <div className="h-40 bg-gray-200 relative">
                  <button className="absolute bottom-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <span className="text-xs">👍</span>
                  </button>
                </div>
                <div className="p-3">
                  <button className="text-sm text-purple-600">View Details</button>
                  <p className="text-sm font-semibold">₹500 <span className="text-gray-400 line-through">₹700</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <RoomJoinDialog 
        isOpen={showJoinDialog} 
        onClose={() => setShowJoinDialog(false)} 
      />
      <RoomJoinDialog 
        isOpen={showVirtualDialog} 
        onClose={() => setShowVirtualDialog(false)} 
        isVirtualTryOn={true}
      />
    </>
  );
}
