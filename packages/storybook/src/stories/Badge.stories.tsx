import type { Meta, StoryObj } from "@storybook/react";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  Bookmark,
  Calendar,
  Check,
  CheckCircle,
  Circle,
  Clock,
  Code,
  Crown,
  Database,
  ExternalLink,
  Eye,
  Flame,
  Gift,
  Globe,
  Hash,
  Heart,
  Info,
  Layers,
  Loader2,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Minus,
  Pencil,
  Play,
  Rocket,
  Shield,
  ShoppingCart,
  Sparkles,
  Star,
  Tag,
  ThumbsUp,
  TrendingUp,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
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
type Story = StoryObj<typeof Badge>;

// =============================================================================
// Basic Variants
// =============================================================================

export const Default: Story = {
  render: () => <Badge>Default</Badge>,
};

export const Secondary: Story = {
  render: () => <Badge variant="secondary">Secondary</Badge>,
};

export const Destructive: Story = {
  render: () => <Badge variant="destructive">Destructive</Badge>,
};

export const Outline: Story = {
  render: () => <Badge variant="outline">Outline</Badge>,
};

export const AllVariants: Story = {
  name: "All Variants",
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

// =============================================================================
// With Icons
// =============================================================================

export const WithIconLeft: Story = {
  name: "With Icon (Left)",
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>
        <Check className="mr-1 h-3 w-3" />
        Verified
      </Badge>
      <Badge variant="secondary">
        <Star className="mr-1 h-3 w-3" />
        Featured
      </Badge>
      <Badge variant="destructive">
        <AlertCircle className="mr-1 h-3 w-3" />
        Error
      </Badge>
      <Badge variant="outline">
        <Info className="mr-1 h-3 w-3" />
        Info
      </Badge>
    </div>
  ),
};

export const WithIconRight: Story = {
  name: "With Icon (Right)",
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>
        New
        <ArrowRight className="ml-1 h-3 w-3" />
      </Badge>
      <Badge variant="secondary">
        Learn more
        <ExternalLink className="ml-1 h-3 w-3" />
      </Badge>
      <Badge variant="outline">
        View
        <Eye className="ml-1 h-3 w-3" />
      </Badge>
    </div>
  ),
};

export const IconOnlyBadges: Story = {
  name: "Icon Only",
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge className="h-6 w-6 rounded-full p-0">
        <Check className="h-3 w-3" />
      </Badge>
      <Badge variant="secondary" className="h-6 w-6 rounded-full p-0">
        <Star className="h-3 w-3" />
      </Badge>
      <Badge variant="destructive" className="h-6 w-6 rounded-full p-0">
        <X className="h-3 w-3" />
      </Badge>
      <Badge variant="outline" className="h-6 w-6 rounded-full p-0">
        <Heart className="h-3 w-3" />
      </Badge>
    </div>
  ),
};

// =============================================================================
// Status Badges
// =============================================================================

export const StatusBadges: Story = {
  name: "Status Badges",
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge className="bg-green-500 hover:bg-green-500/80">
        <CheckCircle className="mr-1 h-3 w-3" />
        Completed
      </Badge>
      <Badge className="bg-blue-500 hover:bg-blue-500/80">
        <Play className="mr-1 h-3 w-3" />
        In Progress
      </Badge>
      <Badge className="bg-yellow-500 hover:bg-yellow-500/80">
        <Clock className="mr-1 h-3 w-3" />
        Pending
      </Badge>
      <Badge variant="destructive">
        <X className="mr-1 h-3 w-3" />
        Failed
      </Badge>
      <Badge variant="outline">
        <Minus className="mr-1 h-3 w-3" />
        Cancelled
      </Badge>
    </div>
  ),
};

export const OnlineStatusBadges: Story = {
  name: "Online Status",
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge className="bg-green-500 hover:bg-green-500/80">
        <Circle className="mr-1.5 h-2 w-2 fill-current" />
        Online
      </Badge>
      <Badge className="bg-yellow-500 hover:bg-yellow-500/80">
        <Circle className="mr-1.5 h-2 w-2 fill-current" />
        Away
      </Badge>
      <Badge className="bg-red-500 hover:bg-red-500/80">
        <Circle className="mr-1.5 h-2 w-2 fill-current" />
        Busy
      </Badge>
      <Badge variant="secondary">
        <Circle className="mr-1.5 h-2 w-2 fill-gray-400" />
        Offline
      </Badge>
    </div>
  ),
};

