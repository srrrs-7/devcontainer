import type { Meta, StoryObj } from "@storybook/react";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  CreditCard,
  Download,
  Eye,
  Github,
  Globe,
  Heart,
  Image,
  Mail,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Music,
  Package,
  Play,
  Plus,
  Settings,
  Share2,
  ShoppingCart,
  Star,
  TrendingUp,
  Twitter,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Switch,
} from "../components/ui";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================
// Basic Examples
// ============================================

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  ),
};

export const Simple: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent className="pt-6">
        <p>A simple card with just content.</p>
      </CardContent>
    </Card>
  ),
};

export const WithForm: Story = {
  name: "With Form",
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create Task</CardTitle>
        <CardDescription>Add a new task to your list.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input id="name" placeholder="Task name" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Create</Button>
      </CardFooter>
    </Card>
  ),
};

// ============================================
// Product Cards
// ============================================

export const ProductCard: Story = {
  name: "Product Card",
  render: () => (
    <Card className="w-[300px] overflow-hidden">
      <div className="aspect-square bg-muted flex items-center justify-center">
        <Image className="h-16 w-16 text-muted-foreground" />
      </div>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">Premium Headphones</CardTitle>
            <CardDescription>Wireless Noise Cancelling</CardDescription>
          </div>
          <Badge>New</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
            />
          ))}
          <span className="text-sm text-muted-foreground ml-1">(128)</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">$299</span>
          <span className="text-sm text-muted-foreground line-through">
            $399
          </span>
          <Badge variant="secondary" className="ml-auto">
            25% OFF
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button className="flex-1">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
        <Button variant="outline" size="icon">
          <Heart className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const ProductCardHorizontal: Story = {
  name: "Product Card (Horizontal)",
  render: () => (
    <Card className="w-[500px] flex overflow-hidden">
      <div className="w-40 bg-muted flex items-center justify-center shrink-0">
        <Package className="h-12 w-12 text-muted-foreground" />
      </div>
      <div className="flex flex-col flex-1">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">Wireless Mouse</CardTitle>
            <Badge variant="outline">In Stock</Badge>
          </div>
          <CardDescription>
            Ergonomic design with precision tracking
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <span className="text-xl font-bold">$49.99</span>
        </CardContent>
        <CardFooter>
          <Button size="sm">Add to Cart</Button>
          <Button variant="ghost" size="sm" className="ml-2">
            View Details
          </Button>
        </CardFooter>
      </div>
    </Card>
  ),
};

// ============================================
// Pricing Cards
// ============================================

