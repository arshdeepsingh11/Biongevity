export interface Money { amount: string; currencyCode: string }
export interface ShopifyImage { url: string; altText: string | null; width?: number; height?: number }

export interface ShopifyProduct {
  id: string; handle: string; title: string; vendor: string; productType: string;
  description: string; tags: string[]; availableForSale: boolean;
  featuredImage: ShopifyImage | null;
  priceRange: { minVariantPrice: Money };
  variants: { nodes: { id: string; availableForSale: boolean; price: Money }[] };
}

export interface ShopifyCartLine {
  id: string; quantity: number;
  merchandise: { id: string; title: string; price: Money; product: { handle: string; title: string; vendor: string; featuredImage: ShopifyImage | null } };
}

export interface ShopifyCart {
  id: string; checkoutUrl: string; totalQuantity: number;
  cost: { subtotalAmount: Money; totalAmount: Money };
  lines: { nodes: ShopifyCartLine[] };
}
