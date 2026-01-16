import type { Meta, StoryObj } from "@storybook/react";
import {
  AlertCircle,
  AtSign,
  Calendar,
  Check,
  ChevronDown,
  CreditCard,
  DollarSign,
  Eye,
  EyeOff,
  Globe,
  Hash,
  Link,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Minus,
  Phone,
  Plus,
  Search,
  Send,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Input>;

// =============================================================================
// Basic Examples
// =============================================================================

export const Default: Story = {
  render: () => <Input placeholder="Enter text..." className="w-72" />,
};

export const WithValue: Story = {
  name: "With Value",
  render: () => (
    <Input defaultValue="Hello World" className="w-72" />
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="w-72 space-y-3">
      <Input placeholder="Disabled empty" disabled />
      <Input defaultValue="Disabled with value" disabled />
    </div>
  ),
};

export const ReadOnly: Story = {
  name: "Read Only",
  render: () => (
    <Input defaultValue="Read only value" readOnly className="w-72" />
  ),
};

// =============================================================================
// Input Types
// =============================================================================

export const InputTypes: Story = {
  name: "Input Types",
  render: () => (
    <div className="w-72 space-y-3">
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Text</label>
        <Input type="text" placeholder="Enter text" />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Email</label>
        <Input type="email" placeholder="email@example.com" />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Password</label>
        <Input type="password" placeholder="••••••••" />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Number</label>
        <Input type="number" placeholder="0" />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Tel</label>
        <Input type="tel" placeholder="+1 (555) 000-0000" />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">URL</label>
        <Input type="url" placeholder="https://example.com" />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Date</label>
        <Input type="date" />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Time</label>
        <Input type="time" />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Color</label>
        <Input type="color" className="h-10 w-20 p-1" />
      </div>
    </div>
  ),
};

// =============================================================================
// With Icons
// =============================================================================

export const WithIconLeft: Story = {
  name: "With Icon (Left)",
  render: () => (
    <div className="w-72 space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search..." className="pl-9" />
      </div>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input type="email" placeholder="Email" className="pl-9" />
      </div>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input type="password" placeholder="Password" className="pl-9" />
      </div>
      <div className="relative">
        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Username" className="pl-9" />
      </div>
    </div>
  ),
};

export const WithIconRight: Story = {
  name: "With Icon (Right)",
  render: () => (
    <div className="w-72 space-y-3">
      <div className="relative">
        <Input placeholder="Select date" className="pr-9" />
        <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
      <div className="relative">
        <Input placeholder="Select option" className="pr-9" />
        <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>
  ),
};

export const WithIconBoth: Story = {
  name: "With Icons (Both Sides)",
  render: () => (
    <div className="w-72 space-y-3">
      <div className="relative">
        <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Website URL" className="px-9" />
        <Link className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
      <div className="relative">
        <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input type="number" placeholder="0.00" className="px-9" />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          USD
        </span>
      </div>
    </div>
  ),
};

// =============================================================================
// Password Input
// =============================================================================

export const PasswordToggle: Story = {
  name: "Password with Toggle",
  render: function PasswordExample() {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="w-72 space-y-3">
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            className="px-9"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Click the eye icon to {showPassword ? "hide" : "show"} password
        </p>
      </div>
    );
  },
};

// =============================================================================
// Search Input
// =============================================================================

