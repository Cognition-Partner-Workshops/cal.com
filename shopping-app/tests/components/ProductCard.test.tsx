import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductCard from "@/components/ProductCard";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("@/store/auth", () => ({
  useAuthStore: () => ({ token: null }),
}));

vi.mock("@/store/cart", () => ({
  useCartStore: () => ({ setItems: vi.fn() }),
}));

const mockProduct = {
  id: 1,
  name: "Test Product",
  price: 29.99,
  image: "https://example.com/img.jpg",
  category: "Electronics",
  rating: 4.5,
  stock: 10,
};

describe("ProductCard", () => {
  it("renders product name", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Test Product")).toBeInTheDocument();
  });

  it("renders product price", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("$29.99")).toBeInTheDocument();
  });

  it("renders product category", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Electronics")).toBeInTheDocument();
  });

  it("renders product rating", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("(4.5)")).toBeInTheDocument();
  });

  it("renders Add to Cart button", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Add to Cart")).toBeInTheDocument();
  });

  it("links to product detail page", () => {
    render(<ProductCard product={mockProduct} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/products/1");
  });

  it("shows Out of Stock when stock is 0", () => {
    render(<ProductCard product={{ ...mockProduct, stock: 0 }} />);
    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
  });

  it("renders product image", () => {
    render(<ProductCard product={mockProduct} />);
    const img = screen.getByAltText("Test Product");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/img.jpg");
  });

  it("renders 5 star icons", () => {
    const { container } = render(<ProductCard product={mockProduct} />);
    const stars = container.querySelectorAll("svg");
    expect(stars.length).toBeGreaterThanOrEqual(5);
  });

  it("disables button when out of stock", () => {
    render(<ProductCard product={{ ...mockProduct, stock: 0 }} />);
    const button = screen.getByText("Out of Stock");
    expect(button).toBeDisabled();
  });
});
