"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  Compass,
  Heart,
  Menu,
  Moon,
  Search,
  SlidersHorizontal,
  Sun,
  X,
} from "lucide-react";
import {
  cruises,
  cruiseLines,
  destinations,
  getFeaturedCruises,
  getTickerDeals,
  ports,
  ships,
} from "@/lib/data";
import { searchCruises } from "@/lib/search";
import type {
  CabinType,
  Cruise,
  CruiseFilters,
  SortOption,
  ViewMode,
} from "@/lib/types";
import { getSavedCruises, toggleSavedCruise } from "@/lib/storage";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [expertOpen, setExpertOpen] = useState(false);
  useEffect(() => {
    const savedTheme = window.localStorage.getItem("cruise-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    setDarkMode(savedTheme ? savedTheme === "dark" : prefersDark);
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    window.localStorage.setItem("cruise-theme", darkMode ? "dark" : "light");
  }, [darkMode]);
  return (
    <>
      <header className={`site-nav ${scrolled ? "site-nav-scrolled" : ""}`}>
        <div className="container site-nav-inner">
          <Link href="/" className="brand" aria-label="Cruise Discovery home">
            <span className="brand-mark">
              <Compass size={17} />
            </span>
            <span className="brand-name">Cruise Discovery</span>
          </Link>
          <nav className="nav-links">
            <Link href="/cruises">Cruises</Link>
            <Link href="/deals">Deals</Link>
            <Link href="/cruises?destination=alaska">Destinations</Link>
            <Link href="/cruises">Cruise Lines</Link>
          </nav>
          <button className="nav-expert" onClick={() => setExpertOpen(true)}>
            <strong>Talk to an Expert</strong>
          </button>
          <Link className="btn btn-primary nav-cta" href="/cruises">
            Find a Cruise
          </Link>
          <button
            className="theme-toggle"
            onClick={() => setDarkMode((value) => !value)}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            className="mobile-nav"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open navigation"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <div style={{ background: "#061a2ef5", padding: "16px 24px" }}>
            <div
              className="container"
              style={{ display: "grid", gap: 14, color: "white" }}
            >
              <Link href="/cruises">Cruises</Link>
              <Link href="/deals">Deals</Link>
              <Link href="/cruises?destination=alaska">Destinations</Link>
              <Link href="/cruises">Cruise Lines</Link>
              <Link href="/cruises">Find a Cruise</Link>
            </div>
          </div>
        )}
      </header>
      {expertOpen && <ExpertModal onClose={() => setExpertOpen(false)} />}
      {children}
      <Footer />
    </>
  );
}
function ExpertModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="prototype-modal" role="dialog" aria-modal="true" aria-labelledby="expert-modal-title" onClick={onClose}>
      <div className="prototype-modal-card" onClick={(event) => event.stopPropagation()}>
        <button className="prototype-modal-close" onClick={onClose} aria-label="Close expert dialog"><X /></button>
        <div className="eyebrow">Prototype interaction</div>
        <h2 id="expert-modal-title" className="display">Talk to an Expert</h2>
        <p>In a production experience, this would connect the traveler with a cruise specialist.</p>
        <button className="btn btn-dark" onClick={onClose}>Continue exploring <ArrowRight size={15} /></button>
      </div>
    </div>
  );
}
function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <Link href="/" className="brand" aria-label="Cruise Discovery home">
            <span className="brand-mark">
              <Compass size={17} />
            </span>
            <span className="brand-name">Cruise Discovery</span>
          </Link>
          <p>Modern cruise discovery and booking experience.</p>
        </div>
        <div className="footer-links">
          <Link href="/cruises">Cruises</Link>
          <Link href="/deals">Deals</Link>
          <Link href="/cruises?destination=alaska">Destinations</Link>
          <Link href="/cruises">Cruise Lines</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>Independent UX concept · Sample cruises and pricing</span>
        <span>Not affiliated with any cruise agency or cruise line</span>
      </div>
    </footer>
  );
}

