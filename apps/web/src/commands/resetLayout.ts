import type { CommandContext } from "./context";
import { createCommand } from "./createCommand";

export const command = createCommand({
  id: "resetLayout",
  display: "Reset Layout",
  icon: "reset",
  options: { showInPalette: true },
  execute: async (context: CommandContext) => {
    context.stores.layout().resetLayout();
  },
});