export const SearchInput: Story = {
  name: "Search Input",
  render: function SearchExample() {
    const [value, setValue] = useState("");

    return (
      <div className="w-72">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="pl-9 pr-9"
          />
          {value && (
            <button
              type="button"
              onClick={() => setValue("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  },
};

export const SearchWithButton: Story = {
  name: "Search with Button",
  render: () => (
    <div className="flex w-80">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search..."
          className="rounded-r-none pl-9"
        />
      </div>
      <Button className="rounded-l-none">Search</Button>
    </div>
  ),
};

// =============================================================================
// Clearable Input
// =============================================================================

export const ClearableInput: Story = {
  name: "Clearable Input",
  render: function ClearableExample() {
    const [value, setValue] = useState("Some text to clear");

    return (
      <div className="w-72">
        <div className="relative">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="pr-9"
          />
          {value && (
            <button
              type="button"
              onClick={() => setValue("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    );
  },
};

// =============================================================================
// Number Input with Stepper
// =============================================================================

export const NumberStepper: Story = {
  name: "Number with Stepper",
  render: function NumberExample() {
    const [value, setValue] = useState(1);

    return (
      <div className="flex w-32">
        <Button
          variant="outline"
          size="icon"
          className="rounded-r-none"
          onClick={() => setValue(Math.max(0, value - 1))}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="rounded-none text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <Button
          variant="outline"
          size="icon"
          className="rounded-l-none"
          onClick={() => setValue(value + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    );
  },
};

export const QuantitySelector: Story = {
  name: "Quantity Selector",
  render: function QuantityExample() {
    const [quantity, setQuantity] = useState(1);

    return (
      <div className="w-72 space-y-2">
        <label className="text-sm font-medium">Quantity</label>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="h-8 w-16 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            min={1}
          />
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  },
};

// =============================================================================
// Validation States
// =============================================================================

export const ValidationStates: Story = {
  name: "Validation States",
  render: () => (
    <div className="w-72 space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium">Default</label>
        <Input placeholder="Enter value" />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Success</label>
        <div className="relative">
          <Input
            defaultValue="valid@email.com"
            className="border-green-500 pr-9 focus-visible:ring-green-500"
          />
          <Check className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
        </div>
        <p className="text-xs text-green-600">Email is valid</p>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Error</label>
        <div className="relative">
          <Input
            defaultValue="invalid-email"
            className="border-destructive pr-9 focus-visible:ring-destructive"
          />
          <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-destructive" />
        </div>
        <p className="text-xs text-destructive">Please enter a valid email</p>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Warning</label>
        <div className="relative">
          <Input
            defaultValue="weak_password"
            className="border-yellow-500 pr-9 focus-visible:ring-yellow-500"
          />
          <AlertCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-yellow-500" />
        </div>
        <p className="text-xs text-yellow-600">Password is weak</p>
      </div>
    </div>
  ),
};

// =============================================================================
// With Label and Description
// =============================================================================

export const WithLabel: Story = {
  name: "With Label",
  render: () => (
    <div className="w-72 space-y-2">
      <label htmlFor="email" className="text-sm font-medium">
        Email
      </label>
      <Input id="email" type="email" placeholder="Enter your email" />
    </div>
  ),
};

export const WithLabelAndDescription: Story = {
  name: "With Label and Description",
  render: () => (
    <div className="w-72 space-y-2">
      <label htmlFor="username" className="text-sm font-medium">
        Username
      </label>
      <Input id="username" placeholder="johndoe" />
      <p className="text-xs text-muted-foreground">
        This will be your public display name.
      </p>
    </div>
  ),
};

export const RequiredField: Story = {
  name: "Required Field",
  render: () => (
    <div className="w-72 space-y-2">
      <label htmlFor="name" className="text-sm font-medium">
        Full Name <span className="text-destructive">*</span>
      </label>
      <Input id="name" placeholder="John Doe" required />
    </div>
  ),
};

export const OptionalField: Story = {
  name: "Optional Field",
  render: () => (
    <div className="w-72 space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor="nickname" className="text-sm font-medium">
          Nickname
        </label>
        <span className="text-xs text-muted-foreground">Optional</span>
      </div>
      <Input id="nickname" placeholder="Johnny" />
    </div>
  ),
};

// =============================================================================
// Input Groups
// =============================================================================

export const InputWithPrefix: Story = {
  name: "With Prefix",
  render: () => (
    <div className="w-72 space-y-3">
      <div className="flex">
        <span className="inline-flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">
          https://
        </span>
        <Input placeholder="example.com" className="rounded-l-none" />
      </div>

      <div className="flex">
        <span className="inline-flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">
          @
        </span>
        <Input placeholder="username" className="rounded-l-none" />
      </div>

      <div className="flex">
        <span className="inline-flex items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">
          $
        </span>
        <Input type="number" placeholder="0.00" className="rounded-l-none" />
      </div>
    </div>
  ),
};

export const InputWithSuffix: Story = {
  name: "With Suffix",
  render: () => (
    <div className="w-72 space-y-3">
      <div className="flex">
        <Input placeholder="Weight" className="rounded-r-none" />
        <span className="inline-flex items-center rounded-r-md border border-l-0 bg-muted px-3 text-sm text-muted-foreground">
          kg
        </span>
      </div>

      <div className="flex">
        <Input type="number" placeholder="0" className="rounded-r-none" />
        <span className="inline-flex items-center rounded-r-md border border-l-0 bg-muted px-3 text-sm text-muted-foreground">
          %
        </span>
      </div>

      <div className="flex">
        <Input placeholder="Duration" className="rounded-r-none" />
        <span className="inline-flex items-center rounded-r-md border border-l-0 bg-muted px-3 text-sm text-muted-foreground">
          minutes
        </span>
      </div>
    </div>
  ),
};

export const InputWithButton: Story = {
  name: "With Button",
  render: () => (
    <div className="w-80 space-y-3">
      <div className="flex">
        <Input placeholder="Enter your email" className="rounded-r-none" />
        <Button className="rounded-l-none">Subscribe</Button>
      </div>

      <div className="flex">
        <Input placeholder="Enter code" className="rounded-r-none" />
        <Button variant="secondary" className="rounded-l-none">
          Apply
        </Button>
      </div>

      <div className="flex">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Email" className="rounded-r-none pl-9" />
        </div>
        <Button className="rounded-l-none">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  ),
};

// =============================================================================
// Sizes
// =============================================================================

export const Sizes: Story = {
  render: () => (
    <div className="w-72 space-y-3">
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Small</label>
        <Input placeholder="Small input" className="h-8 text-sm" />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Default</label>
        <Input placeholder="Default input" />
      </div>
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Large</label>
        <Input placeholder="Large input" className="h-12 text-lg" />
      </div>
    </div>
  ),
};

// =============================================================================
// File Input
// =============================================================================

export const FileInput: Story = {
  name: "File Input",
  render: () => (
    <div className="w-72 space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Default File Input</label>
        <Input type="file" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Accept Images Only</label>
        <Input type="file" accept="image/*" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Multiple Files</label>
        <Input type="file" multiple />
      </div>
    </div>
  ),
};

// =============================================================================
// Loading State
// =============================================================================

export const LoadingState: Story = {
  name: "Loading State",
  render: () => (
    <div className="w-72 space-y-3">
      <div className="relative">
        <Input placeholder="Checking availability..." disabled className="pr-9" />
        <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Searching..." disabled className="px-9" />
        <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
      </div>
    </div>
  ),
};

// =============================================================================
// Character Count
// =============================================================================

export const CharacterCount: Story = {
  name: "Character Count",
  render: function CharCountExample() {
    const [value, setValue] = useState("");
    const maxLength = 100;

    return (
      <div className="w-72 space-y-1">
        <label className="text-sm font-medium">Bio</label>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Tell us about yourself"
          maxLength={maxLength}
        />
        <div className="flex justify-end">
          <span
            className={`text-xs ${
              value.length > maxLength * 0.9
                ? "text-destructive"
                : "text-muted-foreground"
            }`}
          >
            {value.length}/{maxLength}
          </span>
        </div>
      </div>
    );
  },
};

// =============================================================================
// Form Examples
// =============================================================================

export const LoginForm: Story = {
  name: "Login Form",
  render: () => (
    <form className="w-80 space-y-4 rounded-lg border p-6">
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-semibold">Welcome back</h2>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to sign in
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="login-email" className="text-sm font-medium">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="login-email"
              type="email"
              placeholder="name@example.com"
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="login-password" className="text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="login-password"
              type="password"
              placeholder="••••••••"
              className="pl-9"
            />
          </div>
        </div>

        <Button className="w-full">Sign In</Button>
      </div>
    </form>
  ),
};

export const ContactForm: Story = {
  name: "Contact Form",
  render: () => (
    <form className="w-80 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="first-name" className="text-sm font-medium">
            First name
          </label>
          <Input id="first-name" placeholder="John" />
        </div>
        <div className="space-y-2">
          <label htmlFor="last-name" className="text-sm font-medium">
            Last name
          </label>
          <Input id="last-name" placeholder="Doe" />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-email" className="text-sm font-medium">
          Email
        </label>
        <div className="relative">
          <AtSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="contact-email"
            type="email"
            placeholder="john@example.com"
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium">
          Phone
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            className="pl-9"
          />
        </div>
      </div>

      <Button className="w-full">Submit</Button>
    </form>
  ),
};

export const PaymentForm: Story = {
  name: "Payment Form",
  render: () => (
    <form className="w-80 space-y-4 rounded-lg border p-6">
      <h3 className="font-semibold">Payment Details</h3>

      <div className="space-y-2">
        <label htmlFor="card-number" className="text-sm font-medium">
          Card Number
        </label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="card-number"
            placeholder="1234 5678 9012 3456"
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="expiry" className="text-sm font-medium">
            Expiry
          </label>
          <Input id="expiry" placeholder="MM/YY" />
        </div>
        <div className="space-y-2">
          <label htmlFor="cvc" className="text-sm font-medium">
            CVC
          </label>
          <div className="relative">
            <Input id="cvc" placeholder="123" className="pr-9" />
            <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="name-on-card" className="text-sm font-medium">
          Name on Card
        </label>
        <Input id="name-on-card" placeholder="John Doe" />
      </div>

      <Button className="w-full">Pay $99.00</Button>
    </form>
  ),
};

export const AddressForm: Story = {
  name: "Address Form",
  render: () => (
    <form className="w-80 space-y-4">
      <div className="space-y-2">
        <label htmlFor="street" className="text-sm font-medium">
          Street Address
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input id="street" placeholder="123 Main St" className="pl-9" />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="apt" className="text-sm font-medium">
          Apt, Suite, etc. <span className="text-muted-foreground">(optional)</span>
        </label>
        <Input id="apt" placeholder="Apt 4B" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="city" className="text-sm font-medium">
            City
          </label>
          <Input id="city" placeholder="New York" />
        </div>
        <div className="space-y-2">
          <label htmlFor="state" className="text-sm font-medium">
            State
          </label>
          <Input id="state" placeholder="NY" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="zip" className="text-sm font-medium">
            ZIP Code
          </label>
          <Input id="zip" placeholder="10001" />
        </div>
        <div className="space-y-2">
          <label htmlFor="country" className="text-sm font-medium">
            Country
          </label>
          <Input id="country" placeholder="USA" />
        </div>
      </div>
    </form>
  ),
};

// =============================================================================
// Tags Input
// =============================================================================

export const TagsInput: Story = {
  name: "Tags Input",
  render: function TagsExample() {
    const [tags, setTags] = useState(["React", "TypeScript"]);
    const [inputValue, setInputValue] = useState("");

    const addTag = () => {
      if (inputValue.trim() && !tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
        setInputValue("");
      }
    };

    const removeTag = (tagToRemove: string) => {
      setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    return (
      <div className="w-80 space-y-2">
        <label className="text-sm font-medium">Tags</label>
        <div className="flex flex-wrap gap-2 rounded-md border p-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 rounded-full hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Add tag..."
            className="h-6 min-w-[100px] flex-1 border-0 p-0 text-sm focus-visible:ring-0"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Press Enter to add a tag
        </p>
      </div>
    );
  },
};

// =============================================================================
// OTP Input
// =============================================================================

export const OTPInput: Story = {
  name: "OTP Input",
  render: function OTPExample() {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);

    const handleChange = (index: number, value: string) => {
      if (value.length > 1) return;
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    };

    return (
      <div className="space-y-4">
        <div className="space-y-2 text-center">
          <h3 className="font-semibold">Enter verification code</h3>
          <p className="text-sm text-muted-foreground">
            We sent a code to your email
          </p>
        </div>
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <Input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              className="h-12 w-12 text-center text-lg font-semibold"
            />
          ))}
        </div>
        <Button className="w-full">Verify</Button>
      </div>
    );
  },
};
