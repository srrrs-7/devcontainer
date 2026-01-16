import { Loader2 } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "../../lib/utils";
import { Button, type ButtonProps } from "./button";

export interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
}

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    { children, loading = false, loadingText, disabled, className, ...props },
    ref,
  ) => {
    return (
      <Button
        ref={ref}
        disabled={disabled || loading}
        className={cn(className)}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading && loadingText ? loadingText : children}
      </Button>
    );
  },
);

LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
