import type { Meta, StoryObj } from "@storybook/react";
import {
  AlertCircle,
  AtSign,
  Calendar,
  Check,
  ChevronDown,
  CreditCard,
  DollarSign,
  Globe,
  Link,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Search,
  User,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { NumberStepper } from "../components/ui/number-stepper";
import { OTPInput } from "../components/ui/otp-input";
import { PasswordInput } from "../components/ui/password-input";
import { SearchInput } from "../components/ui/search-input";
import { TagsInput } from "../components/ui/tags-input";

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
  render: () => <Input defaultValue="Hello World" className="w-72" />,
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
        <Input type="password" placeholder="********" />
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
// Specialized Input Components
// =============================================================================

export const PasswordInputExample: Story = {
  name: "Password Input",
  render: () => (
    <div className="w-72 space-y-4">
      <p className="text-sm text-muted-foreground">
        See PasswordInput component for more examples
      </p>
      <PasswordInput placeholder="Enter password" />
    </div>
  ),
};

export const SearchInputExample: Story = {
  name: "Search Input",
  render: function SearchExample() {
    const [value, setValue] = useState("");
    return (
      <div className="w-72 space-y-4">
        <p className="text-sm text-muted-foreground">
          See SearchInput component for more examples
        </p>
        <SearchInput
          value={value}
          onValueChange={setValue}
          placeholder="Search..."
        />
      </div>
    );
  },
};

export const NumberStepperExample: Story = {
  name: "Number Stepper",
  render: function NumberExample() {
    const [value, setValue] = useState(1);
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          See NumberStepper component for more examples
        </p>
        <NumberStepper value={value} onValueChange={setValue} min={0} />
      </div>
    );
  },
};

export const TagsInputExample: Story = {
  name: "Tags Input",
  render: function TagsExample() {
    const [tags, setTags] = useState(["React", "TypeScript"]);
    return (
      <div className="w-80 space-y-4">
        <p className="text-sm text-muted-foreground">
          See TagsInput component for more examples
        </p>
        <TagsInput
          value={tags}
          onValueChange={setTags}
          label="Tags"
          description="Press Enter to add a tag"
        />
      </div>
    );
  },
};

export const OTPInputExample: Story = {
  name: "OTP Input",
  render: function OTPExample() {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-muted-foreground">
          See OTPInput component for more examples
        </p>
        <OTPInput value={otp} onValueChange={setOtp} />
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
        <Input
          placeholder="Checking availability..."
          disabled
          className="pr-9"
        />
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
          <PasswordInput id="login-password" placeholder="Enter password" />
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
          Apt, Suite, etc.{" "}
          <span className="text-muted-foreground">(optional)</span>
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
