import { useCanvasPreviewContextStore } from "@/contexts/canvasPreviewContextStore";
import type { CanvasLayer } from "@/canvas/canvasState";
import type { CanvasContext } from "@/utils/common";
import { type RefObject, useEffect, useRef } from "react";
import { clearContext, restoreContextFromCompressed } from "@/utils/canvas";

const restoreLayers = async (
  layers: CanvasLayer[],
  contexts: CanvasContext[]
) => {
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    const context = contexts[i];

    if (layer.visible && layer.data) {
      await restoreContextFromCompressed(context, layer.data);

      // if (i === activeLayerIndex && overlayShape?.captured) {
      //   // const rect = overlayShape.captured.box;
      //   // context.clearRect(rect.x, rect.y, rect.width, rect.height);
      // }
    } else {
      clearContext(context);
    }
  }
};

export const useSyncCanvasWithLayers = (
  canvasElementsRef: RefObject<HTMLCanvasElement[]>,
  layers: CanvasLayer[],
  activeLayerIndex: number
) => {
  const contextsMap = useRef(new WeakMap<HTMLCanvasElement, CanvasContext>());
  const { setPreviewContext } = useCanvasPreviewContextStore();
  useEffect(() => {
    if (!canvasElementsRef.current) {
      return;
    }

    const newContexts = canvasElementsRef.current.map(
      (element: HTMLCanvasElement) => {
        if (!contextsMap.current.has(element)) {
          contextsMap.current.set(
            element,
            element.transferControlToOffscreen().getContext("2d")!
          );
        }
        return contextsMap.current.get(element)!;
      }
    );

    restoreLayers(layers, newContexts).then(() =>
      setPreviewContext(newContexts[activeLayerIndex])
    );
  }, [layers, setPreviewContext, activeLayerIndex, canvasElementsRef]);
};
