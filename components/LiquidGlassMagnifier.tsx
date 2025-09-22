"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

interface LiquidGlassMagnifierProps {
  targetRef: React.RefObject<HTMLElement>;
  isActive: boolean;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
}

export default function LiquidGlassMagnifier({
  targetRef,
  isActive,
  imageUrl,
  imageWidth,
  imageHeight,
}: LiquidGlassMagnifierProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [id] = useState(`liquid-glass-${Math.random().toString(36).substr(2, 9)}`);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [imageDisplaySize, setImageDisplaySize] = useState({ width: 0, height: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, initialX: 0, initialY: 0 });

  const WIDTH = 400;
  const HEIGHT = 400;
  const CANVAS_DPI = 1;
  const OFFSET = 10;

  // Utility functions
  const smoothStep = useCallback((a: number, b: number, t: number): number => {
    t = Math.max(0, Math.min(1, (t - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }, []);

  const length = useCallback((x: number, y: number): number => {
    return Math.sqrt(x * x + y * y);
  }, []);

  const roundedRectSDF = (
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ): number => {
    const qx = Math.abs(x) - width + radius;
    const qy = Math.abs(y) - height + radius;
    return Math.min(Math.max(qx, qy), 0) + length(Math.max(qx, 0), Math.max(qy, 0)) - radius;
  };

  const constrainPosition = (x: number, y: number) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const minX = OFFSET;
    const maxX = viewportWidth - WIDTH - OFFSET;
    const minY = OFFSET;
    const maxY = viewportHeight - HEIGHT - OFFSET;

    const constrainedX = Math.max(minX, Math.min(maxX, x));
    const constrainedY = Math.max(minY, Math.min(maxY, y));

    return { x: constrainedX, y: constrainedY };
  };

  const updateShader = useCallback(() => {
    if (!canvasRef.current || !svgRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    const w = WIDTH * CANVAS_DPI;
    const h = HEIGHT * CANVAS_DPI;
    const data = new Uint8ClampedArray(w * h * 4);

    let maxScale = 0;
    const rawValues: number[] = [];

    // Fragment shader logic
    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % w;
      const y = Math.floor(i / 4 / w);
      const uvX = x / w;
      const uvY = y / h;

      // No distortion for magnified image - keep it clean
      const texX = uvX;
      const texY = uvY;

      const dx = texX * w - x;
      const dy = texY * h - y;
      maxScale = Math.max(maxScale, Math.abs(dx), Math.abs(dy));
      rawValues.push(dx, dy);
    }

    maxScale *= 0.5;

    let index = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = rawValues[index++] / maxScale + 0.5;
      const g = rawValues[index++] / maxScale + 0.5;
      data[i] = r * 255;
      data[i + 1] = g * 255;
      data[i + 2] = 0;
      data[i + 3] = 255;
    }

    context.putImageData(new ImageData(data, w, h), 0, 0);

    const feImage = svgRef.current.querySelector(`#${id}_map`) as SVGFEImageElement;
    const feDisplacementMap = svgRef.current.querySelector(
      `#${id}_displacement`
    ) as SVGFEDisplacementMapElement;

    if (feImage && feDisplacementMap) {
      feImage.setAttributeNS("http://www.w3.org/1999/xlink", "href", canvas.toDataURL());
      feDisplacementMap.setAttribute("scale", (maxScale / CANVAS_DPI).toString());
    }
  }, [id]);

  useEffect(() => {
    updateShader();
  }, [updateShader]);

  // Position the magnifier at mouse position initially
  useEffect(() => {
    if (!isActive || !targetRef.current) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current && targetRef.current) {
        // Get the image element inside the target container
        const imageElement = targetRef.current.querySelector('img');
        if (!imageElement) return;
        
        const imageRect = imageElement.getBoundingClientRect();
        const mouseX = e.clientX - imageRect.left;
        const mouseY = e.clientY - imageRect.top;
        
        // Store actual displayed image dimensions
        setImageDisplaySize({ 
          width: imageRect.width, 
          height: imageRect.height 
        });
        
        setMousePosition({ x: mouseX, y: mouseY });
        setCursorPosition({ x: e.clientX, y: e.clientY });
        
        // Position magnifier centered on cursor
        const magnifierX = e.clientX - WIDTH / 2;
        const magnifierY = e.clientY - HEIGHT / 2;
        const constrained = constrainPosition(magnifierX, magnifierY);
        setPosition(constrained);
      }
    };

    document.addEventListener("mousemove", handleGlobalMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, [isActive]);

  // Handle dragging
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        initialX: position.x,
        initialY: position.y,
      };
      container.style.cursor = "none";
      e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        const deltaX = e.clientX - dragStartRef.current.x;
        const deltaY = e.clientY - dragStartRef.current.y;

        const newX = dragStartRef.current.initialX + deltaX;
        const newY = dragStartRef.current.initialY + deltaY;

        const constrained = constrainPosition(newX, newY);
        setPosition(constrained);
      } else if (targetRef.current) {
        // Update mouse position for background positioning when not dragging
        const imageElement = targetRef.current.querySelector('img');
        if (!imageElement) return;
        
        const imageRect = imageElement.getBoundingClientRect();
        const mouseX = e.clientX - imageRect.left;
        const mouseY = e.clientY - imageRect.top;
        
        setImageDisplaySize({ 
          width: imageRect.width, 
          height: imageRect.height 
        });
        
        setMousePosition({ x: mouseX, y: mouseY });
        setCursorPosition({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      container.style.cursor = "none";
    };

    container.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [position]);

  if (!isActive) return null;

  return (
    <>
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        width="0"
        height="0"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 9998,
        }}
      >
        <defs>
          <filter
            id={`${id}_filter`}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
            x="0"
            y="0"
            width={WIDTH}
            height={HEIGHT}
          >
            <feImage
              id={`${id}_map`}
              width={WIDTH}
              height={HEIGHT}
            />
            <feDisplacementMap
              id={`${id}_displacement`}
              in="SourceGraphic"
              in2={`${id}_map`}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div
        ref={containerRef}
        className="liquid-glass-magnifier"
        style={{
          position: "fixed",
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${WIDTH}px`,
          height: `${HEIGHT}px`,
          overflow: "hidden",
          borderRadius: "50%",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.25), 0 -10px 25px inset rgba(0, 0, 0, 0.15)",
          cursor: "none",
          backdropFilter: `url(#${id}_filter) blur(0.25px) contrast(1.2) brightness(1.05) saturate(1.1)`,
          WebkitBackdropFilter: `url(#${id}_filter) blur(0.25px) contrast(1.2) brightness(1.05) saturate(1.1)`,
          zIndex: 9999,
          pointerEvents: "auto",
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: `${imageDisplaySize.width * 2}px ${imageDisplaySize.height * 2}px`,
          backgroundPosition: `${-mousePosition.x * 2 + (cursorPosition.x - position.x)}px ${-mousePosition.y * 2 + (cursorPosition.y - position.y)}px`,
          backgroundRepeat: "no-repeat",
        }}
      />

      <canvas
        ref={canvasRef}
        width={WIDTH * CANVAS_DPI}
        height={HEIGHT * CANVAS_DPI}
        style={{ display: "none" }}
      />
    </>
  );
}