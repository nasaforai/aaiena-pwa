import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/hooks/useProducts";

interface ProductFoundDialogProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onGoToProduct: () => void;
}

export default function ProductFoundDialog({ 
  open, 
  product, 
  onClose, 
  onGoToProduct 
}: ProductFoundDialogProps) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Product Found!</DialogTitle>
          <DialogDescription className="text-center">
            We found this product from your scanned barcode
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4">
          {/* Product Image */}
          <div className="w-32 h-32 rounded-lg overflow-hidden bg-muted">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Product Info */}
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-lg">{product.name}</h3>
            {product.brand && (
              <p className="text-muted-foreground text-sm">{product.brand}</p>
            )}
            
            {/* Price */}
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl font-bold text-primary">
                ${product.price}
              </span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col w-full space-y-2">
            <Button onClick={onGoToProduct} className="w-full">
              Go to the Product
            </Button>
            <Button variant="outline" onClick={onClose} className="w-full">
              Scan Another Product
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}