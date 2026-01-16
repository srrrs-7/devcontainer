import { Minus, Plus } from "lucide-react";
import { forwardRef, type InputHTMLAttributes, useCallback } from "react";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { Input } from "./input";

export interface NumberStepperProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "onChange" | "size"
  > {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: "sm" | "default" | "lg";
  label?: string;
}

const NumberStepper = forwardRef<HTMLInputElement, NumberStepperProps>(
  (
    {
      className,
      value,
      onValueChange,
      min = 0,
      max = Number.POSITIVE_INFINITY,
      step = 1,
      size = "default",
      label,
      disabled,
      ...props
    },
    ref,
  ) => {
    const handleDecrement = useCallback(() => {
      const newValue = Math.max(min, value - step);
      onValueChange(newValue);
    }, [value, min, step, onValueChange]);

    const handleIncrement = useCallback(() => {
      const newValue = Math.min(max, value + step);
      onValueChange(newValue);
    }, [value, max, step, onValueChange]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);
        if (!Number.isNaN(newValue)) {
          onValueChange(Math.min(max, Math.max(min, newValue)));
        }
      },
      [min, max, onValueChange],
    );

    const sizeClasses = {
      sm: {
        button: "h-8 w-8",
        input: "h-8 w-12 text-sm",
      },
      default: {
        button: "h-10 w-10",
        input: "h-10 w-14",
      },
      lg: {
        button: "h-12 w-12",
        input: "h-12 w-16 text-lg",
      },
    };

    const { button: buttonClass, input: inputClass } = sizeClasses[size];

    return (
      <div className={cn("space-y-2", className)}>
        {label && <label className="text-sm font-medium">{label}</label>}
        <div className="flex items-center">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn("rounded-r-none", buttonClass)}
            onClick={handleDecrement}
            disabled={disabled || value <= min}
            aria-label="Decrease value"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            ref={ref}
            type="number"
            value={value}
            onChange={handleChange}
            disabled={disabled}
            className={cn(
              "rounded-none text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
              inputClass,
            )}
            min={min}
            max={max}
            step={step}
            {...props}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn("rounded-l-none", buttonClass)}
            onClick={handleIncrement}
            disabled={disabled || value >= max}
            aria-label="Increase value"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  },
);

NumberStepper.displayName = "NumberStepper";

export { NumberStepper };
