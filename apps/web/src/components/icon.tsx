/* This is icon aggregator, all icons from different libraries are imported here */
import { Pen, Pencil, Moon, Sun } from "lucide-react";

type IconType = "pen" | "pencil" | "moon" | "sun";
type IconSize = "small" | "medium";

const renderLucideIcon = (
  icon: IconType,
  size: IconSize,
  className?: string
) => {
  const fontSize = size === "medium" ? 24 : 12;
  switch (icon) {
    case "pen":
      return <Pen className={className} size={fontSize} />;
    case "pencil":
      return <Pencil className={className} size={fontSize} />;
    case "moon":
      return <Moon className={className} size={fontSize} />;
    case "sun":
      return <Sun className={className} size={fontSize} />;
    default:
      return null;
  }
};

export const Icon = (props: {
  type: IconType;
  size: IconSize;
  className?: string;
}) => {
  const { type, size, className } = props;
  return renderLucideIcon(type, size, className);
};

