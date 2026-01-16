import { forwardRef, type ReactNode } from "react";
import { cn } from "../../lib/utils";
import { Button, type ButtonProps } from "./button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

export interface IconButtonProps
  extends Omit<ButtonProps, "size" | "children"> {
  icon: ReactNode;
  label: string;
  showTooltip?: boolean;
  tooltipSide?: "top" | "right" | "bottom" | "left";
  size?: "sm" | "default" | "lg";
}

const sizeMap = {
  sm: "h-8 w-8",
  default: "h-10 w-10",
  lg: "h-12 w-12",
} as const;

const iconSizeMap = {
  sm: "[&_svg]:h-4 [&_svg]:w-4",
  default: "[&_svg]:h-5 [&_svg]:w-5",
  lg: "[&_svg]:h-6 [&_svg]:w-6",
} as const;

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      label,
      showTooltip = true,
      tooltipSide = "top",
      size = "default",
      variant,
      className,
      ...props
    },
    ref,
  ) => {
    const button = (
      <Button
        ref={ref}
        variant={variant}
        className={cn("shrink-0", sizeMap[size], iconSizeMap[size], className)}
        aria-label={label}
        {...props}
      >
        {icon}
      </Button>
    );

    if (!showTooltip) {
      return button;
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side={tooltipSide}>
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
);

IconButton.displayName = "IconButton";

export { IconButton };
