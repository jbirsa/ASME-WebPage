"use client";

import dynamic from "next/dynamic";
import { Component, useRef, useState, useEffect, type ReactNode } from "react";

// Error boundary for WebGL failures
class WebGLErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: ReactNode; children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const PlaneViewer = dynamic(() => import("./PlaneViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[4/3] rounded-lg bg-[#141414] flex flex-col items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      <span className="font-mono text-accent/60 text-xs tracking-wider mt-4">
        Cargando modelo 3D...
      </span>
    </div>
  ),
});

interface PlaneViewerDynamicProps {
  fallback: ReactNode;
}

export default function PlaneViewerDynamic({ fallback }: PlaneViewerDynamicProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef}>
      <WebGLErrorBoundary fallback={fallback}>
        {isVisible ? <PlaneViewer /> : (
          <div className="w-full aspect-[4/3] rounded-lg bg-[#141414]" />
        )}
      </WebGLErrorBoundary>
    </div>
  );
}
