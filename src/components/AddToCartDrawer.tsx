import { useState, useEffect } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { Product } from "@/hooks/useProducts";
import { useProductVariants } from "@/hooks/useProductVariants";
import { toast } from "@/hooks/use-toast";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface AddToCartDrawerProps {
  product: Product;
  trigger?: React.ReactNode;
}

export const AddToCartDrawer = ({ product, trigger }: AddToCartDrawerProps) => {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  
  const { data: variants, isLoading } = useProductVariants(product.product_id);

  // Reset state when drawer opens
  useEffect(() => {
    if (open) {
      setSelectedSize("");
      setQuantity(1);
    }
  }, [open]);

  const selectedVariant = variants?.find((v) => v.size === selectedSize);
  const maxStock = selectedVariant?.stock_quantity || 0;
  const totalPrice = product.price * quantity;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Size Required",
        description: "Please select a size before adding to cart",
        variant: "destructive",
      });
      return;
    }

    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    
    const newItem = {
      product_id: product.product_id,
      name: product.name,
      image: product.image_url,
      price: product.price,
      size: selectedSize,
      quantity: quantity,
    };
    
    // Check if item with same product and size exists
    const existingItemIndex = cartItems.findIndex(
      (item: any) => item.product_id === product.product_id && item.size === selectedSize
    );
    
    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      cartItems[existingItemIndex].quantity += quantity;
      toast({
        title: "Cart Updated",
        description: `${product.name} quantity updated in cart`,
      });
    } else {
      // Add new item to cart
      cartItems.push(newItem);
      toast({
        title: "Added to Cart",
        description: `${product.name} (${selectedSize}) has been added to your cart`,
      });
    }
    
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {trigger || (
          <Button size="icon" variant="outline">
            <ShoppingBag className="w-4 h-4" />
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Add to Cart</DrawerTitle>
          <DrawerDescription>
            Select size and quantity for {product.name}
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="px-4 pb-4 space-y-6">
          {/* Product Info */}
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded-lg bg-muted overflow-hidden flex-shrink-0">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-2xl font-bold">₹{product.price}</p>
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Select Size</label>
            {isLoading ? (
              <div className="text-sm text-muted-foreground">Loading sizes...</div>
            ) : variants && variants.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {variants.map((variant) => (
                  <Button
                    key={variant.id}
                    variant={selectedSize === variant.size ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedSize(variant.size);
                      setQuantity(1);
                    }}
                    disabled={variant.stock_quantity === 0}
                    className="min-w-[60px]"
                  >
                    {variant.size}
                    {variant.stock_quantity === 0 && (
                      <span className="ml-1 text-xs">(Out)</span>
                    )}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No sizes available</div>
            )}
          </div>

          {/* Stock Info */}
          {selectedSize && (
            <div className="text-sm text-muted-foreground">
              {maxStock} {maxStock === 1 ? "item" : "items"} available
            </div>
          )}

          {/* Quantity Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Quantity</label>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1 || !selectedSize}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-2xl font-semibold w-12 text-center">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= maxStock || !selectedSize}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Total Price */}
          {selectedSize && (
            <div className="flex justify-between items-center pt-4 border-t">
              <span className="text-lg font-medium">Total</span>
              <span className="text-2xl font-bold">₹{totalPrice}</span>
            </div>
          )}
        </div>

        <DrawerFooter>
          <Button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            size="lg"
            className="w-full"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" size="lg">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