export const WithDotIndicator: Story = {
  name: "With Dot Indicator",
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="outline">
        <span className="mr-1.5 h-2 w-2 rounded-full bg-green-500" />
        Active
      </Badge>
      <Badge variant="outline">
        <span className="mr-1.5 h-2 w-2 rounded-full bg-yellow-500" />
        Pending
      </Badge>
      <Badge variant="outline">
        <span className="mr-1.5 h-2 w-2 rounded-full bg-red-500" />
        Inactive
      </Badge>
      <Badge variant="outline">
        <span className="mr-1.5 h-2 w-2 rounded-full bg-blue-500" />
        Processing
      </Badge>
    </div>
  ),
};

// =============================================================================
// Priority Badges
// =============================================================================

export const PriorityBadges: Story = {
  name: "Priority Badges",
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge className="bg-red-500 hover:bg-red-500/80">
        <Flame className="mr-1 h-3 w-3" />
        Critical
      </Badge>
      <Badge className="bg-orange-500 hover:bg-orange-500/80">
        <TrendingUp className="mr-1 h-3 w-3" />
        High
      </Badge>
      <Badge className="bg-yellow-500 hover:bg-yellow-500/80">
        <Minus className="mr-1 h-3 w-3" />
        Medium
      </Badge>
      <Badge variant="secondary">
        <ArrowRight className="mr-1 h-3 w-3 -rotate-90" />
        Low
      </Badge>
    </div>
  ),
};

// =============================================================================
// Notification Badges (Counts)
// =============================================================================

export const CountBadges: Story = {
  name: "Count Badges",
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Badge className="h-5 min-w-5 justify-center rounded-full px-1.5">
        3
      </Badge>
      <Badge className="h-5 min-w-5 justify-center rounded-full px-1.5">
        12
      </Badge>
      <Badge className="h-5 min-w-5 justify-center rounded-full px-1.5">
        99
      </Badge>
      <Badge className="h-5 min-w-5 justify-center rounded-full px-1.5">
        99+
      </Badge>
      <Badge
        variant="destructive"
        className="h-5 min-w-5 justify-center rounded-full px-1.5"
      >
        !
      </Badge>
    </div>
  ),
};

export const BadgeOnButton: Story = {
  name: "Badge on Button",
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="outline" className="relative">
        <Bell className="h-4 w-4" />
        Notifications
        <Badge className="absolute -right-2 -top-2 h-5 min-w-5 justify-center rounded-full px-1.5">
          5
        </Badge>
      </Button>
      <Button variant="outline" className="relative">
        <Mail className="h-4 w-4" />
        Messages
        <Badge
          variant="destructive"
          className="absolute -right-2 -top-2 h-5 min-w-5 justify-center rounded-full px-1.5"
        >
          12
        </Badge>
      </Button>
      <Button variant="outline" className="relative">
        <ShoppingCart className="h-4 w-4" />
        Cart
        <Badge className="absolute -right-2 -top-2 h-5 min-w-5 justify-center rounded-full px-1.5 bg-green-500 hover:bg-green-500/80">
          3
        </Badge>
      </Button>
    </div>
  ),
};

export const BadgeOnAvatar: Story = {
  name: "Badge on Avatar",
  render: () => (
    <div className="flex flex-wrap items-center gap-6">
      <div className="relative">
        <Avatar>
          <AvatarImage src="https://i.pravatar.cc/150?u=1" alt="User" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <Badge className="absolute -right-1 -top-1 h-5 min-w-5 justify-center rounded-full px-1.5">
          3
        </Badge>
      </div>
      <div className="relative">
        <Avatar>
          <AvatarImage src="https://i.pravatar.cc/150?u=2" alt="User" />
          <AvatarFallback>AS</AvatarFallback>
        </Avatar>
        <Badge
          variant="destructive"
          className="absolute -right-1 -top-1 h-5 min-w-5 justify-center rounded-full px-1.5"
        >
          !
        </Badge>
      </div>
      <div className="relative">
        <Avatar>
          <AvatarImage src="https://i.pravatar.cc/150?u=3" alt="User" />
          <AvatarFallback>BJ</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
      </div>
    </div>
  ),
};

// =============================================================================
// Category / Tag Badges
// =============================================================================

export const CategoryBadges: Story = {
  name: "Category Badges",
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="outline">
        <Tag className="mr-1 h-3 w-3" />
        Design
      </Badge>
      <Badge variant="outline">
        <Code className="mr-1 h-3 w-3" />
        Development
      </Badge>
      <Badge variant="outline">
        <Database className="mr-1 h-3 w-3" />
        Database
      </Badge>
      <Badge variant="outline">
        <Shield className="mr-1 h-3 w-3" />
        Security
      </Badge>
      <Badge variant="outline">
        <Globe className="mr-1 h-3 w-3" />
        Web
      </Badge>
    </div>
  ),
};

