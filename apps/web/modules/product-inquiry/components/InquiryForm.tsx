"use client";

import type { JSX } from "react";
import { useState } from "react";

type InquiryFormProps = {
  onSubmit: (productName: string, offerPercent: number, city: string) => void;
  isLoading: boolean;
};

export function InquiryForm({ onSubmit, isLoading }: InquiryFormProps): JSX.Element {
  const [productName, setProductName] = useState("Snow blower");
  const [offerPercent, setOfferPercent] = useState(50);
  const [city, setCity] = useState("Toronto");

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    onSubmit(productName, offerPercent, city);
  };

  return (
    <form onSubmit={handleSubmit} className="border-subtle bg-default rounded-lg border p-6">
      <div className="mb-4">
        <p className="text-emphasis mb-4 text-sm font-medium">
          Enter product inquiry parameters to simulate multi-source data lookup:
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="productName" className="text-default mb-1 block text-sm font-medium">
            Product Name
          </label>
          <input
            id="productName"
            type="text"
            value={productName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setProductName(e.target.value)}
            className="border-default bg-default text-emphasis w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g. Snow blower"
          />
        </div>
        <div>
          <label htmlFor="offerPercent" className="text-default mb-1 block text-sm font-medium">
            Offer (%)
          </label>
          <input
            id="offerPercent"
            type="number"
            min={0}
            max={100}
            value={offerPercent}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setOfferPercent(Number(e.target.value))
            }
            className="border-default bg-default text-emphasis w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g. 50"
          />
        </div>
        <div>
          <label htmlFor="city" className="text-default mb-1 block text-sm font-medium">
            Store Location
          </label>
          <input
            id="city"
            type="text"
            value={city}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setCity(e.target.value)}
            className="border-default bg-default text-emphasis w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g. Toronto"
          />
        </div>
      </div>
      <div className="mt-4">
        <button
          type="submit"
          disabled={isLoading || !productName.trim() || !city.trim()}
          className="bg-brand-default text-brand hover:bg-brand-emphasis disabled:bg-muted disabled:text-muted rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed">
          {isLoading && "Looking up..."}
          {!isLoading && "Search Product"}
        </button>
      </div>
    </form>
  );
}
