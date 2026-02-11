import type {
  DataSourceResult,
  InventoryInfo,
  ProductIdInfo,
  ProductInfo,
  ProductInquiryResult,
  PromotionInfo,
  StoreInfo,
  UiScrapedInfo,
} from "./types";

function timestamp(): string {
  return new Date().toISOString();
}

function getProductFromCatalog(productName: string): DataSourceResult<ProductInfo> {
  const products: Record<string, ProductInfo> = {
    "snow blower": {
      name: "Snow Blower Pro 3000",
      description: "Heavy-duty two-stage snow blower with electric start, 24-inch clearing width",
      category: "Outdoor Power Equipment",
      specifications: {
        Engine: "272cc OHV",
        "Clearing Width": "24 inches",
        "Intake Height": "20 inches",
        "Drive Type": "Two-stage",
        "Start Type": "Electric + Recoil",
        Weight: "220 lbs",
      },
    },
    "lawn mower": {
      name: "GreenCut Lawn Mower X500",
      description: "Self-propelled gas lawn mower with 21-inch steel deck",
      category: "Outdoor Power Equipment",
      specifications: {
        Engine: "190cc OHV",
        "Cutting Width": "21 inches",
        "Drive Type": "Self-propelled",
        Weight: "85 lbs",
      },
    },
  };

  const key = productName.toLowerCase();
  const data = products[key] ?? {
    name: productName,
    description: "Product details not found in catalog",
    category: "Unknown",
    specifications: {},
  };

  return {
    source: "Confluence / Product catalog",
    sourceType: "Confluence",
    data,
    fetchedAt: timestamp(),
  };
}

function getProductId(productName: string): DataSourceResult<ProductIdInfo> {
  const ids: Record<string, ProductIdInfo> = {
    "snow blower": {
      productId: "PRD-SB-3000",
      sku: "SKU-OPE-SB3000-BLK",
      catalogSource: "Confluence Product Registry",
    },
    "lawn mower": {
      productId: "PRD-LM-X500",
      sku: "SKU-OPE-LMX500-GRN",
      catalogSource: "Confluence Product Registry",
    },
  };

  const key = productName.toLowerCase();
  const data = ids[key] ?? {
    productId: "UNKNOWN",
    sku: "UNKNOWN",
    catalogSource: "Confluence Product Registry",
  };

  return {
    source: "Confluence",
    sourceType: "Confluence",
    data,
    fetchedAt: timestamp(),
  };
}

function getPromotion(productName: string, offerPercent: number): DataSourceResult<PromotionInfo> {
  let data: PromotionInfo;
  if (productName.toLowerCase() === "snow blower" && offerPercent === 50) {
    data = {
      offerId: "PROMO-WINTER-2026-SB50",
      discountPercent: 50,
      validFrom: "2026-01-15",
      validTo: "2026-03-15",
      terms: "Winter clearance sale. 50% off all snow blowers. While supplies last.",
    };
  } else {
    data = {
      offerId: `PROMO-GEN-${offerPercent}`,
      discountPercent: offerPercent,
      validFrom: "2026-01-01",
      validTo: "2026-12-31",
      terms: `${offerPercent}% discount promotion.`,
    };
  }

  return {
    source: "NoSQL (promotions DB)",
    sourceType: "NoSQL",
    data,
    fetchedAt: timestamp(),
  };
}

function getStore(city: string): DataSourceResult<StoreInfo> {
  const stores: Record<string, StoreInfo> = {
    toronto: {
      storeId: "STR-TO-001",
      storeName: "Toronto Downtown Hardware",
      city: "Toronto",
      address: "123 Yonge Street, Toronto, ON M5B 1M4",
      phone: "+1 (416) 555-0199",
      hours: "Mon-Sat: 8AM-9PM, Sun: 9AM-6PM",
    },
    vancouver: {
      storeId: "STR-VA-001",
      storeName: "Vancouver West Hardware",
      city: "Vancouver",
      address: "456 Granville Street, Vancouver, BC V6C 1T2",
      phone: "+1 (604) 555-0188",
      hours: "Mon-Sat: 8AM-8PM, Sun: 10AM-5PM",
    },
  };

  const key = city.toLowerCase();
  const data = stores[key] ?? {
    storeId: "UNKNOWN",
    storeName: `${city} Store`,
    city,
    address: "Address not found",
    phone: "N/A",
    hours: "N/A",
  };

  return {
    source: "SQL (store DB)",
    sourceType: "SQL",
    data,
    fetchedAt: timestamp(),
  };
}

function getInventory(productName: string, city: string): DataSourceResult<InventoryInfo> {
  const isSnowBlowerToronto = productName.toLowerCase() === "snow blower" && city.toLowerCase() === "toronto";

  let data: InventoryInfo;
  if (isSnowBlowerToronto) {
    data = {
      storeId: "STR-TO-001",
      productId: "PRD-SB-3000",
      quantityInStock: 15,
      status: "in_stock",
      lastUpdated: "2026-02-11T10:30:00Z",
    };
  } else {
    data = {
      storeId: "UNKNOWN",
      productId: "UNKNOWN",
      quantityInStock: 0,
      status: "out_of_stock",
      lastUpdated: timestamp(),
    };
  }

  return {
    source: "SQL (inventory)",
    sourceType: "SQL",
    data,
    fetchedAt: timestamp(),
  };
}

function getUiScrapedData(productName: string, offerPercent: number): DataSourceResult<UiScrapedInfo> {
  const isSnowBlower = productName.toLowerCase() === "snow blower";

  let originalPrice: number;
  if (isSnowBlower) {
    originalPrice = 1299.99;
  } else {
    originalPrice = 499.99;
  }
  const discountedPrice = originalPrice * (1 - offerPercent / 100);

  let availability: string;
  let rating: string;
  let reviewCount: number;
  if (isSnowBlower) {
    availability = "In Stock - Ready for pickup";
    rating = "4.7/5";
    reviewCount = 342;
  } else {
    availability = "Check store for availability";
    rating = "N/A";
    reviewCount = 0;
  }

  const data: UiScrapedInfo = {
    displayPrice: `$${discountedPrice.toFixed(2)} CAD`,
    originalPrice: `$${originalPrice.toFixed(2)} CAD`,
    discountedPrice: `$${discountedPrice.toFixed(2)} CAD`,
    availability,
    rating,
    reviewCount,
  };

  return {
    source: "Web/UI system",
    sourceType: "UI Scrape",
    data,
    fetchedAt: timestamp(),
  };
}

export function executeProductInquiry(
  productName: string,
  offerPercent: number,
  city: string
): ProductInquiryResult {
  return {
    query: `Give me ${productName} product details with ${offerPercent}% offer in ${city} shop`,
    product: getProductFromCatalog(productName),
    productId: getProductId(productName),
    promotion: getPromotion(productName, offerPercent),
    store: getStore(city),
    inventory: getInventory(productName, city),
    uiScrape: getUiScrapedData(productName, offerPercent),
  };
}
