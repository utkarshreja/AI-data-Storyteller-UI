import { useCallback, useEffect, useRef, useState } from "react";

export const SIDEBAR_MIN = 220;
export const SIDEBAR_MAX = 460;
export const SIDEBAR_DEFAULT = 280;
const STORAGE_KEY = "ads:sidebar-width";

/** Keep a requested sidebar width inside the usable range. */
export function clampSidebarWidth(value: number): number {
  if (!Number.isFinite(value)) return SIDEBAR_DEFAULT;
  return Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, Math.round(value)));
}

/**
 * Width of the chat sidebar, draggable by its right edge and remembered between visits.
 * The saved value is read after mount so the server render and the first client render match.
 */
export function useSidebarResize() {
  const [width, setWidth] = useState(SIDEBAR_DEFAULT);
  const [dragging, setDragging] = useState(false);
  const widthRef = useRef(width);
  widthRef.current = width;
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const saved = Number(window.localStorage.getItem(STORAGE_KEY));
    if (saved >= SIDEBAR_MIN && saved <= SIDEBAR_MAX) setWidth(saved);
  }, []);

  // Listeners are attached on the pointerdown itself, so a drag that starts
  // moving immediately is never missed by a render-timed effect.
  const begin = useCallback((clientX: number) => {
    const startX = clientX;
    const base = widthRef.current;
    const onMove = (e: PointerEvent) => {
      setWidth(clampSidebarWidth(base + (e.clientX - startX)));
    };
    const stop = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      cleanupRef.current = null;
      setDragging(false);
    };
    cleanupRef.current?.();
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    cleanupRef.current = stop;
    setDragging(true);
  }, []);

  useEffect(() => () => cleanupRef.current?.(), []);

  const reset = useCallback(() => setWidth(SIDEBAR_DEFAULT), []);

  const nudge = useCallback((delta: number) => {
    setWidth((w) => clampSidebarWidth(w + delta));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, String(width));
  }, [width]);

  return { width, dragging, begin, reset, nudge };
}
