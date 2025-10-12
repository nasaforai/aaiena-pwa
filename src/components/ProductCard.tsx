import { ShoppingBag } from "lucide-react";
import { Product } from "@/hooks/useProducts";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const ProductCard = ({
  product,
  handleProductClick,
}: {
  product: Product;
  handleProductClick: (productId: string) => void;
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    
    const newItem = {
      product_id: product.product_id,
      name: product.name,
      image: product.image_url,
      price: product.price,
      size: "M", // Default size
      quantity: 1,
    };
    
    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(
      (item: any) => item.product_id === product.product_id && item.size === "M"
    );
    
    if (existingItemIndex >= 0) {
      // Increase quantity if item exists
      cartItems[existingItemIndex].quantity += 1;
      toast({
        title: "Cart Updated",
        description: `Quantity updated for ${product.name}`,
      });
    } else {
      // Add new item to cart
      cartItems.push(newItem);
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart`,
      });
    }
    
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  };
  return (
    <div>
      <div className="h-48 rounded-2xl bg-gray-200 relative overflow-hidden">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <img
          src={imageError ? "/placeholder.svg" : product.image_url}
          alt={product.name}
          onLoad={() => setImageLoading(false)}
          onError={(e) => {
            console.warn(`Failed to load image for ${product.name}:`, product.image_url);
            setImageError(true);
            setImageLoading(false);
          }}
          className="absolute left-0 top-0 w-full h-full object-cover"
        />
        <button
          onClick={handleAddToCart}
          className="absolute bottom-12 right-2 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
        >
          <ShoppingBag className="w-4 h-4 text-gray-600" />
        </button>

        <div className="absolute left-0 bottom-0 bg-black/60 right-0 py-2 flex justify-center">
          <button
            onClick={() => handleProductClick(product.product_id.toString())}
            className="text-sm text-white font-medium hover:text-purple-300 transition-colors mb-1 block"
          >
            View Details
          </button>
        </div>
      </div>
      <div className="px-2 pt-1">
        <p className="text-xs">{product.name}</p>
        <div className="text-xs flex gap-1 items-center">
          <span className="text-lg">₹{product.price}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
