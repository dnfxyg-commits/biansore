import type { Exhibition, NewsItem } from "../types";
import type { ExhibitionCenter, Product } from "../data/mockData";

const API_BASE_URL: string =
  (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:4000";

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
  ticketType: string;
  name: string;
  email: string;
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

export const fetchExhibitionCenters = async (): Promise<ExhibitionCenter[]> => {
  try {
    return await getJson<ExhibitionCenter[]>("/api/exhibition-centers");
  } catch (error) {
    console.error("Failed to fetch exhibition centers", error);
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
