export type CruiseType = "Ocean" | "River" | "Luxury" | "Expedition";
export type CabinType = "Interior" | "Oceanview" | "Balcony" | "Suite";

export interface Destination { id: string; name: string; region: string; description: string; }
export interface Port { id: string; name: string; country: string; }
export interface CruiseLine { id: string; name: string; description: string; }
export interface Ship { id: string; name: string; lineId: string; capacity: number; built: number; highlights: string[]; }
export interface ItineraryStop { day: number; port: string; country: string; description: string; }
export interface Cabin { type: CabinType; from: number; description: string; features: string[]; }
export interface Cruise {
  id: string; slug: string; title: string; cruiseLine: CruiseLine; ship: Ship;
  destination: Destination; departurePort: Port; returnPort: Port; departureDate: string; returnDate: string;
  nights: number; ports: ItineraryStop[]; images: string[]; originalPrice: number; currentPrice: number;
  savingsPercent: number; cabins: Cabin[]; amenities: string[]; description: string; cruiseType: CruiseType;
  featured: boolean; deal: boolean; returnToSamePort: boolean;
}
export type SortOption = "recommended" | "price" | "savings" | "departure" | "shortest" | "longest";
export type ViewMode = "cards" | "compact";
export interface CruiseFilters {
  destination?: string; departurePort?: string; cruiseLine?: string; ship?: string; cabin?: CabinType;
  departureMonth?: string;
  cruiseType?: CruiseType; minNights?: number; maxNights?: number; minPrice?: number; maxPrice?: number;
  dealOnly?: boolean; returnToSamePort?: boolean; sort?: SortOption; view?: ViewMode;
}