export const HashtagBadges: Story = {
  name: "Hashtag Badges",
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary">
        <Hash className="mr-0.5 h-3 w-3" />
        react
      </Badge>
      <Badge variant="secondary">
        <Hash className="mr-0.5 h-3 w-3" />
        typescript
      </Badge>
      <Badge variant="secondary">
        <Hash className="mr-0.5 h-3 w-3" />
        tailwindcss
      </Badge>
      <Badge variant="secondary">
        <Hash className="mr-0.5 h-3 w-3" />
        nextjs
      </Badge>
      <Badge variant="secondary">
        <Hash className="mr-0.5 h-3 w-3" />
        nodejs
      </Badge>
    </div>
  ),
};

// =============================================================================
// Removable Badges
// =============================================================================

export const RemovableBadges: Story = {
  name: "Removable Badges",
  render: function RemovableExample() {
    const [tags, setTags] = useState([
      "React",
      "TypeScript",
      "Tailwind",
      "Storybook",
      "Vite",
    ]);

    const removeTag = (tagToRemove: string) => {
      setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1 pr-1">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 rounded-full p-0.5 hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        {tags.length === 0 && (
          <p className="text-sm text-muted-foreground">
            All tags removed. Refresh to reset.
          </p>
        )}
      </div>
    );
  },
};

// =============================================================================
// Clickable / Interactive Badges
// =============================================================================

export const ClickableBadges: Story = {
  name: "Clickable Badges",
  render: function ClickableExample() {
    const [selected, setSelected] = useState<string[]>(["react"]);

    const toggleTag = (tag: string) => {
      setSelected((prev) =>
        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
      );
    };

    const tags = ["react", "vue", "angular", "svelte", "solid"];

    return (
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant={selected.includes(tag) ? "default" : "outline"}
            className="cursor-pointer transition-colors"
            onClick={() => toggleTag(tag)}
          >
            {selected.includes(tag) && <Check className="mr-1 h-3 w-3" />}
            {tag}
          </Badge>
        ))}
      </div>
    );
  },
};

export const FilterBadges: Story = {
  name: "Filter Badges",
  render: function FilterExample() {
    const [activeFilter, setActiveFilter] = useState("all");

    const filters = [
      { id: "all", label: "All", count: 156 },
      { id: "active", label: "Active", count: 89 },
      { id: "pending", label: "Pending", count: 34 },
      { id: "completed", label: "Completed", count: 33 },
    ];

    return (
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Badge
            key={filter.id}
            variant={activeFilter === filter.id ? "default" : "outline"}
            className="cursor-pointer gap-1.5 transition-colors"
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
            <span
              className={`rounded px-1 text-xs ${
                activeFilter === filter.id
                  ? "bg-primary-foreground/20"
                  : "bg-muted"
              }`}
            >
              {filter.count}
            </span>
          </Badge>
        ))}
      </div>
    );
  },
};

// =============================================================================
// Custom Colors
// =============================================================================

export const CustomColorBadges: Story = {
  name: "Custom Colors",
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge className="bg-pink-500 hover:bg-pink-500/80">Pink</Badge>
      <Badge className="bg-purple-500 hover:bg-purple-500/80">Purple</Badge>
      <Badge className="bg-indigo-500 hover:bg-indigo-500/80">Indigo</Badge>
      <Badge className="bg-cyan-500 hover:bg-cyan-500/80">Cyan</Badge>
      <Badge className="bg-teal-500 hover:bg-teal-500/80">Teal</Badge>
      <Badge className="bg-emerald-500 hover:bg-emerald-500/80">Emerald</Badge>
      <Badge className="bg-amber-500 hover:bg-amber-500/80">Amber</Badge>
      <Badge className="bg-rose-500 hover:bg-rose-500/80">Rose</Badge>
    </div>
  ),
};

export const GradientBadges: Story = {
  name: "Gradient Badges",
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-500/80 hover:to-violet-500/80">
        Gradient
      </Badge>
      <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-500/80 hover:to-blue-500/80">
        Ocean
      </Badge>
      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-500/80 hover:to-emerald-500/80">
        Forest
      </Badge>
      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-500/80 hover:to-red-500/80">
        Sunset
      </Badge>
    </div>
  ),
};

// =============================================================================
// Soft / Pastel Badges
// =============================================================================

export const SoftBadges: Story = {
  name: "Soft / Pastel Badges",
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100/80">
        Info
      </Badge>
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100/80">
        Success
      </Badge>
      <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80">
        Warning
      </Badge>
      <Badge className="bg-red-100 text-red-700 hover:bg-red-100/80">
        Error
      </Badge>
      <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100/80">
        Premium
      </Badge>
      <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-100/80">
        New
      </Badge>
    </div>
  ),
};

