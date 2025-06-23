import { ShoppingBag } from "lucide-react";

const ProductCard = ({
  item,
  handleProductClick,
}: {
  item: number;
  handleProductClick: (productId: string) => void;
}) => {
  return (
    <div>
      <div className="h-48 rounded-2xl bg-gray-200 relative overflow-hidden">
        <img
          src="/images/dress.jpg"
          alt={item.toString()}
          className="absolute left-0 top-0 object-cover"
        />
        <div className="absolute bottom-12 right-2 bg-white rounded-full p-2">
          <ShoppingBag className="w-4 h-4 text-gray-600" />
        </div>

        <div className="absolute left-0 bottom-0 bg-white/30 right-0 py-2 flex justify-center">
          <button
            onClick={() => handleProductClick("sample")}
            className="text-sm text-white hover:text-purple-600 transition-colors mb-1 block"
          >
            View Details
          </button>
        </div>
      </div>
      <div className="px-2 pt-1">
        <p className="text-xs">Miss Chase Women's V-Neck Maxi Dress</p>
        <div className="text-xs flex gap-1 items-center">
          <span className="text-gray-400 line-through">₹1000</span>
          <span className="text-lg"> ₹500</span>
          <span className="text-gray-400">50% off</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
