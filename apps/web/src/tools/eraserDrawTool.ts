import type {
  CanvasTool,
  CanvasToolEvent,
  CanvasToolMetadata,
} from "./canvasTool";
import type { CanvasBitmapContext } from "@/utils/common";
import { getTranslations } from "@/translations";

const translations = getTranslations().tools.draw.eraser;

export const eraserDrawToolMetadata: CanvasToolMetadata = {
  id: "eraser",
  name: translations.name,
  icon: "eraser",
  settings: {
    size: {
      name: translations.settings.size,
      type: "size",
      default: 3,
      options: [
        { value: 1, label: "1px" },
        { value: 3, label: "3px" },
        { value: 5, label: "5px" },
        { value: 10, label: "10px" },
        { value: 20, label: "20px" },
        { value: 50, label: "50px" },
      ],
    },
  },
} as const;

type EraserDrawToolSettings = {
  size: number;
};

export class EraserDrawTool implements CanvasTool {
  private onCommitCallback: (() => void) | null = null;

  constructor(private bitmapContext: CanvasBitmapContext) {}

  configure(settings: EraserDrawToolSettings): void {
    const { size } = settings;
    this.bitmapContext.lineWidth = size;
    this.bitmapContext.strokeStyle = "white";
    this.bitmapContext.lineCap = "round";
    this.bitmapContext.lineJoin = "round";
  }

  processEvent(event: CanvasToolEvent) {
    if (event.type === "manipulationStart") {
      this.bitmapContext.save();
      this.bitmapContext.globalCompositeOperation = "destination-out";
      this.bitmapContext.beginPath();
      this.bitmapContext.moveTo(event.position.x, event.position.y);
      this.bitmapContext.lineTo(event.position.x, event.position.y);
      this.bitmapContext.stroke();
    }

    if (event.type === "manipulationStep") {
      this.bitmapContext.lineTo(event.position.x, event.position.y);
      this.bitmapContext.stroke();
    }

    if (event.type === "manipulationEnd") {
      this.bitmapContext.closePath();
      this.bitmapContext.restore();
      this.onCommitCallback?.();
    }
  }

  onCommit(callback: () => void) {
    this.onCommitCallback = callback;
  }

  reset() {}
}

