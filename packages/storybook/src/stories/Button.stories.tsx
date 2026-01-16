import type { Meta, StoryObj } from "@storybook/react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  Download,
  ExternalLink,
  Github,
  Heart,
  Loader2,
  LogIn,
  LogOut,
  Mail,
  MessageSquare,
  Moon,
  MoreHorizontal,
  Pencil,
  Play,
  Plus,
  Save,
  Search,
  Send,
  Settings,
  Share2,
  ShoppingCart,
  Sun,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
    disabled: {
      control: "boolean",
    },
    asChild: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================
// Basic Variants
// ============================================

export const Default: Story = {
  args: {
    children: "Button",
    variant: "default",
  },
};

export const Destructive: Story = {
  args: {
    children: "Delete",
    variant: "destructive",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline",
    variant: "outline",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
};

export const Ghost: Story = {
  args: {
    children: "Ghost",
    variant: "ghost",
  },
};

export const Link: Story = {
  args: {
    children: "Link",
    variant: "link",
  },
};

// ============================================
// Sizes
// ============================================

export const Small: Story = {
  args: {
    children: "Small",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    children: "Large",
    size: "lg",
  },
};

export const IconSize: Story = {
  name: "Icon Size",
  render: () => (
    <Button size="icon" variant="outline">
      <Settings className="h-4 w-4" />
    </Button>
  ),
};

// ============================================
// States
// ============================================

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
};

export const Loading: Story = {
  render: () => (
    <Button disabled>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Please wait
    </Button>
  ),
};

export const LoadingVariants: Story = {
  name: "Loading States",
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
      <Button variant="secondary" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Saving...
      </Button>
      <Button variant="outline" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Processing...
      </Button>
      <Button variant="destructive" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Deleting...
      </Button>
    </div>
  ),
};

// ============================================
// With Icons
// ============================================

export const WithIconLeft: Story = {
  name: "With Icon (Left)",
  render: () => (
    <Button>
      <Mail className="mr-2 h-4 w-4" />
      Login with Email
    </Button>
  ),
};

export const WithIconRight: Story = {
  name: "With Icon (Right)",
  render: () => (
    <Button>
      Next
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  ),
};

export const IconButtons: Story = {
  name: "Icon Only Buttons",
  render: () => (
    <div className="flex items-center gap-2">
      <Button size="icon" variant="default">
        <Plus className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="secondary">
        <Pencil className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="outline">
        <Settings className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="ghost">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="destructive">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  ),
};

export const IconButtonSizes: Story = {
  name: "Icon Button Sizes",
  render: () => (
    <div className="flex items-center gap-2">
      <Button size="sm" className="h-8 w-8 p-0">
        <Plus className="h-3 w-3" />
      </Button>
      <Button size="icon">
        <Plus className="h-4 w-4" />
      </Button>
      <Button size="lg" className="h-12 w-12 p-0">
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  ),
};

// ============================================
// Button Groups
// ============================================

export const ButtonGroup: Story = {
  name: "Button Group",
  render: () => (
    <div className="flex">
      <Button variant="outline" className="rounded-r-none border-r-0">
        <Check className="mr-2 h-4 w-4" />
        Approve
      </Button>
      <Button variant="outline" className="rounded-none border-r-0">
        <Pencil className="mr-2 h-4 w-4" />
        Edit
      </Button>
      <Button variant="outline" className="rounded-l-none">
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>
    </div>
  ),
};

export const SplitButton: Story = {
  name: "Split Button",
  render: () => (
    <div className="flex">
      <Button className="rounded-r-none">
        <Save className="mr-2 h-4 w-4" />
        Save
      </Button>
      <Button className="rounded-l-none border-l border-primary-foreground/20 px-2">
        <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  ),
};

