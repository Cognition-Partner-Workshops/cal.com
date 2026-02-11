"use client";

import type { JSX } from "react";
import { useCallback, useState } from "react";

import { DataSourceCard } from "../components/DataSourceCard";
import { DataSourceMappingTable } from "../components/DataSourceMappingTable";
import { InquiryForm } from "../components/InquiryForm";
import { executeProductInquiry } from "../lib/data-sources";
import type { ProductInquiryResult } from "../lib/types";

const LABELS = {
  scenario: "Data Source Mapping Scenario",
  scenarioDescription:
    'This feature demonstrates a multi-source data lookup scenario: "Give me snow blower product details with 50% offer in Toronto shop". Each piece of information is retrieved from a different data source.',
  productDetails: "Product Details",
  productId: "Product ID",
  promotion: "Promotion / Offer",
  store: "Store Location",
  inventory: "Store Inventory",
  uiScrape: "UI Scraped Data",
};

function InquiryResultCards({ result }: { result: ProductInquiryResult }): JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <DataSourceCard
        title={LABELS.productDetails}
        infoNeeded="Product = Snow blower"
        result={{ ...result.product, data: result.product.data as unknown as Record<string, unknown> }}
      />
      <DataSourceCard
        title={LABELS.productId}
        infoNeeded="Product ID"
        result={{ ...result.productId, data: result.productId.data as unknown as Record<string, unknown> }}
      />
      <DataSourceCard
        title={LABELS.promotion}
        infoNeeded="Offer = 50%"
        result={{ ...result.promotion, data: result.promotion.data as unknown as Record<string, unknown> }}
      />
      <DataSourceCard
        title={LABELS.store}
        infoNeeded="Store in Toronto"
        result={{ ...result.store, data: result.store.data as unknown as Record<string, unknown> }}
      />
      <DataSourceCard
        title={LABELS.inventory}
        infoNeeded="Store inventory"
        result={{ ...result.inventory, data: result.inventory.data as unknown as Record<string, unknown> }}
      />
      <DataSourceCard
        title={LABELS.uiScrape}
        infoNeeded="Maybe UI scrape"
        result={{ ...result.uiScrape, data: result.uiScrape.data as unknown as Record<string, unknown> }}
      />
    </div>
  );
}

export default function ProductInquiryView(): JSX.Element {
  const [result, setResult] = useState<ProductInquiryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = useCallback((productName: string, offerPercent: number, city: string): void => {
    setIsLoading(true);
    setTimeout(() => {
      const inquiryResult = executeProductInquiry(productName, offerPercent, city);
      setResult(inquiryResult);
      setIsLoading(false);
    }, 800);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-emphasis mb-2 text-base font-semibold">{LABELS.scenario}</h2>
        <p className="text-subtle text-sm">{LABELS.scenarioDescription}</p>
      </div>
      <DataSourceMappingTable />
      <InquiryForm onSubmit={handleSearch} isLoading={isLoading} />
      {result && (
        <div className="space-y-4">
          <div className="border-subtle bg-muted rounded-lg border p-4">
            <p className="text-emphasis text-sm font-medium">Query: &ldquo;{result.query}&rdquo;</p>
          </div>
          <InquiryResultCards result={result} />
        </div>
      )}
    </div>
  );
}
