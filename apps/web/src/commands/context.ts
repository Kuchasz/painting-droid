import type { CanvasActionDispatcher } from "@/canvas/canvasActionDispatcher";
import type { DialogService } from "@/components/dialogHost";
import type {
  useWorkspacesStore,
  useCommandPaletteStore,
  useLayoutStore,
  useToolStore,
} from "@/store";

export type CommandContext = {
  stores: {
    workspaces: () => ReturnType<typeof useWorkspacesStore.getState>;
    commandPalette: () => ReturnType<typeof useCommandPaletteStore.getState>;
    layout: () => ReturnType<typeof useLayoutStore.getState>;
    tool: () => ReturnType<typeof useToolStore.getState>;
  };
  dialogService: DialogService;
  canvasActionDispatcher: CanvasActionDispatcher;
};
