"use client";
import { useSyncExternalStore } from "react";
import {
  DEFAULT_PROFILE,
  readProfile,
  withMatch,
  type GuestProfile,
  type LocalMatch,
} from "./guest-profile";

const KEY = "ecos.guest.v1";
const EVENT = "ecos:profile";
let rawCache: string | null | undefined;
let cache = DEFAULT_PROFILE;
function getSnapshot() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw !== rawCache) {
      rawCache = raw;
      cache = readProfile(raw);
    }
  } catch {
    /* Keep session state when browser storage is unavailable. */
  }
  return cache;
}
function subscribe(notify: () => void) {
  const changed = (event: StorageEvent) => {
    if (event.key === KEY || event.key === null) notify();
  };
  window.addEventListener("storage", changed);
  window.addEventListener(EVENT, notify);
  return () => {
    window.removeEventListener("storage", changed);
    window.removeEventListener(EVENT, notify);
  };
}
export function useGuestProfile() {
  return useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT_PROFILE);
}
function save(profile: GuestProfile) {
  cache = profile;
  try {
    const raw = JSON.stringify(profile);
    localStorage.setItem(KEY, raw);
    rawCache = raw;
  } catch {
    /* Session changes remain usable without persistent storage. */
  }
  window.dispatchEvent(new Event(EVENT));
}
export function updateProfile(
  patch: Partial<
    Pick<GuestProfile, "name" | "deck" | "finish" | "reducedMotion">
  >,
) {
  save({ ...getSnapshot(), ...patch });
}
export function recordLocalMatch(match: LocalMatch) {
  const current = getSnapshot();
  const next = withMatch(current, match);
  if (next !== current) save(next);
}
