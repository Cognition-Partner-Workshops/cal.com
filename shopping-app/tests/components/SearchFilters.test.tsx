import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchFilters from "@/components/SearchFilters";

const categories = ["Electronics", "Clothing", "Home"];
const mockOnFilterChange = vi.fn();

describe("SearchFilters", () => {
  it("renders search input", () => {
    render(
      <SearchFilters categories={categories} onFilterChange={mockOnFilterChange} />
    );
    expect(screen.getByPlaceholderText("Search products...")).toBeInTheDocument();
  });

  it("renders search button", () => {
    render(
      <SearchFilters categories={categories} onFilterChange={mockOnFilterChange} />
    );
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("renders category filter buttons", () => {
    render(
      <SearchFilters categories={categories} onFilterChange={mockOnFilterChange} />
    );
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Electronics")).toBeInTheDocument();
    expect(screen.getByText("Clothing")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("calls onFilterChange when category clicked", () => {
    render(
      <SearchFilters categories={categories} onFilterChange={mockOnFilterChange} />
    );
    fireEvent.click(screen.getByText("Electronics"));
    expect(mockOnFilterChange).toHaveBeenCalled();
  });

  it("toggles filter panel visibility", () => {
    render(
      <SearchFilters categories={categories} onFilterChange={mockOnFilterChange} />
    );
    const filterBtn = screen.getByText("Filters");
    fireEvent.click(filterBtn);
    expect(screen.getByText("Apply Filters")).toBeInTheDocument();
    expect(screen.getByText("Clear All")).toBeInTheDocument();
  });

  it("submits search on form submit", () => {
    render(
      <SearchFilters categories={categories} onFilterChange={mockOnFilterChange} />
    );
    const input = screen.getByPlaceholderText("Search products...");
    fireEvent.change(input, { target: { value: "shoes" } });
    fireEvent.click(screen.getByText("Search"));
    expect(mockOnFilterChange).toHaveBeenCalled();
  });
});