// =============================================================================
// Special Badges
// =============================================================================

export const SpecialBadges: Story = {
  name: "Special Badges",
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-400/80 hover:to-orange-500/80">
        <Crown className="mr-1 h-3 w-3" />
        Premium
      </Badge>
      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-500/80 hover:to-pink-500/80">
        <Sparkles className="mr-1 h-3 w-3" />
        Pro
      </Badge>
      <Badge className="bg-gradient-to-r from-green-400 to-cyan-500 hover:from-green-400/80 hover:to-cyan-500/80">
        <Zap className="mr-1 h-3 w-3" />
        New
      </Badge>
      <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-500/80 hover:to-indigo-600/80">
        <Rocket className="mr-1 h-3 w-3" />
        Beta
      </Badge>
      <Badge className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-500/80 hover:to-pink-500/80">
        <Gift className="mr-1 h-3 w-3" />
        Sale
      </Badge>
    </div>
  ),
};

export const VerificationBadges: Story = {
  name: "Verification Badges",
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="font-medium">John Doe</span>
        <Badge className="h-5 w-5 rounded-full bg-blue-500 p-0 hover:bg-blue-500/80">
          <Check className="h-3 w-3" />
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium">Jane Smith</span>
        <Badge className="h-5 w-5 rounded-full bg-yellow-500 p-0 hover:bg-yellow-500/80">
          <Crown className="h-3 w-3" />
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium">Official</span>
        <Badge className="h-5 w-5 rounded-full bg-green-500 p-0 hover:bg-green-500/80">
          <Shield className="h-3 w-3" />
        </Badge>
      </div>
    </div>
  ),
};

// =============================================================================
// Loading State
// =============================================================================

export const LoadingBadge: Story = {
  name: "Loading State",
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary">
        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
        Loading...
      </Badge>
      <Badge variant="outline">
        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
        Processing
      </Badge>
      <Badge className="bg-blue-500 hover:bg-blue-500/80">
        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
        Syncing
      </Badge>
    </div>
  ),
};

// =============================================================================
// In Context
// =============================================================================

export const ProductBadges: Story = {
  name: "Product Card Example",
  render: () => (
    <Card className="w-72">
      <div className="relative">
        <div className="h-40 bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg" />
        <Badge className="absolute left-2 top-2 bg-red-500 hover:bg-red-500/80">
          -30%
        </Badge>
        <Badge className="absolute right-2 top-2" variant="secondary">
          <Sparkles className="mr-1 h-3 w-3" />
          New
        </Badge>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Premium Headphones</h3>
          <Badge variant="outline" className="text-xs">
            In Stock
          </Badge>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
            4.8
          </Badge>
          <Badge variant="secondary" className="text-xs">
            <MessageCircle className="mr-1 h-3 w-3" />
            128
          </Badge>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg font-bold">$149.99</span>
          <span className="text-sm text-muted-foreground line-through">
            $214.99
          </span>
        </div>
      </CardContent>
    </Card>
  ),
};

