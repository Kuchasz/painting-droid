import {
  type InferToolSettings,
  createCanvasToolSettingsSchema,
  type CanvasTool,
  type CanvasToolEvent,
  createCanvasToolMetadata,
} from "./canvasTool";
import type { CanvasBitmapContext, Position } from "@/utils/common";
import { getTranslations } from "@/translations";
import { ColorProcessor } from "@/utils/colorProcessor";
import { createFrameTicker, type FrameTicker } from "@/utils/frame";
import { randomRange } from "@/utils/number";

const translations = getTranslations().tools.draw.spray;

const settingsSchema = createCanvasToolSettingsSchema({
  color: {
    name: translations.settings.color,
    type: "color",
    defaultValue: { r: 23, b: 139, g: 84, a: 1 },
  },
  density: {
    name: translations.settings.density,
    type: "option-number",
    defaultValue: 10,
    options: [
      { value: 5, label: "5" },
      { value: 10, label: "10" },
      { value: 20, label: "20" },
    ],
  },
  range: {
    name: translations.settings.range,
    type: "option-number",
    defaultValue: 20,
    options: [
      { value: 5, label: "5px" },
      { value: 10, label: "10px" },
      { value: 20, label: "20px" },
      { value: 50, label: "50px" },
    ],
  },
});

type SprayDrawToolSettings = InferToolSettings<typeof settingsSchema>;

class SprayDrawTool implements CanvasTool<SprayDrawToolSettings> {
  private onCommitCallback: (() => void) | null = null;
  private frameTicker: FrameTicker | null = null;
  private density = 30;
  private range = 20;
  private position: Position = { x: 0, y: 0 };

  constructor(private bitmapContext: CanvasBitmapContext) {}

  configure(settings: SprayDrawToolSettings): void {
    const { range, density, color } = settings;
    this.bitmapContext.fillStyle =
      ColorProcessor.fromRgba(color).toRgbaString();
    this.density = density;
    this.range = range;
  }

  processEvent(event: CanvasToolEvent): void {
    this.position = event.position;

    if (event.type === "manipulationStart") {
      this.frameTicker = createFrameTicker(() => this.drawParticles());
      this.frameTicker.start();
    }

    if (event.type === "manipulationEnd") {
      this.frameTicker?.stop();
      this.frameTicker = null;
      this.onCommitCallback?.();
    }
  }

  onCommit(callback: () => void) {
    this.onCommitCallback = callback;
  }

  reset() {
    this.frameTicker?.cancel();
    this.frameTicker = null;
  }

  private drawParticles() {
    for (let i = 0; i < this.density; i++) {
      const distance = randomRange(1, this.range / 2);
      const angle = randomRange(0, Math.PI * 2);
      const sprayX = this.position.x + distance * Math.cos(angle);
      const sprayY = this.position.y + distance * Math.sin(angle);
      this.bitmapContext.fillRect(sprayX, sprayY, 1, 1);
    }
  }
}

export const sprayDrawToolMetadata = createCanvasToolMetadata({
  id: "spray",
  name: translations.name,
  icon: "spray-can",
  settingsSchema,
  create: (context) => new SprayDrawTool(context.bitmap),
});

