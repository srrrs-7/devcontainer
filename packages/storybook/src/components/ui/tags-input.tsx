import { X } from "lucide-react";
import { forwardRef, useCallback, useId, useState } from "react";
import { cn } from "../../lib/utils";
import { Badge } from "./badge";
import { Input } from "./input";

export interface TagsInputProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  allowDuplicates?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  description?: string;
}

const TagsInput = forwardRef<HTMLInputElement, TagsInputProps>(
  (
    {
      value,
      onValueChange,
      placeholder = "Add tag...",
      maxTags,
      allowDuplicates = false,
      disabled = false,
      className,
      label,
      description,
    },
    ref,
  ) => {
    const inputId = useId();
    const [inputValue, setInputValue] = useState("");

    const addTag = useCallback(() => {
      const trimmedValue = inputValue.trim();
      if (!trimmedValue) return;
      if (!allowDuplicates && value.includes(trimmedValue)) return;
      if (maxTags && value.length >= maxTags) return;

      onValueChange([...value, trimmedValue]);
      setInputValue("");
    }, [inputValue, value, allowDuplicates, maxTags, onValueChange]);

    const removeTag = useCallback(
      (tagToRemove: string) => {
        onValueChange(value.filter((tag) => tag !== tagToRemove));
      },
      [value, onValueChange],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addTag();
        } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
          const lastTag = value[value.length - 1];
          if (lastTag) {
            removeTag(lastTag);
          }
        }
      },
      [inputValue, value, addTag, removeTag],
    );

    const isAtMaxTags = maxTags !== undefined && value.length >= maxTags;

    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium">
            {label}
          </label>
        )}
        <div
          className={cn(
            "flex flex-wrap gap-2 rounded-md border p-2",
            disabled && "cursor-not-allowed opacity-50",
          )}
        >
          {value.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 rounded-full hover:bg-muted"
                  aria-label={`Remove ${tag}`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
          <Input
            ref={ref}
            id={inputId}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isAtMaxTags ? `Max ${maxTags} tags` : placeholder}
            disabled={disabled || isAtMaxTags}
            className="h-6 min-w-[100px] flex-1 border-0 p-0 text-sm focus-visible:ring-0"
          />
        </div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    );
  },
);

TagsInput.displayName = "TagsInput";

export { TagsInput };