export const UserProfileBadges: Story = {
  name: "User Profile Example",
  render: () => (
    <Card className="w-80">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-14 w-14">
              <AvatarImage
                src="https://i.pravatar.cc/150?u=profile"
                alt="User"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-background bg-green-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">John Developer</CardTitle>
              <Badge className="h-5 w-5 rounded-full bg-blue-500 p-0 hover:bg-blue-500/80">
                <Check className="h-3 w-3" />
              </Badge>
            </div>
            <CardDescription>Senior Software Engineer</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary">
            <Code className="mr-1 h-3 w-3" />
            TypeScript
          </Badge>
          <Badge variant="secondary">
            <Layers className="mr-1 h-3 w-3" />
            React
          </Badge>
          <Badge variant="secondary">
            <Database className="mr-1 h-3 w-3" />
            PostgreSQL
          </Badge>
          <Badge variant="outline">
            <MapPin className="mr-1 h-3 w-3" />
            Tokyo
          </Badge>
        </div>
        <div className="mt-4 flex gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">1.2k</span>
            <span className="text-muted-foreground">followers</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">856</span>
            <span className="text-muted-foreground">stars</span>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

export const TaskCardBadges: Story = {
  name: "Task Card Example",
  render: () => (
    <Card className="w-80">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            <Bookmark className="mr-1 h-3 w-3" />
            TASK-1234
          </Badge>
          <Badge className="bg-yellow-500 hover:bg-yellow-500/80 text-xs">
            <Clock className="mr-1 h-3 w-3" />
            In Progress
          </Badge>
        </div>
        <CardTitle className="mt-2">Implement user authentication</CardTitle>
        <CardDescription>
          Add OAuth2 login flow with Google and GitHub providers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="text-xs">
            <Lock className="mr-1 h-3 w-3" />
            Security
          </Badge>
          <Badge variant="secondary" className="text-xs">
            <Code className="mr-1 h-3 w-3" />
            Backend
          </Badge>
          <Badge className="bg-orange-500 hover:bg-orange-500/80 text-xs">
            <TrendingUp className="mr-1 h-3 w-3" />
            High Priority
          </Badge>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex -space-x-2">
            <Avatar className="h-6 w-6 border-2 border-background">
              <AvatarImage src="https://i.pravatar.cc/150?u=dev1" alt="Dev 1" />
              <AvatarFallback>D1</AvatarFallback>
            </Avatar>
            <Avatar className="h-6 w-6 border-2 border-background">
              <AvatarImage src="https://i.pravatar.cc/150?u=dev2" alt="Dev 2" />
              <AvatarFallback>D2</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              12
            </span>
            <span className="flex items-center gap-1">
              <Pencil className="h-3 w-3" />8
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Jan 20
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

export const NotificationBadges: Story = {
  name: "Notification Example",
  render: () => (
    <div className="flex flex-col gap-3 w-80">
      <div className="flex items-start gap-3 rounded-lg border p-3">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://i.pravatar.cc/150?u=notif1" alt="User" />
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
            <ThumbsUp className="h-3 w-3" />
          </span>
        </div>
        <div className="flex-1">
          <p className="text-sm">
            <span className="font-medium">Alice Smith</span> liked your post
          </p>
          <p className="text-xs text-muted-foreground">2 minutes ago</p>
        </div>
        <Badge className="h-2 w-2 rounded-full p-0" />
      </div>

      <div className="flex items-start gap-3 rounded-lg border p-3">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://i.pravatar.cc/150?u=notif2" alt="User" />
            <AvatarFallback>BJ</AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
            <User className="h-3 w-3" />
          </span>
        </div>
        <div className="flex-1">
          <p className="text-sm">
            <span className="font-medium">Bob Johnson</span> started following
            you
          </p>
          <p className="text-xs text-muted-foreground">1 hour ago</p>
        </div>
        <Badge className="h-2 w-2 rounded-full p-0" />
      </div>

      <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://i.pravatar.cc/150?u=notif3" alt="User" />
            <AvatarFallback>CW</AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-white">
            <MessageCircle className="h-3 w-3" />
          </span>
        </div>
        <div className="flex-1">
          <p className="text-sm">
            <span className="font-medium">Carol Williams</span> commented on
            your photo
          </p>
          <p className="text-xs text-muted-foreground">Yesterday</p>
        </div>
      </div>
    </div>
  ),
};

// =============================================================================
// Variant x Color Matrix
// =============================================================================

export const VariantColorMatrix: Story = {
  name: "Variant x Color Matrix",
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">
          Default Variant
        </h3>
        <div className="flex flex-wrap gap-2">
          <Badge>Primary</Badge>
          <Badge className="bg-green-500 hover:bg-green-500/80">Green</Badge>
          <Badge className="bg-blue-500 hover:bg-blue-500/80">Blue</Badge>
          <Badge className="bg-yellow-500 hover:bg-yellow-500/80">Yellow</Badge>
          <Badge className="bg-purple-500 hover:bg-purple-500/80">Purple</Badge>
          <Badge className="bg-pink-500 hover:bg-pink-500/80">Pink</Badge>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">
          Outline Variant
        </h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Default</Badge>
          <Badge variant="outline" className="border-green-500 text-green-500">
            Green
          </Badge>
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            Blue
          </Badge>
          <Badge
            variant="outline"
            className="border-yellow-500 text-yellow-500"
          >
            Yellow
          </Badge>
          <Badge
            variant="outline"
            className="border-purple-500 text-purple-500"
          >
            Purple
          </Badge>
          <Badge variant="outline" className="border-pink-500 text-pink-500">
            Pink
          </Badge>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium text-muted-foreground">
          Soft/Pastel Variant
        </h3>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100/80">
            Gray
          </Badge>
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100/80">
            Green
          </Badge>
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100/80">
            Blue
          </Badge>
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80">
            Yellow
          </Badge>
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100/80">
            Purple
          </Badge>
          <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-100/80">
            Pink
          </Badge>
        </div>
      </div>
    </div>
  ),
};
