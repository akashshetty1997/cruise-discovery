"use client";

const key = "vtg-demo-saved-cruises";
export function getSavedCruises(): string[] { if (typeof window === "undefined") return []; try { return JSON.parse(window.localStorage.getItem(key) ?? "[]"); } catch { return []; } }
export function toggleSavedCruise(id: string) { const next = getSavedCruises().includes(id) ? getSavedCruises().filter((item) => item !== id) : [...getSavedCruises(), id]; try { window.localStorage.setItem(key, JSON.stringify(next)); } catch {} return next; }
