import type { Cruise, CruiseFilters, SortOption } from "./types";

export function searchCruises(cruises: Cruise[], filters: CruiseFilters): Cruise[] {
  const filtered = cruises.filter((cruise) => {
    if (filters.destination && cruise.destination.id !== filters.destination) return false;
    if (filters.departurePort && cruise.departurePort.id !== filters.departurePort) return false;
    if (filters.cruiseLine && cruise.cruiseLine.id !== filters.cruiseLine) return false;
    if (filters.ship && cruise.ship.id !== filters.ship) return false;
    if (filters.departureMonth && !cruise.departureDate.startsWith(filters.departureMonth)) return false;
    if (filters.cabin && !cruise.cabins.some((cabin) => cabin.type === filters.cabin)) return false;
    if (filters.cruiseType && cruise.cruiseType !== filters.cruiseType) return false;
    if (filters.minNights && cruise.nights < filters.minNights) return false;
    if (filters.maxNights && cruise.nights > filters.maxNights) return false;
    if (filters.minPrice && cruise.currentPrice < filters.minPrice) return false;
    if (filters.maxPrice && cruise.currentPrice > filters.maxPrice) return false;
    if (filters.dealOnly && !cruise.deal) return false;
    if (filters.returnToSamePort && !cruise.returnToSamePort) return false;
    return true;
  });
  return sortCruises(filtered, filters.sort ?? "recommended");
}
export function sortCruises(cruises: Cruise[], sort: SortOption) {
  return [...cruises].sort((a, b) => {
    if (sort === "price") return a.currentPrice - b.currentPrice;
    if (sort === "savings") return b.savingsPercent - a.savingsPercent;
    if (sort === "departure") return a.departureDate.localeCompare(b.departureDate);
    if (sort === "shortest") return a.nights - b.nights;
    if (sort === "longest") return b.nights - a.nights;
    return Number(b.featured) - Number(a.featured) || b.savingsPercent - a.savingsPercent;
  });
}
