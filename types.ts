
export interface Exhibition {
  id: string;
  title: string;
  location: string;
  date: string;
  description: string;
  imageUrl: string;
  category: 'Drone' | 'eVTOL' | 'Infrastructure' | 'Regulatory';
  featured?: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
  region: 'Americas' | 'Asia' | 'Europe' | 'Middle East' | 'Oceania' | 'China';
  websiteUrl?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content?: string;
  date: string;
  source: string;
  author?: string;
  tags?: string[];
  imageUrl?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Solution {
  id: string;
  title: string;
  description: string;
  icon: string;
  imageUrl: string;
  features: string[];
}
