import type { CanvasContext, Size } from "@/utils/common";
import type { Viewport } from "@/utils/manipulation";
import { useCanvasStack } from "./useCanvasStack";
import { useMemo, type RefObject } from "react";

const alphaGridCellSize = 20;

const applyTransform = (viewport: Viewport, element: HTMLElement) => {
  element.style.transform = `
      translate(${viewport.position.x}px, ${viewport.position.y}px) 
      scale(${viewport.zoom})
    `;
  element.style.setProperty(
    "--alpha-background-size",
    `${alphaGridCellSize / viewport.zoom}px`
  );
};

export type CanvasRenderer = {
  getDrawContext: () => CanvasContext;
  setViewport: (viewport: Viewport) => void;
};

export const useCanvasRenderer = (
  hostElementRef: RefObject<HTMLElement>,
  size: Size
) => {
  const stack = useCanvasStack(hostElementRef, size);
  const renderer = useMemo<CanvasRenderer>(() => {
    return {
      getDrawContext: () => {
        return stack[0].getContext("2d") as never as CanvasContext;
      },
      setViewport: (viewport: Viewport) => {
        stack[0] && applyTransform(viewport, stack[0]);
      },
    };
  }, [stack]);

  return renderer;
};

