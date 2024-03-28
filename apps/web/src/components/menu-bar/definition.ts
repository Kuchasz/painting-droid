import { type AdjustmentId, adjustmentsMetadata } from "@/adjustments";
import { commands, type CommandId, type ExecuteCommand } from "@/commands";
import {
  activeWorkspaceCanvasDataSelector,
  type useWorkspacesStore,
} from "@/store/workspacesStore";
import type { MenuItem } from "@/utils/menuItem";
import { getTranslations } from "@/translations";

const translations = getTranslations();

const itemFromCommand = (
  commandId: CommandId,
  executeCommand: ExecuteCommand,
  disabled?: boolean,
  name?: string
): MenuItem => {
  const command = commands[commandId];
  return {
    type: "leaf",
    icon: command.icon,
    label: name ?? command.display ?? translations.general.unknown,
    keyGesture: command.defaultKeyGesture,
    disabled,
    action: { onClick: () => executeCommand(commandId as never) },
  };
};

export const createMenuBarDefinition = (
  stores: {
    workspaces: ReturnType<typeof useWorkspacesStore.getState>;
  },
  executeCommand: ExecuteCommand
): MenuItem[] => {
  const { layers, activeLayerIndex } = activeWorkspaceCanvasDataSelector(
    stores.workspaces
  );
  return [
    {
      type: "parent",
      label: "File",
      items: [
        {
          type: "leaf",
          label: "New",
          action: { onClick: () => executeCommand("createActiveWorkspace") },
        },
        {
          type: "leaf",
          label: "Open",
          action: { onClick: () => executeCommand("openWorkspace") },
        },
        {
          type: "leaf",
          disabled: stores.workspaces.workspaces.length === 1,
          label: "Close",
          action: { onClick: () => executeCommand("closeActiveWorkspace") },
        },
        {
          type: "separator",
        },
        {
          type: "parent",
          label: "Save As...",
          items: [
            {
              type: "leaf",
              label: "PDW Workspace",
              action: { onClick: () => executeCommand("saveAsWorkspace") },
            },
            {
              type: "leaf",
              label: "JPEG Picture",
              action: { onClick: () => executeCommand("saveAsJpeg") },
            },
            {
              type: "leaf",
              label: "PNG Picture",
              action: { onClick: () => executeCommand("saveAsPng") },
            },
          ],
        },
      ],
    },
    {
      type: "parent",
      label: "Edit",
      items: [
        {
          type: "leaf",
          label: "Undo",
          action: { onClick: () => executeCommand("undoCanvasAction") },
        },
        {
          type: "leaf",
          label: "Redo",
          action: { onClick: () => executeCommand("redoCanvasAction") },
        },
      ],
    },
    {
      type: "parent",
      label: "Layers",
      items: [
        itemFromCommand("addLayer", executeCommand),
        itemFromCommand("duplicateLayer", executeCommand),
        itemFromCommand(
          "moveLayerUp",
          executeCommand,
          activeLayerIndex === layers.length - 1
        ),
        itemFromCommand(
          "moveLayerDown",
          executeCommand,
          activeLayerIndex === 0
        ),
        itemFromCommand("removeLayer", executeCommand),
        {
          type: "separator",
        },
        itemFromCommand("hideLayer", executeCommand),
        itemFromCommand("showLayer", executeCommand),
      ],
    },
    {
      type: "parent",
      label: translations.adjustments.name,
      items: Object.entries(adjustmentsMetadata).map(([id, metadata]) => ({
        type: "leaf",
        label: metadata.name,
        action: {
          onClick: () =>
            executeCommand("openAdjustmentsPopup", {
              adjustmentId: id as AdjustmentId,
            }),
        },
      })),
    },
    {
      type: "parent",
      label: translations.models.name,
      items: [
        itemFromCommand("openObjectDetectionDialog", executeCommand),
        itemFromCommand("openTextToImageDialog", executeCommand),
      ],
    },
  ];
};
