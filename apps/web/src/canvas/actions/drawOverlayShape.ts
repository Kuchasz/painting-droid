import type { CanvasOverlayShape } from "../canvasState";
import type { CanvasAction } from "./action";
import type { CanvasActionContext } from "./context";

const translate = (shape: CanvasOverlayShape) => {
  if (shape?.type === "rectangle") {
    return "Rectangle Select";
  }
  return "Unknown";
};

export const createCanvasAction = (
  context: CanvasActionContext,
  payload: {
    overlayShape: CanvasOverlayShape;
  }
): CanvasAction => {
  const { overlayShape } = payload;
  const state = context.getState();
  const previousOverlayShape = state.overlayShape;

  const capturedData = {
    previousOverlayShape,
    newOverlayShape: overlayShape,
  };

  return {
    display: translate(overlayShape),
    icon: "rectangle-select",
    execute: async (state) => {
      return {
        ...state,
        overlayShape: capturedData.newOverlayShape,
      };
    },
    undo: async () => {
      return {
        ...state,
        overlayShape: capturedData.previousOverlayShape,
      };
    },
  };
};
