import type { CanvasLayerId } from "../canvasState";
import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";

export const createCanvasAction = (
  context: CanvasActionContext,
  payload: { layerId: CanvasLayerId }
): CanvasAction => {
  const { layerId } = payload;
  const state = context.getState();

  const capturedData = { layerId };

  return {
    display: "Hide Layer",
    icon: "hidden",
    execute: async (state) => {
      return {
        ...state,
        layers: state.layers.map((layer) =>
          layer.id === capturedData.layerId
            ? { ...layer, visible: false }
            : layer
        ),
      };
    },
    undo: async () => {
      return {
        ...state,
        layers: state.layers.map((layer) =>
          layer.id === capturedData.layerId
            ? { ...layer, visible: true }
            : layer
        ),
      };
    },
  };
};