export const ToggleGroup: Story = {
  name: "Toggle Group",
  render: function ToggleGroupExample() {
    const [selected, setSelected] = useState<"left" | "center" | "right">(
      "left",
    );
    return (
      <div className="flex">
        <Button
          variant={selected === "left" ? "default" : "outline"}
          className="rounded-r-none"
          onClick={() => setSelected("left")}
        >
          Left
        </Button>
        <Button
          variant={selected === "center" ? "default" : "outline"}
          className="rounded-none border-x-0"
          onClick={() => setSelected("center")}
        >
          Center
        </Button>
        <Button
          variant={selected === "right" ? "default" : "outline"}
          className="rounded-l-none"
          onClick={() => setSelected("right")}
        >
          Right
        </Button>
      </div>
    );
  },
};

// ============================================
// Interactive Examples
// ============================================

export const ClickCounter: Story = {
  name: "Click Counter",
  render: function ClickCounterExample() {
    const [count, setCount] = useState(0);
    return (
      <div className="flex items-center gap-4">
        <Button onClick={() => setCount(count + 1)}>
          Clicked {count} times
        </Button>
        <Button variant="outline" onClick={() => setCount(0)}>
          Reset
        </Button>
      </div>
    );
  },
};

export const ToggleButton: Story = {
  name: "Toggle Button",
  render: function ToggleExample() {
    const [liked, setLiked] = useState(false);
    return (
      <Button
        variant={liked ? "default" : "outline"}
        onClick={() => setLiked(!liked)}
      >
        <Heart className={`mr-2 h-4 w-4 ${liked ? "fill-current" : ""}`} />
        {liked ? "Liked" : "Like"}
      </Button>
    );
  },
};

export const CopyButton: Story = {
  name: "Copy Button",
  render: function CopyExample() {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    return (
      <Button variant="outline" onClick={handleCopy}>
        {copied ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="mr-2 h-4 w-4" />
            Copy to clipboard
          </>
        )}
      </Button>
    );
  },
};

export const AsyncButton: Story = {
  name: "Async Action",
  render: function AsyncExample() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleClick = () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      }, 1500);
    };

    return (
      <Button onClick={handleClick} disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : success ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Success!
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Submit
          </>
        )}
      </Button>
    );
  },
};

export const ThemeToggle: Story = {
  name: "Theme Toggle",
  render: function ThemeToggleExample() {
    const [dark, setDark] = useState(false);
    return (
      <Button variant="outline" size="icon" onClick={() => setDark(!dark)}>
        {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
    );
  },
};

// ============================================
// With Badge / Counter
// ============================================

export const WithBadge: Story = {
  name: "With Badge",
  render: () => (
    <div className="flex gap-4">
      <Button variant="outline" className="relative">
        <MessageSquare className="mr-2 h-4 w-4" />
        Messages
        <Badge className="ml-2 h-5 px-1.5" variant="secondary">
          12
        </Badge>
      </Button>
      <Button variant="outline" className="relative">
        <ShoppingCart className="h-4 w-4" />
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
          3
        </span>
      </Button>
    </div>
  ),
};

// ============================================
// Social / Brand Buttons
// ============================================

export const SocialButtons: Story = {
  name: "Social Buttons",
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      <Button className="bg-[#24292e] hover:bg-[#24292e]/90">
        <Github className="mr-2 h-4 w-4" />
        Continue with GitHub
      </Button>
      <Button className="bg-[#4285f4] hover:bg-[#4285f4]/90">
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </Button>
      <Button variant="outline">
        <Mail className="mr-2 h-4 w-4" />
        Continue with Email
      </Button>
    </div>
  ),
};

// ============================================
// Call-to-Action Examples
// ============================================

export const CallToAction: Story = {
  name: "Call-to-Action",
  render: () => (
    <div className="flex flex-col items-center gap-4">
      <Button size="lg" className="text-base px-8">
        Get Started Free
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
      <Button variant="link" size="lg">
        Learn more
        <ExternalLink className="ml-2 h-4 w-4" />
      </Button>
    </div>
  ),
};

export const HeroButtons: Story = {
  name: "Hero Section",
  render: () => (
    <div className="flex flex-col sm:flex-row gap-4">
      <Button size="lg" className="px-8">
        <Play className="mr-2 h-5 w-5" />
        Watch Demo
      </Button>
      <Button size="lg" variant="outline" className="px-8">
        <Download className="mr-2 h-5 w-5" />
        Download App
      </Button>
    </div>
  ),
};

