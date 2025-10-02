/**
 * UCB Product Import Script
 * 
 * This script imports United Colors of Benetton products from the Excel data.
 * Run this script to populate the database with UCB products and their size variants.
 * 
 * Instructions:
 * 1. Ensure the database migration has been run
 * 2. Parse the Excel file data
 * 3. Run this script to import products
 */

import { supabase } from "@/integrations/supabase/client";

interface ExcelRow {
  materialGroup: string;
  category: string;
  styleNumber: string;
  size: string;
  styleNumberSize: string;
  season: string;
  lengthInches: number;
  waistInches: number;
  chestInches: number;
  inseamLengthInches: number;
  shoulderInches: number;
  hipInches: number;
  productId: string;
  color: string;
  description: string;
  userCategory: string;
  ucbCategories: string;
  images: string[];
}

// Group products by PRODUCT_ID (style + color combination)
const groupProductsByProductId = (rows: ExcelRow[]) => {
  const grouped = new Map<string, ExcelRow[]>();
  
  rows.forEach(row => {
    if (!grouped.has(row.productId)) {
      grouped.set(row.productId, []);
    }
    grouped.get(row.productId)!.push(row);
  });
  
  return grouped;
};

// Map UCB category to database category name
const mapCategory = (ucbCategory: string): string => {
  const mapping: Record<string, string> = {
    'WOMEN-TOPS': 'Women Tops',
    'WOMEN-DRESSES': 'Women Dresses',
    'MEN-POLOANDTSHIRTS': 'Men Polo & T-Shirts',
    'MEN-JEANSANDJOGGERS': 'Men Jeans & Joggers',
  };
  return mapping[ucbCategory] || ucbCategory;
};

// Import a single product with all its variants
const importProduct = async (productId: string, variants: ExcelRow[]) => {
  try {
    // Get the first variant for main product data
    const mainVariant = variants[0];
    
    // Get UCB brand ID
    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .select('id')
      .eq('slug', 'ucb')
      .single();
    
    if (brandError || !brand) {
      console.error('UCB brand not found:', brandError);
      return;
    }
    
    // Get category ID
    const categoryName = mapCategory(mainVariant.ucbCategories);
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('name', categoryName)
      .eq('brand_id', brand.id)
      .single();
    
    if (categoryError || !category) {
      console.error('Category not found:', categoryName, categoryError);
      return;
    }
    
    // Extract unique images
    const allImages = [...new Set(mainVariant.images.filter(img => img && img.length > 0))];
    const [mainImage, ...additionalImages] = allImages;
    
    // Create product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        name: `UCB ${mainVariant.materialGroup} - ${mainVariant.styleNumber}`,
        description: mainVariant.description,
        brand: 'United Colors of Benetton',
        brand_id: brand.id,
        category_id: category.id,
        image_url: mainImage,
        additional_images: additionalImages,
        style_number: mainVariant.styleNumber,
        season: mainVariant.season,
        material_group: mainVariant.materialGroup,
        gender: mainVariant.userCategory,
        color_code: mainVariant.color,
        colors: [{
          name: mainVariant.color,
          value: mainVariant.color,
          bgClass: 'bg-gray-200'
        }],
        price: 1999, // Default price - update as needed
        stock_quantity: variants.length * 10, // Estimate based on variants
        sizes: variants.map(v => v.size),
        is_new: true,
      })
      .select()
      .single();
    
    if (productError || !product) {
      console.error('Error creating product:', productError);
      return;
    }
    
    console.log(`Created product: ${product.id}`);
    
    // Create variants
    for (const variant of variants) {
      const { error: variantError } = await supabase
        .from('product_variants')
        .insert({
          product_id: product.id,
          size: variant.size,
          sku: variant.styleNumberSize,
          length_inches: variant.lengthInches,
          waist_inches: variant.waistInches,
          chest_inches: variant.chestInches,
          inseam_length_inches: variant.inseamLengthInches,
          shoulder_inches: variant.shoulderInches,
          hip_inches: variant.hipInches,
          stock_quantity: 10, // Default stock per size
        });
      
      if (variantError) {
        console.error('Error creating variant:', variantError);
      }
    }
    
    console.log(`Created ${variants.length} variants for product ${product.id}`);
    
  } catch (error) {
    console.error('Error importing product:', productId, error);
  }
};

// Main import function
export const importUCBProducts = async (excelData: ExcelRow[]) => {
  console.log('Starting UCB product import...');
  
  const groupedProducts = groupProductsByProductId(excelData);
  console.log(`Found ${groupedProducts.size} unique products`);
  
  for (const [productId, variants] of groupedProducts.entries()) {
    await importProduct(productId, variants);
  }
  
  console.log('Import completed!');
};

// Example usage (uncomment and modify with actual parsed data):
// const excelData: ExcelRow[] = [...]; // Parse from Excel
// importUCBProducts(excelData);