export const PricingCard: Story = {
  name: "Pricing Card",
  render: () => (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle>Pro Plan</CardTitle>
        <CardDescription>For growing teams and businesses</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline">
          <span className="text-4xl font-bold">$29</span>
          <span className="text-muted-foreground ml-1">/month</span>
        </div>
        <ul className="space-y-2 text-sm">
          {[
            "Unlimited projects",
            "Advanced analytics",
            "Priority support",
            "Custom integrations",
            "Team collaboration",
          ].map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Get Started</Button>
      </CardFooter>
    </Card>
  ),
};

export const PricingCards: Story = {
  name: "Pricing Cards Grid",
  render: () => (
    <div className="flex gap-4">
      <Card className="w-[280px]">
        <CardHeader>
          <CardTitle className="text-lg">Starter</CardTitle>
          <CardDescription>For individuals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">Free</span>
          </div>
          <ul className="space-y-2 text-sm">
            {["3 projects", "Basic analytics", "Community support"].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-muted-foreground" />
                {f}
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Get Started
          </Button>
        </CardFooter>
      </Card>

      <Card className="w-[280px] border-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Pro</CardTitle>
            <Badge>Popular</Badge>
          </div>
          <CardDescription>For growing teams</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">$29</span>
            <span className="text-muted-foreground ml-1">/mo</span>
          </div>
          <ul className="space-y-2 text-sm">
            {[
              "Unlimited projects",
              "Advanced analytics",
              "Priority support",
              "API access",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                {f}
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Get Started</Button>
        </CardFooter>
      </Card>

      <Card className="w-[280px]">
        <CardHeader>
          <CardTitle className="text-lg">Enterprise</CardTitle>
          <CardDescription>For large organizations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">Custom</span>
          </div>
          <ul className="space-y-2 text-sm">
            {[
              "Everything in Pro",
              "Custom contracts",
              "Dedicated support",
              "SLA guarantee",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-muted-foreground" />
                {f}
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Contact Sales
          </Button>
        </CardFooter>
      </Card>
    </div>
  ),
};

// ============================================
// Profile Cards
// ============================================

export const ProfileCard: Story = {
  name: "Profile Card",
  render: () => (
    <Card className="w-[350px]">
      <CardHeader className="text-center">
        <Avatar className="h-20 w-20 mx-auto mb-2">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <CardTitle>Sarah Johnson</CardTitle>
        <CardDescription>Senior Product Designer</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Passionate about creating beautiful and functional user experiences.
        </p>
        <div className="flex justify-center gap-6 text-sm">
          <div className="text-center">
            <p className="font-bold">1.2k</p>
            <p className="text-muted-foreground">Followers</p>
          </div>
          <div className="text-center">
            <p className="font-bold">340</p>
            <p className="text-muted-foreground">Following</p>
          </div>
          <div className="text-center">
            <p className="font-bold">56</p>
            <p className="text-muted-foreground">Projects</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-center gap-2">
        <Button>Follow</Button>
        <Button variant="outline">Message</Button>
      </CardFooter>
    </Card>
  ),
};

export const TeamMemberCard: Story = {
  name: "Team Member Card",
  render: () => (
    <Card className="w-[300px]">
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="https://i.pravatar.cc/150?u=team1" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">John Doe</p>
            <p className="text-sm text-muted-foreground truncate">
              Engineering Lead
            </p>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" className="flex-1">
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <MessageSquare className="mr-2 h-4 w-4" />
            Chat
          </Button>
        </div>
      </CardContent>
    </Card>
  ),
};

// ============================================
// Stats Cards
// ============================================

export const StatsCard: Story = {
  name: "Stats Card",
  render: () => (
    <Card className="w-[250px]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        <CreditCard className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">$45,231.89</div>
        <p className="text-xs text-muted-foreground">
          <span className="text-green-500">+20.1%</span> from last month
        </p>
      </CardContent>
    </Card>
  ),
};

export const StatsGrid: Story = {
  name: "Stats Grid",
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-[520px]">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12,543</div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-green-500" />
            <span className="text-green-500">+12%</span> from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,429</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500">+8%</span> from last hour
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$89,432</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500">+19%</span> from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Downloads</CardTitle>
          <Download className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24,389</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-red-500">-4%</span> from last month
          </p>
        </CardContent>
      </Card>
    </div>
  ),
};

// ============================================
// Notification Cards
// ============================================

export const NotificationCard: Story = {
  name: "Notification Card",
  render: () => (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {[
          { title: "Your order has shipped", time: "2 hours ago", read: false },
          {
            title: "New comment on your post",
            time: "5 hours ago",
            read: false,
          },
          { title: "Welcome to the platform!", time: "1 day ago", read: true },
        ].map((notification, i) => (
          <div
            key={i}
            className={`flex items-start gap-4 rounded-md border p-3 ${!notification.read ? "bg-muted/50" : ""}`}
          >
            <Bell
              className={`h-5 w-5 mt-0.5 ${!notification.read ? "text-primary" : "text-muted-foreground"}`}
            />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">{notification.title}</p>
              <p className="text-xs text-muted-foreground">
                {notification.time}
              </p>
            </div>
            {!notification.read && (
              <div className="h-2 w-2 rounded-full bg-primary" />
            )}
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="outline">
          <Check className="mr-2 h-4 w-4" />
          Mark all as read
        </Button>
      </CardFooter>
    </Card>
  ),
};

// ============================================
// Settings Cards
// ============================================

export const SettingsCard: Story = {
  name: "Settings Card",
  render: function SettingsCardExample() {
    const [notifications, setNotifications] = useState(true);
    const [marketing, setMarketing] = useState(false);
    const [security, setSecurityAlerts] = useState(true);

    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>
            Configure how you receive notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Push Notifications</p>
              <p className="text-xs text-muted-foreground">
                Receive notifications on your device
              </p>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Marketing Emails</p>
              <p className="text-xs text-muted-foreground">
                Receive emails about new features
              </p>
            </div>
            <Switch checked={marketing} onCheckedChange={setMarketing} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Security Alerts</p>
              <p className="text-xs text-muted-foreground">
                Get notified about security events
              </p>
            </div>
            <Switch checked={security} onCheckedChange={setSecurityAlerts} />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Save Preferences</Button>
        </CardFooter>
      </Card>
    );
  },
};

// ============================================
// Blog / Article Cards
// ============================================

export const BlogCard: Story = {
  name: "Blog Card",
  render: () => (
    <Card className="w-[350px] overflow-hidden">
      <div className="aspect-video bg-muted flex items-center justify-center">
        <Image className="h-12 w-12 text-muted-foreground" />
      </div>
      <CardHeader>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Calendar className="h-4 w-4" />
          <span>Jan 15, 2025</span>
          <span>•</span>
          <Clock className="h-4 w-4" />
          <span>5 min read</span>
        </div>
        <CardTitle className="text-xl">Getting Started with React 19</CardTitle>
        <CardDescription>
          Learn about the new features in React 19 and how to upgrade your
          applications.
        </CardDescription>
      </CardHeader>
      <CardFooter className="justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://i.pravatar.cc/150?u=author" />
            <AvatarFallback>AU</AvatarFallback>
          </Avatar>
          <span className="text-sm">John Smith</span>
        </div>
        <Button variant="ghost" size="sm">
          Read more
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const ArticleList: Story = {
  name: "Article List",
  render: () => (
    <div className="w-[500px] space-y-4">
      {[
        {
          title: "Understanding TypeScript Generics",
          category: "TypeScript",
          date: "Jan 15",
        },
        {
          title: "Building Accessible Components",
          category: "Accessibility",
          date: "Jan 12",
        },
        {
          title: "State Management in 2025",
          category: "React",
          date: "Jan 10",
        },
      ].map((article, i) => (
        <Card
          key={i}
          className="hover:bg-muted/50 transition-colors cursor-pointer"
        >
          <CardContent className="flex items-center gap-4 p-4">
            <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center shrink-0">
              <Image className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <Badge variant="secondary" className="mb-1">
                {article.category}
              </Badge>
              <h3 className="font-medium truncate">{article.title}</h3>
              <p className="text-sm text-muted-foreground">{article.date}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};

// ============================================
// Event Cards
// ============================================

export const EventCard: Story = {
  name: "Event Card",
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="flex gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">28</p>
            <p className="text-sm text-muted-foreground">JAN</p>
          </div>
          <div>
            <CardTitle className="text-lg">Tech Conference 2025</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              San Francisco, CA
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Join us for the biggest tech conference of the year with amazing
          speakers and workshops.
        </p>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <Avatar key={i} className="h-8 w-8 border-2 border-background">
                <AvatarImage src={`https://i.pravatar.cc/150?u=event${i}`} />
                <AvatarFallback>U{i}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span className="text-sm text-muted-foreground">+128 attending</span>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button className="flex-1">Register Now</Button>
        <Button variant="outline" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  ),
};

// ============================================
// Media Cards
// ============================================

export const MusicCard: Story = {
  name: "Music Card",
  render: () => (
    <Card className="w-[350px]">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <div className="h-20 w-20 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
            <Music className="h-10 w-10 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">Summer Vibes</p>
            <p className="text-sm text-muted-foreground truncate">
              Various Artists
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              50 songs • 3hr 24min
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Button size="icon" className="h-10 w-10 rounded-full">
              <Play className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  ),
};

// ============================================
// Social Cards
// ============================================

export const SocialCard: Story = {
  name: "Social Post Card",
  render: function SocialCardExample() {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(42);

    const handleLike = () => {
      setLiked(!liked);
      setLikes(liked ? likes - 1 : likes + 1);
    };

    return (
      <Card className="w-[400px]">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="https://i.pravatar.cc/150?u=social" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">Jane Doe</p>
              <p className="text-xs text-muted-foreground">2 hours ago</p>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-sm">
            Just launched my new portfolio website! 🚀 Check it out and let me
            know what you think. Built with React, TypeScript, and Tailwind CSS.
          </p>
          <div className="mt-3 aspect-video bg-muted rounded-md flex items-center justify-center">
            <Globe className="h-12 w-12 text-muted-foreground" />
          </div>
        </CardContent>
        <CardFooter className="border-t pt-3">
          <div className="flex w-full justify-between">
            <Button
              variant="ghost"
              size="sm"
              className={liked ? "text-red-500" : ""}
              onClick={handleLike}
            >
              <Heart
                className={`mr-2 h-4 w-4 ${liked ? "fill-current" : ""}`}
              />
              {likes}
            </Button>
            <Button variant="ghost" size="sm">
              <MessageSquare className="mr-2 h-4 w-4" />
              12
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  },
};

// ============================================
// Project Cards
// ============================================

export const ProjectCard: Story = {
  name: "Project Card",
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Project Alpha</CardTitle>
              <CardDescription>Marketing Campaign</CardDescription>
            </div>
          </div>
          <Badge variant="outline">Active</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>68%</span>
          </div>
          <div className="h-2 rounded-full bg-muted">
            <div className="h-full w-[68%] rounded-full bg-primary" />
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Due Feb 15</span>
          </div>
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <Avatar key={i} className="h-6 w-6 border-2 border-background">
                <AvatarImage src={`https://i.pravatar.cc/150?u=proj${i}`} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View Project
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  ),
};

// ============================================
// Integration Cards
// ============================================

export const IntegrationCard: Story = {
  name: "Integration Card",
  render: () => (
    <div className="flex gap-4">
      <Card className="w-[250px]">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-[#24292e] flex items-center justify-center">
              <Github className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-medium">GitHub</p>
              <p className="text-xs text-muted-foreground">Connected</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Sync your repositories and track issues.
          </p>
          <Button variant="outline" size="sm" className="w-full">
            <Settings className="mr-2 h-4 w-4" />
            Configure
          </Button>
        </CardContent>
      </Card>

      <Card className="w-[250px]">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-[#1DA1F2] flex items-center justify-center">
              <Twitter className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-medium">Twitter</p>
              <p className="text-xs text-muted-foreground">Not connected</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Share updates and engage with followers.
          </p>
          <Button size="sm" className="w-full">
            Connect
          </Button>
        </CardContent>
      </Card>
    </div>
  ),
};

// ============================================
// Empty State Card
// ============================================

export const EmptyStateCard: Story = {
  name: "Empty State Card",
  render: () => (
    <Card className="w-[400px]">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold mb-1">No projects yet</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-[250px]">
          Get started by creating your first project. It only takes a minute.
        </p>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Project
        </Button>
      </CardContent>
    </Card>
  ),
};

// ============================================
// Interactive Card
// ============================================

export const InteractiveCard: Story = {
  name: "Interactive Card",
  render: () => (
    <Card className="w-[300px] cursor-pointer transition-all hover:shadow-lg hover:border-primary/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Quick Actions
        </CardTitle>
        <CardDescription>Click to expand options</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Hover over this card to see the interactive effects.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="w-full">
          Learn More
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  ),
};

// ============================================
// Login Card
// ============================================

export const LoginCard: Story = {
  name: "Login Card",
  render: () => (
    <Card className="w-[380px]">
      <CardHeader className="text-center">
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline">
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input type="email" placeholder="name@example.com" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <Input type="password" placeholder="••••••••" />
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <Button className="w-full">Sign In</Button>
        <p className="text-sm text-muted-foreground text-center">
          Don't have an account?{" "}
          <Button variant="link" className="p-0 h-auto">
            Sign up
          </Button>
        </p>
      </CardFooter>
    </Card>
  ),
};
