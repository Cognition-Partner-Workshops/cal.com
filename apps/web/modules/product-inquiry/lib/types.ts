export type ProductInfo = {
  name: string;
  description: string;
  category: string;
  specifications: Record<string, string>;
};

export type ProductIdInfo = {
  productId: string;
  sku: string;
  catalogSource: string;
};

export type PromotionInfo = {
  offerId: string;
  discountPercent: number;
  validFrom: string;
  validTo: string;
  terms: string;
};

export type StoreInfo = {
  storeId: string;
  storeName: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
};

export type InventoryInfo = {
  storeId: string;
  productId: string;
  quantityInStock: number;
  status: "in_stock" | "low_stock" | "out_of_stock";
  lastUpdated: string;
};

export type UiScrapedInfo = {
  displayPrice: string;
  originalPrice: string;
  discountedPrice: string;
  availability: string;
  rating: string;
  reviewCount: number;
};

export type DataSourceResult<T> = {
  source: string;
  sourceType: string;
  data: T;
  fetchedAt: string;
};

export type ProductInquiryResult = {
  query: string;
  product: DataSourceResult<ProductInfo>;
  productId: DataSourceResult<ProductIdInfo>;
  promotion: DataSourceResult<PromotionInfo>;
  store: DataSourceResult<StoreInfo>;
  inventory: DataSourceResult<InventoryInfo>;
  uiScrape: DataSourceResult<UiScrapedInfo>;
};
