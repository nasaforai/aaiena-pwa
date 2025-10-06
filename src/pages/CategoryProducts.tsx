import { useParams, useNavigate } from "react-router-dom";
import { useBrand } from "@/contexts/BrandContext";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import BottomNavigation from "@/components/BottomNavigation";
import { Skeleton } from "@/components/ui/skeleton";
import Topbar from "@/components/ui/topbar";

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { currentBrand } = useBrand();
  
  const { data: categories, isLoading: categoriesLoading } = useCategories(currentBrand?.id);
  const { data: products, isLoading: productsLoading } = useProducts(currentBrand?.id);

  const category = categories?.find(cat => cat.id === categoryId);
  const categoryProducts = products?.filter(product => product.category_id === categoryId) || [];

  const handleProductClick = (productId: string) => {
    navigate(`/product-details?id=${productId}`);
  };

  const handleBack = () => {
    navigate("/store");
  };

  if (categoriesLoading || productsLoading) {
    return (
      <div className="flex lg:max-w-sm w-full flex-col overflow-hidden mx-auto min-h-screen bg-white">
        <div className="p-4 flex items-center gap-3 border-b">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex lg:max-w-sm w-full flex-col overflow-hidden mx-auto min-h-screen bg-white">
        <div className="p-4 flex flex-col items-center justify-center h-screen gap-4">
          <p className="text-gray-500">Category not found</p>
          <button
            onClick={() => navigate("/store")}
            className="text-purple-600 hover:underline"
          >
            Back to Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex lg:max-w-sm w-full flex-col overflow-hidden mx-auto min-h-screen bg-white">
      {/* Header */}
      <Topbar handleBack={handleBack} showBack={true} showProfile={false} />

      {/* Category Image Banner (if available) */}
      {category.image_url && (
        <div className="w-full h-32 overflow-hidden">
          <img
            src={category.image_url}
            alt={category.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Product Count */}
      <div className="px-4 py-3 border-b">
        <p className="text-sm text-gray-600">
          Showing {categoryProducts.length} {categoryProducts.length === 1 ? 'product' : 'products'}
        </p>
      </div>

      {/* Products Grid */}
      <div className="p-4 pb-20">
        {categoryProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <p className="text-gray-500">No products available in this category</p>
            <button
              onClick={() => navigate("/store")}
              className="text-purple-600 hover:underline text-sm"
            >
              Browse other categories
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {categoryProducts.map((product) => (
              <ProductCard
                key={product.product_id}
                product={product}
                handleProductClick={handleProductClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default CategoryProducts;
