export type Transport = "Flight" | "Train" | "Bus" | "Cab";

export type TourCategory =
  | "Domestic"
  | "International"
  | "Adventure"
  | "Family"
  | "Solo"
  | "Honeymoon"
  | "Luxury"
  | "Budget"
  | "Wildlife"
  | "Hill Station"
  | "Beach"
  | "Weekend Trips"
  | "Cruise"
  | "Road Trip";

export interface Agency {
  slug: string;
  name: string;
  logo: string;
  cover: string;
  verified: boolean;
  yearsExperience: number;
  totalTours: number;
  completedTours: number;
  rating: number;
  reviewCount: number;
  city: string;
  about: string;
  phone: string;
  email: string;
  website: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals: string[];
  stay?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  images?: string[];
  agencyReply?: string;
}

export interface Tour {
  slug: string;
  title: string;
  destination: string;
  country: string;
  image: string;
  gallery: string[];
  agency: Agency;
  category: TourCategory[];
  price: number;
  originalPrice: number;
  duration: string;
  nights: number;
  days: number;
  transport: Transport[];
  hotelRating: number;
  mealsIncluded: boolean;
  freeCancellation: boolean;
  instantConfirmation: boolean;
  rating: number;
  reviewCount: number;
  seatsLeft: number;
  nextDepartures: string[];
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  thingsToCarry: string[];
  itinerary: ItineraryDay[];
  reviews: Review[];
  featured?: boolean;
  trending?: boolean;
}

export interface Destination {
  name: string;
  country: string;
  image: string;
  tourCount: number;
  coordinates: string;
}
