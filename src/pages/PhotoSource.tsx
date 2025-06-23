import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PhotoSource() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/measurement-profile");
  };

  const handleTakePhoto = () => {
    navigate("/image-guide");
  };

  const handleChooseGallery = () => {
    navigate("/image-guide");
  };

  return (
    <div className="bg-white flex lg:lg:max-w-sm w-full flex-col overflow-hidden mx-auto min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Content */}
      <div className="mt-20 flex-1 px-6 py-8">
        {/* Photo Examples */}
        <div className="flex space-x-4 mb-8">
          <div className="flex-1">
            <div className="w-full h-48 bg-gradient-to-b from-teal-300 to-teal-500 rounded-2xl mb-2 relative overflow-hidden">
              <img
                src="/images/dress.jpg"
                alt="photo"
                className="absolute left-0 top-0 object-cover"
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="w-full h-48 bg-gradient-to-b from-purple-300 to-pink-400 rounded-2xl mb-2 relative overflow-hidden">
              <img
                src="/images/dress.jpg"
                alt="photo"
                className="absolute left-0 top-0 object-cover"
              />{" "}
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Choose Photo Source
          </h1>
        </div>

        {/* Buttons */}
        <div className="space-y-3 mb-8">
          <Button
            onClick={handleTakePhoto}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-800"
          >
            Take Photo
          </Button>
          <button
            onClick={handleChooseGallery}
            className="w-full text-gray-600 py-2 font-medium"
          >
            Choose From Gallery
          </button>
        </div>

        {/* Footer */}
        {/* <div className="text-center mt-auto">
          <p className="text-gray-400 font-bold text-lg">Aaiena</p>
        </div> */}
      </div>
    </div>
  );
}
