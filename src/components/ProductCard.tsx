import { ShoppingBag } from "lucide-react";
import { Product } from "@/hooks/useProducts";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const ProductCard = ({
  product,
  handleProductClick,
}: {
  product: Product;
  handleProductClick: (productId: string) => void;
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to cart",
        variant: "destructive",
      });
      
      // Redirect to sign-in page
      if (isMobile) {
        navigate('/sign-in');
      } else {
        navigate('/signup-options');
      }
      return;
    }

    // Redirect to product details for proper size/color selection
    navigate(`/product-details?id=${product.product_id}`);
  };
  return (
    <div>
      <div className="h-48 rounded-2xl bg-gray-200 relative overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
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
