import { Eye, EyeOff, Lock } from "lucide-react";
import { forwardRef, type InputHTMLAttributes, useState } from "react";
import { cn } from "../../lib/utils";
import { Input } from "./input";

export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  showIcon?: boolean;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showIcon = true, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative">
        {showIcon && (
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <Input
          ref={ref}
          type={showPassword ? "text" : "password"}
          className={cn(showIcon ? "px-9" : "pr-9", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
