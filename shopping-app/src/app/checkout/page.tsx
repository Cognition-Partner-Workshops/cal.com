"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { token, isLoading: authLoading, loadFromStorage } = useAuthStore();
  const { items, setItems, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (!authLoading && !token) {
      router.push("/login");
      return;
    }
    if (token) {
      api.cart.list().then((res) => {
        if (res.success && res.data) setItems(res.data);
      });
    }
  }, [token, authLoading, router, setItems]);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !form.fullName ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.zip
    ) {
      setError("Please fill in all shipping fields");
      return;
    }

    if (!form.cardNumber || !form.cardExpiry || !form.cardCvc) {
      setError("Please fill in all payment fields");
      return;
    }

    setLoading(true);
    const shippingAddress = `${form.fullName}, ${form.address}, ${form.city}, ${form.state} ${form.zip}`;
    const res = await api.orders.create(shippingAddress, "mock_card");

    if (res.success && res.data) {
      setSuccess(true);
      setOrderId(res.data.orderId as number);
      clearCart();
    } else {
      setError(res.error || "Failed to place order");
    }
    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="card p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Order Confirmed!
          </h2>
          <p className="mt-2 text-gray-600">
            Your order #{orderId} has been placed successfully.
          </p>
          <p className="mt-1 text-gray-500">
            You will receive a confirmation email shortly.
          </p>
          <div className="mt-6 flex gap-4 justify-center">
            <Link href="/orders" className="btn-primary">
              View Orders
            </Link>
            <Link href="/" className="btn-secondary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Cart is Empty</h2>
        <p className="mt-2 text-gray-500">Add items to your cart first</p>
        <Link href="/" className="btn-primary inline-block mt-4">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Shipping Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({ ...form, fullName: e.target.value })
                    }
                    className="input-field"
                    placeholder="John Doe"
                    data-testid="shipping-name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    className="input-field"
                    placeholder="123 Main St"
                    data-testid="shipping-address"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) =>
                        setForm({ ...form, city: e.target.value })
                      }
                      className="input-field"
                      placeholder="New York"
                      data-testid="shipping-city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={form.state}
                      onChange={(e) =>
                        setForm({ ...form, state: e.target.value })
                      }
                      className="input-field"
                      placeholder="NY"
                      data-testid="shipping-state"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={form.zip}
                      onChange={(e) =>
                        setForm({ ...form, zip: e.target.value })
                      }
                      className="input-field"
                      placeholder="10001"
                      data-testid="shipping-zip"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Payment (Mock)
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={form.cardNumber}
                    onChange={(e) =>
                      setForm({ ...form, cardNumber: e.target.value })
                    }
                    className="input-field"
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    data-testid="card-number"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={form.cardExpiry}
                      onChange={(e) =>
                        setForm({ ...form, cardExpiry: e.target.value })
                      }
                      className="input-field"
                      placeholder="MM/YY"
                      maxLength={5}
                      data-testid="card-expiry"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVC
                    </label>
                    <input
                      type="text"
                      value={form.cardCvc}
                      onChange={(e) =>
                        setForm({ ...form, cardCvc: e.target.value })
                      }
                      className="input-field"
                      placeholder="123"
                      maxLength={4}
                      data-testid="card-cvc"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  This is a mock payment. No real charges will be made.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm text-gray-600"
                  >
                    <span className="line-clamp-1 flex-1">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="ml-2 font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <hr />
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-6"
                data-testid="place-order-button"
              >
                {loading ? "Processing..." : `Place Order - $${total.toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