export function HomePage() {
  const featured = getFeaturedCruises();
  const ticker = getTickerDeals().slice(0, 3);
  return (
    <main>
      <section className="hero">
        <div className="hero-media" />
        <div className="container hero-content">
          <div className="hero-kicker">
            <span />
            CURATED CRUISE DISCOVERY
          </div>
          <h1 className="display">Your next cruise, reimagined.</h1>
          <p className="hero-copy">
            The world is wide. Finding the right way through it should feel
            effortless. Discover exceptional cruise deals with the guidance of
            people who know the sea.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/cruises">
              Find your cruise <ArrowRight size={16} />
            </Link>
            <Link className="btn btn-ghost" href="/deals">
              Explore 90-Day Deals
            </Link>
          </div>
          <CruiseSearch />
        </div>
      </section>
      <section className="section light-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Last-minute fares worth exploring</div>
              <h2 className="display">A better way to find a deal.</h2>
            </div>
            <Link className="btn btn-outline" href="/deals">
              View all deals <ArrowRight size={15} />
            </Link>
          </div>
          <div className="ticker-grid">
            {ticker.map((cruise, index) => (
              <DealCard
                key={cruise.id}
                cruise={cruise}
                featured={index === 0}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Go somewhere remarkable</div>
              <h2 className="display">Routes with a point of view.</h2>
            </div>
            <p>
              From glacial blue to Mediterranean gold, choose a destination that
              stays with you.
            </p>
          </div>
          <div className="destination-scroll">
            {destinations.slice(0, 6).map((destination, index) => (
              <Link
                href={`/cruises?destination=${destination.id}`}
                className="destination-card"
                key={destination.id}
              >
                <div
                  className="destination-card-image"
                  style={{ backgroundPosition: `${index * 17}% center` }}
                />
                <div className="destination-card-content">
                  <div className="eyebrow" style={{ color: "var(--teal)" }}>
                    {destination.region}
                  </div>
                  <h3 className="display">{destination.name}</h3>
                  <span style={{ color: "#c7d8dd", fontSize: ".76rem" }}>
                    {destination.description}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section light-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Handpicked for the curious</div>
              <h2 className="display">A little more than a vacation.</h2>
            </div>
            <p>
              Every featured journey balances the right ship, the right route,
              and the right kind of days at sea.
            </p>
          </div>
          <div className="ticker-grid">
            {featured.map((cruise) => (
              <DealCard key={cruise.id} cruise={cruise} />
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container trust-grid">
          <div className="trust-intro">
            <div className="eyebrow">Why it works</div>
            <h2 className="display">The human side of a great journey.</h2>
            <p>
              Expert guidance when you want it.
            </p>
            <Link className="btn btn-dark" href="/cruises">
              Meet your match <ArrowRight size={15} />
            </Link>
          </div>
          <div className="trust-item">
            <span className="trust-number"><Search size={26} /></span>
            <h3>Powerful search</h3>
            <p>Keep the depth of cruise search without the dated experience.</p>
          </div>
          <div className="trust-item">
            <span className="trust-number"><Compass size={26} /></span>
            <h3>Human guidance</h3>
            <p>Connect travelers with an expert when they want a second opinion.</p>
          </div>
          <div className="trust-item">
            <span className="trust-number"><ArrowRight size={26} /></span>
            <h3>Clear comparison</h3>
            <p>See route, ship, cabin, and price details together.</p>
          </div>
        </div>
      </section>
      <section className="quote-band section">
        <div className="container quote-band-inner">
          <div>
            <div className="eyebrow" style={{ color: "var(--teal)" }}>
              Let's make it personal
            </div>
            <h2 className="display">Tell us where you want to go.</h2>
          </div>
          <div>
            <p>
              Prefer help choosing? A modern cruise experience can connect
              travelers with an expert when they need one.
            </p>
            <Link className="btn btn-primary" href="/cruises">
              Talk to an expert <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
function DealCard({
  cruise,
  featured = false,
}: {
  cruise: Cruise;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/cruises/${cruise.slug}`}
      className="deal-card"
      style={{ minHeight: featured ? 470 : 420 }}
    >
      <div
        className="deal-card-image"
        style={{ backgroundPosition: featured ? "center" : "72% center" }}
      />
      <div className="deal-card-body">
        <div className="eyebrow" style={{ color: "var(--teal)" }}>
          {cruise.destination.name} · {cruise.nights} nights
        </div>
        <h3 className="display">{cruise.title}</h3>
        <div className="deal-card-meta">
          <small>
            {cruise.cruiseLine.name}
            <br />
            {cruise.ship.name} · departs{" "}
            {new Date(cruise.departureDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </small>
          <div>
            <div className="savings">SAVE {cruise.savingsPercent}%</div>
            <div className="deal-price">
              ${cruise.currentPrice.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function CruiseSearch({
  initialFilters = {},
}: {
  initialFilters?: CruiseFilters;
}) {
  const [destination, setDestination] = useState(
    initialFilters.destination ?? "",
  );
  const [port, setPort] = useState(initialFilters.departurePort ?? "");
  const [line, setLine] = useState(initialFilters.cruiseLine ?? "");
  const [nights, setNights] = useState(
    initialFilters.maxNights?.toString() ?? "",
  );
  const [dealOnly, setDealOnly] = useState(initialFilters.dealOnly ?? false);
  const go = () => {
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (port) params.set("departurePort", port);
    if (line) params.set("cruiseLine", line);
    if (nights) params.set("maxNights", nights);
    if (dealOnly) params.set("dealOnly", "1");
    window.location.href = `/cruises?${params.toString()}`;
  };
  return (
    <div className="search-panel glass">
      <div className="search-panel-top">
        <h3>Find your cruise</h3>
        <span>Explore cruises across the world’s most memorable routes.</span>
      </div>
      <div className="search-fields">
        <div className="field">
          <label>Destination</label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          >
            <option value="">Anywhere</option>
            {destinations.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Departure port</label>
          <select value={port} onChange={(e) => setPort(e.target.value)}>
            <option value="">Any port</option>
            {ports.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>When</label>
          <input
            type="text"
            placeholder="Any month"
            aria-label="Departure month"
          />
        </div>
        <div className="field">
          <label>Cruise line</label>
          <select value={line} onChange={(e) => setLine(e.target.value)}>
            <option value="">All lines</option>
            {cruiseLines.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Length</label>
          <select value={nights} onChange={(e) => setNights(e.target.value)}>
            <option value="">Any length</option>
            <option value="5">Under 5 nights</option>
            <option value="7">Under 7 nights</option>
            <option value="10">Under 10 nights</option>
          </select>
        </div>
        <button className="btn btn-dark search-submit" onClick={go}>
          <Search size={16} /> Search
        </button>
      </div>
      <div className="quick-filters">
        <button
          className={`chip ${dealOnly ? "active" : ""}`}
          onClick={() => setDealOnly(!dealOnly)}
        >
          Last-minute deals
        </button>
        <button
          className="chip"
          onClick={() => (window.location.href = "/deals")}
        >
          90-Day Deals
        </button>
        <span className="chip">Ocean cruise</span>
        <span className="chip">Balcony</span>
        <span className="chip">Family friendly</span>
        <span className="chip">All-inclusive</span>
        <span className="chip">
          More filters{" "}
          <ChevronDown size={12} style={{ verticalAlign: "middle" }} />
        </span>
      </div>
    </div>
  );
}

function parseFilters(
  searchParams: Record<string, string | string[] | undefined>,
): CruiseFilters {
  const one = (key: string) =>
    typeof searchParams[key] === "string"
      ? (searchParams[key] as string)
      : undefined;
  return {
    destination: one("destination"),
    departurePort: one("departurePort"),
    cruiseLine: one("cruiseLine"),
    ship: one("ship"),
    cruiseType: one("cruiseType") as CruiseFilters["cruiseType"],
    cabin: one("cabin") as CabinType | undefined,
    departureMonth: one("departureMonth"),
    maxNights: one("maxNights") ? Number(one("maxNights")) : undefined,
    minNights: one("minNights") ? Number(one("minNights")) : undefined,
    maxPrice: one("maxPrice") ? Number(one("maxPrice")) : undefined,
    dealOnly: one("dealOnly") === "1",
    returnToSamePort: one("returnToSamePort") === "1",
    sort: (one("sort") as SortOption) ?? "recommended",
    view: (one("view") as ViewMode) ?? "cards",
  };
}
function filtersToQuery(filters: CruiseFilters) {
  const params = new URLSearchParams();
  const entries: Array<[keyof CruiseFilters, string | undefined]> = [
    ["destination", filters.destination],
    ["departurePort", filters.departurePort],
    ["cruiseLine", filters.cruiseLine],
    ["ship", filters.ship],
    ["cabin", filters.cabin],
    ["departureMonth", filters.departureMonth],
    ["cruiseType", filters.cruiseType],
    ["minNights", filters.minNights?.toString()],
    ["maxNights", filters.maxNights?.toString()],
    ["minPrice", filters.minPrice?.toString()],
    ["maxPrice", filters.maxPrice?.toString()],
    ["sort", filters.sort !== "recommended" ? filters.sort : undefined],
    ["view", filters.view !== "cards" ? filters.view : undefined],
  ];
  entries.forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  if (filters.dealOnly) params.set("dealOnly", "1");
  if (filters.returnToSamePort) params.set("returnToSamePort", "1");
  return params;
}
function filterLabel(key: string, value: string | boolean | number) {
  if (key === "destination")
    return (
      destinations.find((item) => item.id === value)?.name ?? String(value)
    );
  if (key === "cruiseLine")
    return cruiseLines.find((item) => item.id === value)?.name ?? String(value);
  if (key === "dealOnly") return "Deals only";
  if (key === "returnToSamePort") return "Return to same port";
  if (key === "minNights") return `${value}+ nights`;
  if (key === "maxNights") return `Up to ${value} nights`;
  if (key === "departureMonth") {
    return new Date(`${value}-01T00:00:00`).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }
  return String(value);
}
export function ResultsClient({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const initial = parseFilters(searchParams);
  const [filters, setFilters] = useState<CruiseFilters>(initial);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => setSaved(getSavedCruises()), []);
  useEffect(() => {
    const query = filtersToQuery(filters).toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  }, [filters, pathname, router]);
  const results = searchCruises(cruises, filters);
  const setFilter = (
    key: keyof CruiseFilters,
    value: string | boolean | number | undefined,
  ) => setFilters((current) => ({ ...current, [key]: value }));
  const clear = () => setFilters({ sort: "recommended", view: "cards" });
  const active = Object.entries(filters).filter(
    ([key, value]) => value && !["sort", "view"].includes(key),
  );
  return (
    <>
      <div className="active-filters">
        {active.map(([key, value]) => (
          <button
            className="chip active"
            key={key}
            onClick={() => setFilter(key as keyof CruiseFilters, undefined)}
          >
            {filterLabel(key, value as string | boolean | number)}{" "}
            <X size={12} />
          </button>
        ))}
        {active.length > 0 && (
          <button className="chip" onClick={clear}>
            Clear all
          </button>
        )}
      </div>
      <div className="results-layout">
        <aside className="filter-sidebar">
          <FilterPanel filters={filters} setFilter={setFilter} clear={clear} />
        </aside>
        <section>
          <div className="results-toolbar">
            <div>
              <h2>
                {results.length
                  ? `${results.length} cruises found`
                  : "No cruises found"}
              </h2>
              <p>
                {filters.destination
                  ? destinations.find((item) => item.id === filters.destination)
                      ?.name
                  : "Across every destination"}
              </p>
            </div>
            <div className="toolbar-actions">
              <button
                className="btn btn-outline mobile-filter-button"
                onClick={() => setMobileFilters(true)}
              >
                <SlidersHorizontal size={15} /> Filters
              </button>
              <select
                className="select-control"
                value={filters.sort}
                onChange={(e) =>
                  setFilter("sort", e.target.value as SortOption)
                }
              >
                <option value="recommended">Recommended</option>
                <option value="price">Lowest price</option>
                <option value="savings">Highest savings</option>
                <option value="departure">Departure date</option>
                <option value="shortest">Shortest cruise</option>
                <option value="longest">Longest cruise</option>
              </select>
              <select
                className="select-control"
                value={filters.view}
                onChange={(e) => setFilter("view", e.target.value as ViewMode)}
              >
                <option value="cards">Card view</option>
                <option value="compact">Compact view</option>
              </select>
            </div>
          </div>
          <div className="result-list">
            {results.length ? (
              results.map((cruise) => (
                <ResultCard
                  key={cruise.id}
                  cruise={cruise}
                  saved={saved.includes(cruise.id)}
                  compared={compare.includes(cruise.id)}
                  onSave={() => setSaved(toggleSavedCruise(cruise.id))}
                  onCompare={() =>
                    setCompare((list) =>
                      list.includes(cruise.id)
                        ? list.filter((id) => id !== cruise.id)
                        : [...list, cruise.id],
                    )
                  }
                  compact={filters.view === "compact"}
                />
              ))
            ) : (
              <div className="empty-state">
                <Search size={28} color="var(--blue)" />
                <h3>Let’s widen the horizon.</h3>
                <p>Try clearing a filter or exploring every destination.</p>
                <button className="btn btn-dark" onClick={clear}>
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
      {mobileFilters && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 30,
            background: "#061a2e88",
          }}
          onClick={() => setMobileFilters(false)}
        >
          <div
            style={{
              background: "white",
              width: "min(380px, 88vw)",
              height: "100%",
              padding: 24,
              overflow: "auto",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <h2 style={{ margin: 0 }}>Filters</h2>
              <button
                onClick={() => setMobileFilters(false)}
                aria-label="Close filters"
              >
                <X />
              </button>
            </div>
            <FilterPanel
              filters={filters}
              setFilter={setFilter}
              clear={clear}
            />
          </div>
        </div>
      )}
    </>
  );
}
function FilterPanel({
  filters,
  setFilter,
  clear,
}: {
  filters: CruiseFilters;
  setFilter: (
    key: keyof CruiseFilters,
    value: string | boolean | number | undefined,
  ) => void;
  clear: () => void;
}) {
  return (
    <div>
      <h3>Refine your journey</h3>
      <div className="filter-group">
        <details open>
          <summary>
            Destination <ChevronDown size={15} />
          </summary>
          <div className="filter-options">
            {destinations.map((item) => (
              <label key={item.id}>
                <input
                  type="radio"
                  name="destination"
                  checked={filters.destination === item.id}
                  onChange={() => setFilter("destination", item.id)}
                />{" "}
                {item.name}
              </label>
            ))}
          </div>
        </details>
      </div>
      <div className="filter-group">
        <details>
          <summary>
            Departure month <ChevronDown size={15} />
          </summary>
          <div className="filter-options">
            {["2027-01", "2027-02", "2027-04", "2027-05", "2027-06", "2027-08", "2027-09", "2027-11"].map((month) => (
              <label key={month}>
                <input
                  type="radio"
                  name="departureMonth"
                  checked={filters.departureMonth === month}
                  onChange={() => setFilter("departureMonth", month)}
                />{" "}
                {new Date(`${month}-01T00:00:00`).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </label>
            ))}
          </div>
        </details>
      </div>
      <div className="filter-group">
        <details>
          <summary>
            Departure port <ChevronDown size={15} />
          </summary>
          <div className="filter-options">
            {ports.map((item) => (
              <label key={item.id}>
                <input
                  type="radio"
                  name="departurePort"
                  checked={filters.departurePort === item.id}
                  onChange={() => setFilter("departurePort", item.id)}
                />{" "}
                {item.name}
              </label>
            ))}
          </div>
        </details>
      </div>
      <div className="filter-group">
        <details open>
          <summary>
            Cruise line <ChevronDown size={15} />
          </summary>
          <div className="filter-options">
            {cruiseLines.slice(0, 6).map((item) => (
              <label key={item.id}>
                <input
                  type="radio"
                  name="line"
                  checked={filters.cruiseLine === item.id}
                  onChange={() => setFilter("cruiseLine", item.id)}
                />{" "}
                {item.name}
              </label>
            ))}
          </div>
        </details>
      </div>
      <div className="filter-group">
        <details>
          <summary>
            Ship <ChevronDown size={15} />
          </summary>
          <div className="filter-options">
            {ships.map((item) => (
              <label key={item.id}>
                <input
                  type="radio"
                  name="ship"
                  checked={filters.ship === item.id}
                  onChange={() => setFilter("ship", item.id)}
                />{" "}
                {item.name}
              </label>
            ))}
          </div>
        </details>
      </div>
      <div className="filter-group">
        <details>
          <summary>
            Cabin type <ChevronDown size={15} />
          </summary>
          <div className="filter-options">
            {(["Interior", "Oceanview", "Balcony", "Suite"] as CabinType[]).map((cabin) => (
              <label key={cabin}>
                <input
                  type="radio"
                  name="cabin"
                  checked={filters.cabin === cabin}
                  onChange={() => setFilter("cabin", cabin)}
                />{" "}
                {cabin}
              </label>
            ))}
          </div>
        </details>
      </div>
      <div className="filter-group">
        <details>
          <summary>
            Price range <ChevronDown size={15} />
          </summary>
          <div className="filter-options">
            {[[1000, "Under $1,000"], [1500, "$1,000–$1,500"], [2500, "$1,500–$2,500"]].map(([max, label]) => (
              <label key={String(max)}>
                <input
                  type="radio"
                  name="maxPrice"
                  checked={filters.maxPrice === max}
                  onChange={() => setFilter("maxPrice", max as number)}
                />{" "}
                {label}
              </label>
            ))}
          </div>
        </details>
      </div>
      <div className="filter-group">
        <details open>
          <summary>
            Number of nights <ChevronDown size={15} />
          </summary>
          <div className="filter-options">
            <label>
              <input
                type="radio"
                name="nights"
                checked={!filters.maxNights}
                onChange={() => {
                  setFilter("minNights", undefined);
                  setFilter("maxNights", undefined);
                }}
              />{" "}
              Any length
            </label>
            <label>
              <input
                type="radio"
                name="nights"
                checked={filters.maxNights === 5}
                onChange={() => {
                  setFilter("minNights", 2);
                  setFilter("maxNights", 5);
                }}
              />{" "}
              2–5 nights
            </label>
            <label>
              <input
                type="radio"
                name="nights"
                checked={filters.minNights === 7}
                onChange={() => {
                  setFilter("minNights", 7);
                  setFilter("maxNights", 14);
                }}
              />{" "}
              7–14 nights
            </label>
          </div>
        </details>
      </div>
      <div className="filter-group">
        <details open>
          <summary>
            Experience <ChevronDown size={15} />
          </summary>
          <div className="filter-options">
            <label>
              <input
                type="checkbox"
                checked={filters.dealOnly ?? false}
                onChange={(e) => setFilter("dealOnly", e.target.checked)}
              />{" "}
              Deals only
            </label>
            <label>
              <input
                type="checkbox"
                checked={filters.returnToSamePort ?? false}
                onChange={(e) =>
                  setFilter("returnToSamePort", e.target.checked)
                }
              />{" "}
              Return to same port
            </label>
          </div>
        </details>
      </div>
      <button
        className="btn btn-outline"
        style={{ width: "100%" }}
        onClick={clear}
      >
        Clear all filters
      </button>
    </div>
  );
}
function ResultCard({
  cruise,
  saved,
  compared,
  onSave,
  onCompare,
  compact,
}: {
  cruise: Cruise;
  saved: boolean;
  compared: boolean;
  onSave: () => void;
  onCompare: () => void;
  compact?: boolean;
}) {
  return (
    <article
      className="result-card"
      style={compact ? { gridTemplateColumns: "120px 1fr auto" } : undefined}
    >
      <div
        className="result-image"
        aria-label={`${cruise.destination.name} cruise imagery`}
        role="img"
      />
      <div className="result-content">
        <div className="eyebrow">
          {cruise.destination.name} · {cruise.cruiseType}
        </div>
        <h3>{cruise.title}</h3>
        <p>
          {cruise.cruiseLine.name} · {cruise.ship.name}
        </p>
        <div className="result-facts">
          <span>{cruise.nights} nights</span>
          <span>
            Departs{" "}
            {new Date(cruise.departureDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span>{cruise.departurePort.name}</span>
        </div>
        <div className="result-itinerary">
          {cruise.ports
            .slice(0, 5)
            .map((stop) => stop.port)
            .join(" → ")}
        </div>
      </div>
      <div className="result-price">
        <div>
          <small>from / person</small>
          <s>${cruise.originalPrice.toLocaleString()}</s>
          <strong>${cruise.currentPrice.toLocaleString()}</strong>
          <div className="savings">SAVE {cruise.savingsPercent}%</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            className="chip"
            onClick={onSave}
            aria-label={saved ? "Remove saved cruise" : "Save cruise"}
          >
            {saved ? (
              <Heart size={14} fill="currentColor" />
            ) : (
              <Heart size={14} />
            )}
          </button>
          <button
            className={`chip ${compared ? "active" : ""}`}
            onClick={onCompare}
            aria-label="Compare cruise"
          >
            Compare
          </button>
          <Link className="btn btn-dark" href={`/cruises/${cruise.slug}`}>
            View cruise
          </Link>
        </div>
      </div>
    </article>
  );
}

export function DetailPage({ cruise }: { cruise: Cruise }) {
  const [selected, setSelected] = useState<CabinType>("Interior");
  const cabin = cruise.cabins.find((item) => item.type === selected)!;
  const [quote, setQuote] = useState(false);
  return (
    <main>
      <section className="detail-hero">
        <div className="detail-hero-media" />
        <div className="container detail-hero-content">
          <div className="eyebrow" style={{ color: "var(--teal)" }}>
            {cruise.cruiseLine.name} · {cruise.ship.name}
          </div>
          <h1 className="display">{cruise.title}</h1>
          <div className="detail-meta">
            <span>
              {cruise.departurePort.name} → {cruise.destination.name} →{" "}
              {cruise.returnPort.name}
            </span>
            <span>
              {new Date(cruise.departureDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}{" "}
              –{" "}
              {new Date(cruise.returnDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="detail-price">
            <small>Starting from</small>
            <strong>
              ${cruise.currentPrice.toLocaleString()} <small>/ person</small>
            </strong>
          </div>
          <div className="detail-actions">
            <button className="btn btn-primary" onClick={() => setQuote(true)}>
              Request a quote <ArrowRight size={16} />
            </button>
            <button className="btn btn-ghost" onClick={() => setQuote(true)}>
              Talk to an expert <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>
      <div className="sticky-bar">
        <span>
          {cruise.title} · from ${cruise.currentPrice.toLocaleString()}
        </span>
        <button className="btn btn-primary" onClick={() => setQuote(true)}>
          Request a quote
        </button>
      </div>
      <section className="story-section">
        <div className="container story-grid">
          <div>
            <div className="eyebrow">The shape of the journey</div>
            <h2 className="display">Some places ask you to slow down.</h2>
            <p>{cruise.description}</p>
            <div className="timeline">
              {cruise.ports.map((stop) => (
                <div className="timeline-item" key={`${stop.day}-${stop.port}`}>
                  <strong>
                    Day {stop.day} · {stop.port}
                  </strong>
                  <span>{stop.description}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="story-image" />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Read the route</div>
              <h2 className="display">The world, in a line.</h2>
            </div>
            <p>
              A route made to be followed slowly. Tap into each stop, then let
              the sea fill in the spaces between.
            </p>
          </div>
          <div className="map-card">
            <svg
              className="route-map"
              viewBox="0 0 800 280"
              aria-label="Illustrative route map"
            >
              <path
                className="route-path"
                d="M80 180 C180 80, 250 210, 350 120 S530 70, 690 170"
              />
              {cruise.ports.slice(0, 6).map((stop, index) => {
                const x = [80, 190, 300, 420, 550, 690][index];
                const y = [180, 112, 180, 116, 80, 170][index];
                return (
                  <g key={stop.port}>
                    <circle className="route-point" cx={x} cy={y} r="7" />
                    <text className="route-label" x={x - 25} y={y + 27}>
                      {stop.port}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </section>
      <section className="story-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">Your room at sea</div>
              <h2 className="display">Choose your view.</h2>
            </div>
            <p>
              Start with the way you want to wake up. Every cabin is designed to
              make the in-between time feel just as good.
            </p>
          </div>
          <div className="cabin-grid">
            {cruise.cabins.map((item) => (
              <button
                className={`cabin-card ${selected === item.type ? "selected" : ""}`}
                key={item.type}
                onClick={() => setSelected(item.type)}
              >
                <div className="cabin-image" />
                <div className="cabin-body" style={{ textAlign: "left" }}>
                  <h3>{item.type}</h3>
                  <p>{item.description}</p>
                  <strong>${item.from.toLocaleString()}</strong>
                  <div
                    style={{
                      color: "var(--muted)",
                      fontSize: ".7rem",
                      marginTop: 8,
                    }}
                  >
                    {item.features.join(" · ")}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="pricing-card">
            <div>
              <div className="eyebrow" style={{ color: "var(--teal)" }}>
                Make it yours
              </div>
              <h2 className="display">
                A good trip starts with a clear number.
              </h2>
              <p>
                Prices are per person, based on double occupancy. Sample prices
                are shown for demonstration purposes and may not reflect
                current cruise-line availability, taxes or fees.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => setQuote(true)}
              >
                Request a quote <ArrowRight size={15} />
              </button>
            </div>
            <div className="pricing-list">
              {cruise.cabins.map((item) => (
                <div className="pricing-row" key={item.type}>
                  <span>{item.type}</span>
                  <strong>from ${item.from.toLocaleString()}</strong>
                </div>
              ))}
              <div className="pricing-row">
                <span>Selected cabin</span>
                <strong>
                  {selected} · ${cabin.from.toLocaleString()}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>
      {quote && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 40,
            background: "#061a2e99",
            display: "grid",
            placeItems: "center",
            padding: 20,
          }}
        >
          <div
            className="glass"
            style={{
              maxWidth: 460,
              padding: 30,
              borderRadius: 24,
              color: "var(--ink)",
            }}
          >
            <button
              onClick={() => setQuote(false)}
              style={{ float: "right", border: 0, background: "transparent" }}
              aria-label="Close quote dialog"
            >
              <X />
            </button>
            <div className="eyebrow">Prototype interaction</div>
            <h2
              className="display"
              style={{ fontSize: "2.4rem", margin: "10px 0" }}
            >
              Talk to an Expert
            </h2>
            <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>
              In a production experience, this would connect the traveler with
              a cruise specialist.
            </p>
            <button className="btn btn-dark" onClick={() => setQuote(false)}>
              Continue exploring <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export function TickerPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const initial = parseFilters(searchParams);
  const [filters, setFilters] = useState<CruiseFilters>({
    ...initial,
    sort: initial.sort === "recommended" ? "savings" : initial.sort,
    dealOnly: true,
  });
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    const query = filtersToQuery(filters).toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  }, [filters, pathname, router]);
  const deals = searchCruises(cruises, filters);
  const update = (
    key: keyof CruiseFilters,
    value: string | number | undefined,
  ) => setFilters((current) => ({ ...current, [key]: value }));
  return (
    <main>
      <div className="page-header ticker-header">
        <div className="container">
          <div className="eyebrow" style={{ color: "var(--teal)" }}>
            LAST-MINUTE CRUISE DEALS
          </div>
          <h1 className="display">Good fares have a rhythm.</h1>
          <p>
            Departures coming soon, organized by price, destination, and
            savings.
          </p>
        </div>
      </div>
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <div className="ticker-tools">
            <select
              className="select-control"
              value={filters.destination ?? ""}
              onChange={(e) =>
                update("destination", e.target.value || undefined)
              }
            >
              <option value="">All destinations</option>
              {destinations.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <select
              className="select-control"
              value={filters.cruiseLine ?? ""}
              onChange={(e) =>
                update("cruiseLine", e.target.value || undefined)
              }
            >
              <option value="">All cruise lines</option>
              {cruiseLines.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <select
              className="select-control"
              value={filters.sort ?? "savings"}
              onChange={(e) => update("sort", e.target.value as SortOption)}
            >
              <option value="savings">Highest savings</option>
              <option value="price">Lowest price</option>
              <option value="departure">Departure date</option>
              <option value="shortest">Cruise length</option>
            </select>
            <span
              style={{
                marginLeft: "auto",
                color: "var(--muted)",
                fontSize: ".77rem",
              }}
            >
              {deals.length} sample deals
            </span>
          </div>
          <div className="ticker-table-wrap" style={{ marginTop: 18 }}>
            <table className="ticker-table">
              <thead>
                <tr>
                  <th>Departure</th>
                  <th>Journey</th>
                  <th>Destination</th>
                  <th>Line / ship</th>
                  <th>From</th>
                  <th>Save</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {deals.map((deal) => (
                  <tr key={deal.id}>
                    <td>
                      <strong>
                        {new Date(deal.departureDate).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" },
                        )}
                      </strong>
                      <br />
                      <span className="ticker-old">{deal.nights} nights</span>
                    </td>
                    <td>
                      <strong>{deal.title}</strong>
                      <br />
                      <span className="ticker-old">
                        from {deal.departurePort.name}
                      </span>
                    </td>
                    <td>{deal.destination.name}</td>
                    <td>
                      {deal.cruiseLine.name}
                      <br />
                      <span className="ticker-old">{deal.ship.name}</span>
                    </td>
                    <td>
                      <span className="ticker-old">
                        <s>${deal.originalPrice.toLocaleString()}</s>
                      </span>
                      <br />
                      <span className="ticker-deal">
                        ${deal.currentPrice.toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <span className="savings">{deal.savingsPercent}%</span>
                    </td>
                    <td>
                      <Link
                        className="btn btn-dark"
                        href={`/cruises/${deal.slug}`}
                      >
                        View <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
