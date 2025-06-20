import { WelcomeScreen } from '@/components/WelcomeScreen';

export default function Index() {
  const handleBrowseStore = () => {
    // This could integrate with your routing system
    // For now, we'll show an alert
    alert('Welcome to the store! This would typically navigate to the store page.');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <WelcomeScreen onBrowseStore={handleBrowseStore} />
    </div>
  );
}
