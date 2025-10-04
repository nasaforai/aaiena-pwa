import { ShoppingBag } from "lucide-react";
import { Product } from "@/hooks/useProducts";

const ProductCard = ({
  product,
  handleProductClick,
}: {
  product: Product;
  handleProductClick: (productId: string) => void;
}) => {
  return (
    <div>
      <div className="h-48 rounded-2xl bg-gray-200 relative overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="absolute left-0 top-0 w-full h-full object-cover"
        />
        <div className="absolute bottom-12 right-2 bg-white rounded-full p-2">
          <ShoppingBag className="w-4 h-4 text-gray-600" />
        </div>

        <div className="absolute left-0 bottom-0 bg-white/30 right-0 py-2 flex justify-center">
          <button
            onClick={() => handleProductClick(product.product_id.toString())}
            className="text-sm text-white hover:text-purple-600 transition-colors mb-1 block"
          >
            View Details
          </button>
        </div>
      </div>
      <div className="px-2 pt-1">
        <p className="text-xs">{product.name}</p>
        <div className="text-xs flex gap-1 items-center">
          {product.original_price && (
            <span className="text-gray-400 line-through">₹{product.original_price}</span>
          )}
          <span className="text-lg"> ₹{product.price}</span>
          {product.discount_percentage && (
            <span className="text-gray-400">{product.discount_percentage}% off</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
