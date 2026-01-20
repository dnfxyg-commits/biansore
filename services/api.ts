import type { Exhibition, NewsItem, Solution } from "../types";
import type { Product } from "../data/mockData";

const API_BASE_URL: string =
  (import.meta as any).env?.VITE_API_BASE_URL ??
  ((import.meta as any).env?.PROD ? "" : "http://localhost:4000");

type BoothApplicationPayload = {
  exhibitionId: string;
  companyName: string;
  contactName: string;
  workEmail: string;
  boothArea?: string;
  purpose: string;
};

type PartnershipApplicationPayload = {
  name: string;
  company: string;
  phone: string;
  city: string;
  email: string;
  message: string;
};

type TicketBookingPayload = {
  exhibitionId: string;
  name: string;
  phone: string;
};

export type AdminBoothApplication = {
  id: string;
  exhibitionId: string | null;
  companyName: string;
  contactName: string;
  workEmail: string;
  boothArea: string | null;
  purpose: string;
  createdAt: string;
};

export type AdminPartnershipApplication = {
  id: string;
  name: string;
  company: string;
  phone: string;
  city: string;
  email: string;
  message: string;
  createdAt: string;
};

export type AdminTicketBooking = {
  id: string;
  exhibitionId: string | null;
  ticketType: string | null;
  name: string;
  phone: string;
  createdAt: string;
};

export type AdminUser = {
  id: string;
  username: string;
  role: string;
  isSuperAdmin?: boolean;
};

export type AdminBlogPost = {
  id: string;
  title: string;
  summary: string;
  date: string;
  source: string;
  author?: string;
  tags: string[];
  imageUrl?: string;
  content?: string;
};

const postJson = async (path: string, body: unknown): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      console.error(`Request to ${path} failed with status ${response.status}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Request to ${path} failed`, error);
    return false;
  }
};

const deleteJson = async (path: string, body: unknown): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok && response.status !== 204) {
      console.error(`Request to ${path} failed with status ${response.status}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Request to ${path} failed`, error);
    return false;
  }
};

export const submitBoothApplication = async (
  payload: BoothApplicationPayload
): Promise<boolean> => {
  return postJson("/api/booth-applications", payload);
};

export const submitPartnershipApplication = async (
  payload: PartnershipApplicationPayload
): Promise<boolean> => {
  return postJson("/api/partnership-applications", payload);
};

export const submitTicketBooking = async (
  payload: TicketBookingPayload
): Promise<boolean> => {
  return postJson("/api/ticket-bookings", payload);
};

const getJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`);
  }
  return (await response.json()) as T;
};

export const fetchExhibitions = async (): Promise<Exhibition[]> => {
  try {
    return await getJson<Exhibition[]>("/api/exhibitions");
  } catch (error) {
    console.error("Failed to fetch exhibitions", error);
    return [];
  }
};

export const fetchSolutions = async (): Promise<Solution[]> => {
  try {
    return await getJson<Solution[]>("/api/solutions");
  } catch (error) {
    console.error("Failed to fetch solutions", error);
    return [];
  }
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    return await getJson<Product[]>("/api/products");
  } catch (error) {
    console.error("Failed to fetch products", error);
    return [];
  }
};

export const fetchBlogPosts = async (): Promise<NewsItem[]> => {
  try {
    return await getJson<NewsItem[]>("/api/blog-posts");
  } catch (error) {
    console.error("Failed to fetch blog posts", error);
    return [];
  }
};

export const fetchAdminBoothApplications = async (): Promise<
  AdminBoothApplication[]
> => {
  try {
    return await getJson<AdminBoothApplication[]>(
      "/api/admin/booth-applications"
    );
  } catch (error) {
    console.error("Failed to fetch admin booth applications", error);
    return [];
  }
};

export const fetchAdminPartnershipApplications = async (): Promise<
  AdminPartnershipApplication[]
> => {
  try {
    return await getJson<AdminPartnershipApplication[]>(
      "/api/admin/partnership-applications"
    );
  } catch (error) {
    console.error("Failed to fetch admin partnership applications", error);
    return [];
  }
};

export const fetchAdminTicketBookings = async (): Promise<
  AdminTicketBooking[]
> => {
  try {
    return await getJson<AdminTicketBooking[]>("/api/admin/ticket-bookings");
  } catch (error) {
    console.error("Failed to fetch admin ticket bookings", error);
    return [];
  }
};

export const fetchAdminBlogPosts = async (): Promise<AdminBlogPost[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/blog-posts`, {
      method: "GET",
      credentials: "include"
    });

    if (!response.ok) {
      return [];
    }

    return (await response.json()) as AdminBlogPost[];
  } catch (error) {
    console.error("Failed to fetch admin blog posts", error);
    return [];
  }
};

export const adminLogin = async (
  username: string,
  password: string
): Promise<AdminUser | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as AdminUser;
  } catch (error) {
    console.error("Admin login failed", error);
    return null;
  }
};

export const adminLogout = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/logout`, {
      method: "POST",
      credentials: "include"
    });
    return response.ok;
  } catch (error) {
    console.error("Admin logout failed", error);
    return false;
  }
};

export const fetchAdminMe = async (): Promise<AdminUser | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/me`, {
      method: "GET",
      credentials: "include"
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as AdminUser;
  } catch (error) {
    console.error("Failed to fetch admin me", error);
    return null;
  }
};

export type AdminListUser = {
  id: string;
  username: string;
  role: string;
  isActive: boolean;
  isSuperAdmin?: boolean;
  createdAt: string;
};