// ============================================
// Form Actions
// ============================================

export const FormActions: Story = {
  name: "Form Actions",
  render: () => (
    <div className="flex justify-end gap-3 w-96 border-t pt-4">
      <Button variant="ghost">Cancel</Button>
      <Button variant="outline">Save as Draft</Button>
      <Button>
        <Save className="mr-2 h-4 w-4" />
        Save Changes
      </Button>
    </div>
  ),
};

export const DestructiveActions: Story = {
  name: "Destructive Actions",
  render: () => (
    <div className="flex justify-between w-96 p-4 border rounded-lg">
      <div>
        <p className="font-medium">Delete Account</p>
        <p className="text-sm text-muted-foreground">
          This action cannot be undone.
        </p>
      </div>
      <Button variant="destructive">
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>
    </div>
  ),
};

// ============================================
// Authentication
// ============================================

export const AuthButtons: Story = {
  name: "Authentication",
  render: () => (
    <div className="flex gap-3">
      <Button variant="outline">
        <LogIn className="mr-2 h-4 w-4" />
        Sign In
      </Button>
      <Button>
        Sign Up
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  ),
};

export const UserMenu: Story = {
  name: "User Menu Button",
  render: () => (
    <div className="flex items-center gap-2">
      <Button variant="ghost" className="gap-2">
        <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground">
          JD
        </div>
        <span>John Doe</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </Button>
      <Button variant="ghost" size="icon">
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  ),
};

// ============================================
// File Operations
// ============================================

export const FileButtons: Story = {
  name: "File Operations",
  render: () => (
    <div className="flex gap-2">
      <Button variant="outline">
        <Upload className="mr-2 h-4 w-4" />
        Upload
      </Button>
      <Button variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Download
      </Button>
      <Button variant="outline">
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>
    </div>
  ),
};

// ============================================
// Toolbar
// ============================================

export const Toolbar: Story = {
  render: () => (
    <div className="flex items-center gap-1 rounded-lg border p-1">
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Plus className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Pencil className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Copy className="h-4 w-4" />
      </Button>
      <div className="w-px h-6 bg-border mx-1" />
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Search className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Settings className="h-4 w-4" />
      </Button>
      <div className="w-px h-6 bg-border mx-1" />
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  ),
};

// ============================================
// Close Button
// ============================================

export const CloseButton: Story = {
  name: "Close Button",
  render: () => (
    <div className="flex gap-4">
      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
        <X className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
        <X className="h-4 w-4" />
      </Button>
      <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full">
        <X className="h-4 w-4" />
      </Button>
    </div>
  ),
};

// ============================================
// Overview
// ============================================

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  ),
};

export const VariantMatrix: Story = {
  name: "Variant × Size Matrix",
  render: () => (
    <div className="space-y-6">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 text-left text-sm font-medium">Variant</th>
            <th className="p-2 text-center text-sm font-medium">Small</th>
            <th className="p-2 text-center text-sm font-medium">Default</th>
            <th className="p-2 text-center text-sm font-medium">Large</th>
            <th className="p-2 text-center text-sm font-medium">Icon</th>
          </tr>
        </thead>
        <tbody>
          {(
            [
              "default",
              "destructive",
              "outline",
              "secondary",
              "ghost",
              "link",
            ] as const
          ).map((variant) => (
            <tr key={variant} className="border-t">
              <td className="p-2 text-sm capitalize">{variant}</td>
              <td className="p-2 text-center">
                <Button variant={variant} size="sm">
                  Button
                </Button>
              </td>
              <td className="p-2 text-center">
                <Button variant={variant} size="default">
                  Button
                </Button>
              </td>
              <td className="p-2 text-center">
                <Button variant={variant} size="lg">
                  Button
                </Button>
              </td>
              <td className="p-2 text-center">
                <Button variant={variant} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};
