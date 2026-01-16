import { Loader2, Search, X } from "lucide-react";
import {
  forwardRef,
  type InputHTMLAttributes,
  useCallback,
  useState,
} from "react";
import { cn } from "../../lib/utils";
import { Input } from "./input";

export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  onValueChange?: (value: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  loading?: boolean;
  showClearButton?: boolean;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      value: controlledValue,
      defaultValue,
      onValueChange,
      onChange,
      onClear,
      loading = false,
      showClearButton = true,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue ?? "");
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (!isControlled) {
          setInternalValue(newValue);
        }
        onChange?.(e);
        onValueChange?.(newValue);
      },
      [isControlled, onChange, onValueChange],
    );

    const handleClear = useCallback(() => {
      if (!isControlled) {
        setInternalValue("");
      }
      onClear?.();
      onValueChange?.("");
    }, [isControlled, onClear, onValueChange]);

    const showClear = showClearButton && value && !loading;

    return (
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={ref}
          type="search"
          value={value}
          onChange={handleChange}
          className={cn("pl-9 pr-9", className)}
          {...props}
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
        {showClear && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            tabIndex={-1}
            aria-label="Clear search"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
