import { forwardRef, useCallback, useMemo, useRef } from "react";
import { cn } from "../../lib/utils";
import { Input } from "./input";

export interface OTPInputProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  length?: number;
  disabled?: boolean;
  className?: string;
  autoFocus?: boolean;
}

const OTPInput = forwardRef<HTMLDivElement, OTPInputProps>(
  (
    {
      value,
      onValueChange,
      length = 6,
      disabled = false,
      className,
      autoFocus = false,
    },
    ref,
  ) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Ensure value array has correct length
    const normalizedValue = useMemo(() => {
      const result = [...value];
      while (result.length < length) {
        result.push("");
      }
      return result;
    }, [value, length]);

    const handleChange = useCallback(
      (index: number, inputValue: string) => {
        // Only accept single digit
        const digit = inputValue.slice(-1);
        if (digit && !/^\d$/.test(digit)) return;

        const newValue = [...normalizedValue];
        newValue[index] = digit;
        onValueChange(newValue);

        // Auto-focus next input
        if (digit && index < length - 1) {
          inputRefs.current[index + 1]?.focus();
        }
      },
      [normalizedValue, length, onValueChange],
    );

    const handleKeyDown = useCallback(
      (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
          if (!normalizedValue[index] && index > 0) {
            // Move to previous input if current is empty
            inputRefs.current[index - 1]?.focus();
          }
        } else if (e.key === "ArrowLeft" && index > 0) {
          inputRefs.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < length - 1) {
          inputRefs.current[index + 1]?.focus();
        }
      },
      [normalizedValue, length],
    );

    const handlePaste = useCallback(
      (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
        if (!pastedData) return;

        const newValue = [...normalizedValue];
        for (let i = 0; i < Math.min(pastedData.length, length); i++) {
          newValue[i] = pastedData[i] ?? "";
        }
        onValueChange(newValue);

        // Focus the next empty input or the last one
        const nextEmptyIndex = newValue.findIndex((v) => !v);
        const focusIndex =
          nextEmptyIndex === -1
            ? length - 1
            : Math.min(nextEmptyIndex, length - 1);
        inputRefs.current[focusIndex]?.focus();
      },
      [normalizedValue, length, onValueChange],
    );

    return (
      <div ref={ref} className={cn("flex justify-center gap-2", className)}>
        {Array.from({ length }, (_, index) => (
          <Input
            key={`otp-digit-${index}`}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={normalizedValue[index] ?? ""}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            autoFocus={autoFocus && index === 0}
            className="h-12 w-12 text-center text-lg font-semibold"
            aria-label={`Digit ${index + 1}`}
          />
        ))}
      </div>
    );
  },
);

OTPInput.displayName = "OTPInput";

export { OTPInput };