export const fetchAdminUsers = async (): Promise<AdminListUser[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
      method: "GET",
      credentials: "include"
    });

    if (!response.ok) {
      return [];
    }

    return (await response.json()) as AdminListUser[];
  } catch (error) {
    console.error("Failed to fetch admin users", error);
    return [];
  }
};

export const createAdminUser = async (
  username: string,
  password: string,
  role: string
): Promise<AdminListUser | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ username, password, role })
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as AdminListUser;
  } catch (error) {
    console.error("Failed to create admin user", error);
    return null;
  }
};

export const updateAdminUser = async (
  id: string,
  payload: { role?: string; isActive?: boolean }
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ id, ...payload })
    });

    return response.ok;
  } catch (error) {
    console.error("Failed to update admin user", error);
    return false;
  }
};

export const changeAdminPassword = async (
  currentPassword: string,
  newPassword: string
): Promise<boolean> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/change-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword })
      }
    );

    return response.ok;
  } catch (error) {
    console.error("Failed to change admin password", error);
    return false;
  }
};

export type AdminBlogPostPayload = {
  id?: string;
  title: string;
  summary: string;
  date: string;
  source: string;
  author?: string;
  tags: string[];
  imageUrl?: string;
  content?: string;
};

export type AdminExhibitionPayload = {
  id?: string;
  title: string;
  location: string;
  date: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  featured?: boolean;
  region?: string;
  websiteUrl?: string;
  lat?: number | null;
  lng?: number | null;
};

export type AdminProduct = {
  id: string;
  name: string;
  brand: string;
  category: string;
  imageUrl: string;
  description: string;
  status: string;
  specs: string[];
  createdAt: string;
  updatedAt: string;
};

export type AdminProductPayload = {
  id?: string;
  name: string;
  brand: string;
  category: string;
  imageUrl: string;
  description: string;
  status: string;
  specs: string[];
};

export const createAdminBlogPost = async (
  payload: AdminBlogPostPayload
): Promise<AdminBlogPost | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/blog-posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as AdminBlogPost;
  } catch (error) {
    console.error("Failed to create admin blog post", error);
    return null;
  }
};

export const updateAdminBlogPost = async (
  payload: AdminBlogPostPayload
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/blog-posts`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(payload)
    });

    return response.ok;
  } catch (error) {
    console.error("Failed to update admin blog post", error);
    return false;
  }
};

export const deleteAdminBlogPost = async (id: string): Promise<boolean> => {
  return deleteJson("/api/admin/blog-posts", { id });
};

export const deleteAdminBoothApplication = async (
  id: string
): Promise<boolean> => {
  return deleteJson("/api/admin/booth-applications", { id });
};

export const deleteAdminPartnershipApplication = async (
  id: string
): Promise<boolean> => {
  return deleteJson("/api/admin/partnership-applications", { id });
};

export const deleteAdminTicketBooking = async (
  id: string
): Promise<boolean> => {
  return deleteJson("/api/admin/ticket-bookings", { id });
};

export const createAdminExhibition = async (
  payload: AdminExhibitionPayload
): Promise<boolean> => {
  return postJson("/api/admin/exhibitions", payload, { credentials: "include" });
};

export const updateAdminExhibition = async (
  payload: AdminExhibitionPayload
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/exhibitions`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error(
        `Request to /api/admin/exhibitions failed with status ${response.status}`
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("Request to /api/admin/exhibitions failed", error);
    return false;
  }
};

export const deleteAdminExhibition = async (id: string): Promise<boolean> => {
  return deleteJson("/api/admin/exhibitions", { id });
};

export const fetchAdminProducts = async (): Promise<AdminProduct[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/products`, {
      method: "GET",
      credentials: "include"
    });

    if (!response.ok) {
      return [];
    }

    return (await response.json()) as AdminProduct[];
  } catch (error) {
    console.error("Failed to fetch admin products", error);
    return [];
  }
};

export const createAdminProduct = async (
  payload: AdminProductPayload
): Promise<boolean> => {
  return postJson("/api/admin/products", payload, { credentials: "include" });
};

export const updateAdminProduct = async (
  payload: AdminProductPayload
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/products`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(payload)
    });

    return response.ok;
  } catch (error) {
    console.error("Failed to update admin product", error);
    return false;
  }
};

export const deleteAdminProduct = async (id: string): Promise<boolean> => {
  return deleteJson("/api/admin/products", { id });
};

export type AdminSolution = {
  id: string;
  title: string;
  description: string;
  icon: string;
  imageUrl: string;
  features: string[];
};

export const fetchAdminSolutions = async (): Promise<AdminSolution[]> => {
  try {
    return await getJson<AdminSolution[]>("/api/admin/solutions");
  } catch (error) {
    console.error("Failed to fetch admin solutions", error);
    return [];
  }
};

export const createAdminSolution = async (
  payload: Omit<AdminSolution, "id">
): Promise<AdminSolution | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/solutions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as AdminSolution;
  } catch (error) {
    console.error("Failed to create admin solution", error);
    return null;
  }
};

export const updateAdminSolution = async (
  payload: AdminSolution
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/solutions`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(payload)
    });

    return response.ok;
  } catch (error) {
    console.error("Failed to update admin solution", error);
    return false;
  }
};

export const deleteAdminSolution = async (id: string): Promise<boolean> => {
  return deleteJson("/api/admin/solutions", { id });
};
