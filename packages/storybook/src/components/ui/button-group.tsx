import {
  Children,
  cloneElement,
  forwardRef,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
} from "react";
import { cn } from "../../lib/utils";
import type { ButtonProps } from "./button";

export interface ButtonGroupProps extends HTMLAttributes<HTMLFieldSetElement> {
  orientation?: "horizontal" | "vertical";
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
}

const ButtonGroup = forwardRef<HTMLFieldSetElement, ButtonGroupProps>(
  (
    {
      children,
      orientation = "horizontal",
      size,
      variant,
      className,
      ...props
    },
    ref,
  ) => {
    const childArray = Children.toArray(children);
    const childCount = childArray.length;

    return (
      <fieldset
        ref={ref}
        className={cn(
          "inline-flex border-0 p-0 m-0",
          orientation === "vertical" ? "flex-col" : "flex-row",
          className,
        )}
        {...props}
      >
        {childArray.map((child, index) => {
          if (!isValidElement(child)) return child;

          const isFirst = index === 0;
          const isLast = index === childCount - 1;

          const buttonClassNames = cn(
            // Remove rounding from middle buttons
            !isFirst && !isLast && "rounded-none",
            // Adjust rounding for first/last based on orientation
            orientation === "horizontal" &&
              isFirst &&
              !isLast &&
              "rounded-r-none",
            orientation === "horizontal" &&
              isLast &&
              !isFirst &&
              "rounded-l-none",
            orientation === "vertical" &&
              isFirst &&
              !isLast &&
              "rounded-b-none",
            orientation === "vertical" &&
              isLast &&
              !isFirst &&
              "rounded-t-none",
            // Add negative margin to overlap borders
            orientation === "horizontal" && !isFirst && "-ml-px",
            orientation === "vertical" && !isFirst && "-mt-px",
            // Ensure proper z-index on hover/focus
            "focus:z-10 hover:z-10",
          );

          return cloneElement(child as ReactElement<ButtonProps>, {
            size: size ?? (child.props as ButtonProps).size,
            variant: variant ?? (child.props as ButtonProps).variant,
            className: cn(
              buttonClassNames,
              (child.props as ButtonProps).className,
            ),
          });
        })}
      </fieldset>
    );
  },
);

ButtonGroup.displayName = "ButtonGroup";

export { ButtonGroup };
