const BASE_URL = "/api";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const json = await res.json();
  return json;
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string; user: { id: number; name: string; email: string } }>(
        "/auth/login",
        { method: "POST", body: JSON.stringify({ email, password }) }
      ),
    signup: (name: string, email: string, password: string) =>
      request<{ token: string; user: { id: number; name: string; email: string } }>(
        "/auth/signup",
        { method: "POST", body: JSON.stringify({ name, email, password }) }
      ),
    me: () =>
      request<{ id: number; name: string; email: string }>("/auth/me"),
  },
  products: {
    list: (params?: Record<string, string>) => {
      const query = params ? "?" + new URLSearchParams(params).toString() : "";
      return request<{
        products: Array<{
          id: number;
          name: string;
          description: string;
          price: number;
          category: string;
          image: string;
          stock: number;
          rating: number;
        }>;
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        categories: string[];
      }>(`/products${query}`);
    },
    get: (id: number) =>
      request<{
        id: number;
        name: string;
        description: string;
        price: number;
        category: string;
        image: string;
        stock: number;
        rating: number;
      }>(`/products/${id}`),
  },
  cart: {
    list: () =>
      request<
        Array<{
          id: number;
          product_id: number;
          quantity: number;
          name: string;
          price: number;
          image: string;
          stock: number;
          category: string;
        }>
      >("/cart"),
    add: (productId: number, quantity = 1) =>
      request("/cart", {
        method: "POST",
        body: JSON.stringify({ productId, quantity }),
      }),
    update: (id: number, quantity: number) =>
      request(`/cart/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity }),
      }),
    remove: (id: number) =>
      request(`/cart/${id}`, { method: "DELETE" }),
    clear: () =>
      request("/cart", { method: "DELETE" }),
  },
  orders: {
    list: () =>
      request<
        Array<{
          id: number;
          total: number;
          status: string;
          shipping_address: string;
          created_at: string;
          items: Array<{
            id: number;
            product_id: number;
            quantity: number;
            price: number;
            name: string;
            image: string;
          }>;
        }>
      >("/orders"),
    get: (id: number) =>
      request<{
        id: number;
        total: number;
        status: string;
        shipping_address: string;
        created_at: string;
        items: Array<{
          id: number;
          product_id: number;
          quantity: number;
          price: number;
          name: string;
          image: string;
        }>;
      }>(`/orders/${id}`),
    create: (shippingAddress: string, paymentMethod = "mock_card") =>
      request<{ orderId: number; total: number }>("/orders", {
        method: "POST",
        body: JSON.stringify({ shippingAddress, paymentMethod }),
      }),
  },
};
