import type { RgbaColor } from "@/utils/color";
import { ColorRectangle } from "../colorRectangle";
import { Fragment } from "react/jsx-runtime";
import { memo } from "react";

export const ColorGrid = memo(
  (props: { colors: RgbaColor[]; onSelected: (color: RgbaColor) => void }) => {
    const { colors, onSelected } = props;
    return (
      <div className="flex flex-wrap gap-small items-center justify-between">
        {Array.from({ length: 6 }).map((_, i) => {
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <Fragment key={i}>
              {colors[i] ? (
                <ColorRectangle
                  onClick={() => onSelected(colors[i])}
                  className="w-5 h-5 border"
                  color={colors[i]}
                />
              ) : (
                <div className="w-5 h-5 border rounded-md" />
              )}
            </Fragment>
          );
        })}
      </div>
    );
  }
);

