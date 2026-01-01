"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import type { AnimatedContentProps } from "./type"

gsap.registerPlugin(ScrollTrigger)

export default function AnimatedContent({
  children,
  distance = 100,
  direction = "vertical",
  reverse = false,
  duration = 0.8,
  ease = "power3.out",
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  threshold = 0.1,
  delay = 0,
  onComplete,
}: AnimatedContentProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const axis = direction === "horizontal" ? "x" : "y"
    const offset = reverse ? -distance : distance
    const startPct = (1 - threshold) * 100

    gsap.set(el, {
      [axis]: offset,
      scale,
      opacity: animateOpacity ? initialOpacity : 1,
    })

    gsap.to(el, {
      [axis]: 0,
      scale: 1,
      opacity: 1,
      duration,
      ease,
      delay,
      onComplete,
      scrollTrigger: {
        trigger: el,
        start: `top ${startPct}%`,
        toggleActions: "play none none none",
        once: true,
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
      gsap.killTweensOf(el)
    }
  }, [
    animateOpacity,
    delay,
    direction,
    distance,
    duration,
    ease,
    initialOpacity,
    onComplete,
    reverse,
    scale,
    threshold,
  ])

  return <div ref={ref}>{children}</div>
}
