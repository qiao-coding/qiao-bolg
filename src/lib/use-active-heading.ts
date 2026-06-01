"use client";

import { useEffect, useState, useRef, useCallback } from "react";

export function useActiveHeading(
  headingIds: string[],
  offsetY: number = 80
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);
  const headingElementsRef = useRef<Map<string, HTMLElement>>(new Map());
  const rafIdRef = useRef<number | null>(null);
  const lastActiveIdRef = useRef<string | null>(null);

  const calculateActiveHeading = useCallback(() => {
    if (headingIds.length === 0) return null;

    const scrollY = window.scrollY;
    const triggerPosition = scrollY + offsetY;

    let bestAbove: { id: string | null; distance: number } = {
      id: null,
      distance: Infinity,
    };
    let bestBelow: { id: string | null; distance: number } = {
      id: null,
      distance: Infinity,
    };

    headingIds.forEach((id) => {
      const element = headingElementsRef.current.get(id);
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const absoluteTop = scrollY + rect.top;
      const distanceFromTrigger = absoluteTop - triggerPosition;

      if (distanceFromTrigger <= 0) {
        const distance = Math.abs(distanceFromTrigger);
        if (distance < bestAbove.distance) {
          bestAbove = { id, distance };
        }
      } else {
        if (distanceFromTrigger < bestBelow.distance) {
          bestBelow = { id, distance: distanceFromTrigger };
        }
      }
    });

    if (bestAbove.id) return bestAbove.id;
    if (bestBelow.id) return bestBelow.id;
    return headingIds.length > 0 ? headingIds[0] : null;
  }, [headingIds, offsetY]);

  const handleScroll = useCallback(() => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(() => {
      const newActiveId = calculateActiveHeading();
      if (newActiveId !== lastActiveIdRef.current) {
        setActiveId(newActiveId);
        lastActiveIdRef.current = newActiveId;
      }
    });
  }, [calculateActiveHeading]);

  useEffect(() => {
    if (headingIds.length === 0) return;

    headingElementsRef.current.clear();
    headingIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        headingElementsRef.current.set(id, element);
      }
    });

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [headingIds, handleScroll, calculateActiveHeading]);

  return activeId;
}
