import type { Meta, StoryObj } from "@storybook/react";
import {
  Check,
  Circle,
  Clock,
  Flag,
  Globe,
  Laptop,
  Moon,
  Palette,
  Smartphone,
  Sun,
  Tablet,
  User,
  Users,
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
  CardHeader,
  CardTitle,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../components/ui";

const meta: Meta<typeof Select> = {
  title: "UI/Select",
  component: Select,
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
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
        <SelectItem value="grape">Grape</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithDefaultValue: Story = {
  name: "With Default Value",
  render: () => (
    <Select defaultValue="banana">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Disabled" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const DisabledItems: Story = {
  name: "Disabled Items",
  render: () => (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select plan" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="free">Free</SelectItem>
        <SelectItem value="pro">Pro</SelectItem>
        <SelectItem value="enterprise" disabled>
          Enterprise (Coming Soon)
        </SelectItem>
      </SelectContent>
    </Select>
  ),
};

// ============================================
// Grouped Options
// ============================================

export const WithGroups: Story = {
  name: "With Groups",
  render: () => (
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
          <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
          <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
          <SelectItem value="cet">Central European Time (CET)</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Asia</SelectLabel>
          <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
          <SelectItem value="kst">Korea Standard Time (KST)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const CountrySelector: Story = {
  name: "Country Selector",
  render: () => (
    <Select>
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="Select country" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Americas</SelectLabel>
          <SelectItem value="us">🇺🇸 United States</SelectItem>
          <SelectItem value="ca">🇨🇦 Canada</SelectItem>
          <SelectItem value="mx">🇲🇽 Mexico</SelectItem>
          <SelectItem value="br">🇧🇷 Brazil</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
          <SelectItem value="de">🇩🇪 Germany</SelectItem>
          <SelectItem value="fr">🇫🇷 France</SelectItem>
          <SelectItem value="es">🇪🇸 Spain</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Asia Pacific</SelectLabel>
          <SelectItem value="jp">🇯🇵 Japan</SelectItem>
          <SelectItem value="kr">🇰🇷 South Korea</SelectItem>
          <SelectItem value="au">🇦🇺 Australia</SelectItem>
          <SelectItem value="sg">🇸🇬 Singapore</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

// ============================================
// With Icons
// ============================================

export const WithIcons: Story = {
  name: "With Icons",
  render: () => (
    <Select defaultValue="laptop">
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select device" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="phone">
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            <span>Phone</span>
          </div>
        </SelectItem>
        <SelectItem value="tablet">
          <div className="flex items-center gap-2">
            <Tablet className="h-4 w-4" />
            <span>Tablet</span>
          </div>
        </SelectItem>
        <SelectItem value="laptop">
          <div className="flex items-center gap-2">
            <Laptop className="h-4 w-4" />
            <span>Laptop</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const ThemeSelector: Story = {
  name: "Theme Selector",
  render: () => (
    <Select defaultValue="system">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <span>Light</span>
          </div>
        </SelectItem>
        <SelectItem value="dark">
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            <span>Dark</span>
          </div>
        </SelectItem>
        <SelectItem value="system">
          <div className="flex items-center gap-2">
            <Laptop className="h-4 w-4" />
            <span>System</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  ),
};

// ============================================
// Status Selectors
// ============================================

export const TaskStatus: Story = {
  name: "Task Status",
  render: () => (
    <Select defaultValue="in_progress">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="todo">
          <div className="flex items-center gap-2">
            <Circle className="h-3 w-3 text-muted-foreground" />
            <span>To Do</span>
          </div>
        </SelectItem>
        <SelectItem value="in_progress">
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 text-blue-500" />
            <span>In Progress</span>
          </div>
        </SelectItem>
        <SelectItem value="done">
          <div className="flex items-center gap-2">
            <Check className="h-3 w-3 text-green-500" />
            <span>Done</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const PrioritySelector: Story = {
  name: "Priority Selector",
  render: () => (
    <Select defaultValue="medium">
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder="Priority" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="low">
          <div className="flex items-center gap-2">
            <Flag className="h-3 w-3 text-muted-foreground" />
            <span>Low</span>
          </div>
        </SelectItem>
        <SelectItem value="medium">
          <div className="flex items-center gap-2">
            <Flag className="h-3 w-3 text-yellow-500" />
            <span>Medium</span>
          </div>
        </SelectItem>
        <SelectItem value="high">
          <div className="flex items-center gap-2">
            <Flag className="h-3 w-3 text-orange-500" />
            <span>High</span>
          </div>
        </SelectItem>
        <SelectItem value="urgent">
          <div className="flex items-center gap-2">
            <Flag className="h-3 w-3 text-red-500" />
            <span>Urgent</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  ),
};

// ============================================
// With Badge
// ============================================

export const WithBadge: Story = {
  name: "With Badge",
  render: () => (
    <Select defaultValue="pro">
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select plan" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="free">
          <div className="flex items-center justify-between w-full gap-4">
            <span>Free</span>
            <Badge variant="secondary">$0/mo</Badge>
          </div>
        </SelectItem>
        <SelectItem value="pro">
          <div className="flex items-center justify-between w-full gap-4">
            <span>Pro</span>
            <Badge>$29/mo</Badge>
          </div>
        </SelectItem>
        <SelectItem value="enterprise">
          <div className="flex items-center justify-between w-full gap-4">
            <span>Enterprise</span>
            <Badge variant="outline">Custom</Badge>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  ),
};

// ============================================
// Controlled Select
// ============================================

export const Controlled: Story = {
  render: function ControlledSelect() {
    const [value, setValue] = useState("apple");
    return (
      <div className="space-y-4">
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="orange">Orange</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Selected: <code className="bg-muted px-1 rounded">{value}</code>
        </p>
        <Button variant="outline" size="sm" onClick={() => setValue("banana")}>
          Select Banana
        </Button>
      </div>
    );
  },
};

// ============================================
// Form Examples
// ============================================

export const WithLabel: Story = {
  name: "With Label",
  render: () => (
    <div className="grid w-full max-w-sm gap-1.5">
      <label htmlFor="status" className="text-sm font-medium">
        Status
      </label>
      <Select>
        <SelectTrigger id="status">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        Choose the current status of the item.
      </p>
    </div>
  ),
};

export const FormRow: Story = {
  name: "Form Row",
  render: () => (
    <div className="flex items-end gap-4">
      <div className="grid gap-1.5 flex-1">
        <label className="text-sm font-medium">Name</label>
        <Input placeholder="Enter name" />
      </div>
      <div className="grid gap-1.5 w-[150px]">
        <label className="text-sm font-medium">Role</label>
        <Select defaultValue="member">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="member">Member</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button>Add</Button>
    </div>
  ),
};

export const SettingsForm: Story = {
  name: "Settings Form",
  render: () => (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>Customize your experience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-1.5">
          <label className="text-sm font-medium">Language</label>
          <Select defaultValue="en">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  English
                </div>
              </SelectItem>
              <SelectItem value="ja">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  日本語
                </div>
              </SelectItem>
              <SelectItem value="es">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Español
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-1.5">
          <label className="text-sm font-medium">Theme</label>
          <Select defaultValue="system">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  Light
                </div>
              </SelectItem>
              <SelectItem value="dark">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  Dark
                </div>
              </SelectItem>
              <SelectItem value="system">
                <div className="flex items-center gap-2">
                  <Laptop className="h-4 w-4" />
                  System
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-1.5">
          <label className="text-sm font-medium">Color Scheme</label>
          <Select defaultValue="blue">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blue">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-blue-500" />
                  Blue
                </div>
              </SelectItem>
              <SelectItem value="green">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-green-500" />
                  Green
                </div>
              </SelectItem>
              <SelectItem value="purple">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-purple-500" />
                  Purple
                </div>
              </SelectItem>
              <SelectItem value="orange">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-orange-500" />
                  Orange
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  ),
};

// ============================================
// User/Team Selector
// ============================================

export const UserSelector: Story = {
  name: "User Selector",
  render: () => (
    <Select>
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="Assign to..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Team Members</SelectLabel>
          <SelectItem value="john">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="https://i.pravatar.cc/150?u=john" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <span>John Doe</span>
            </div>
          </SelectItem>
          <SelectItem value="jane">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="https://i.pravatar.cc/150?u=jane" />
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              <span>Jane Smith</span>
            </div>
          </SelectItem>
          <SelectItem value="bob">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="https://i.pravatar.cc/150?u=bob" />
                <AvatarFallback>BJ</AvatarFallback>
              </Avatar>
              <span>Bob Johnson</span>
            </div>
          </SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectItem value="unassigned">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Unassigned</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const TeamSelector: Story = {
  name: "Team Selector",
  render: () => (
    <Select defaultValue="engineering">
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select team" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="engineering">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <Users className="h-4 w-4" />
            <span>Engineering</span>
          </div>
        </SelectItem>
        <SelectItem value="design">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-purple-500" />
            <Palette className="h-4 w-4" />
            <span>Design</span>
          </div>
        </SelectItem>
        <SelectItem value="marketing">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <Globe className="h-4 w-4" />
            <span>Marketing</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  ),
};

// ============================================
// Multiple Selects
// ============================================

export const FilterBar: Story = {
  name: "Filter Bar",
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Select>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="bug">Bug</SelectItem>
          <SelectItem value="feature">Feature</SelectItem>
          <SelectItem value="improvement">Improvement</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priority</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" size="icon">
        <Check className="h-4 w-4" />
      </Button>
    </div>
  ),
};

// ============================================
// Long List
// ============================================

export const LongList: Story = {
  name: "Long List",
  render: () => (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select font" />
      </SelectTrigger>
      <SelectContent className="max-h-[200px]">
        {[
          "Arial",
          "Helvetica",
          "Times New Roman",
          "Georgia",
          "Verdana",
          "Courier New",
          "Comic Sans MS",
          "Impact",
          "Trebuchet MS",
          "Palatino",
          "Garamond",
          "Bookman",
          "Avant Garde",
          "Calibri",
          "Candara",
          "Optima",
          "Futura",
          "Gill Sans",
        ].map((font) => (
          <SelectItem
            key={font}
            value={font.toLowerCase().replace(/\s+/g, "-")}
          >
            <span style={{ fontFamily: font }}>{font}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
};

// ============================================
// Sizes
// ============================================

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="text-sm w-20">Small:</span>
        <Select>
          <SelectTrigger className="w-[150px] h-8 text-xs">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
            <SelectItem value="2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm w-20">Default:</span>
        <Select>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
            <SelectItem value="2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm w-20">Large:</span>
        <Select>
          <SelectTrigger className="w-[150px] h-12 text-base">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
            <SelectItem value="2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
};

// ============================================
// Full Width
// ============================================

export const FullWidth: Story = {
  name: "Full Width",
  render: () => (
    <div className="w-[400px] space-y-4">
      <div className="grid gap-1.5">
        <label className="text-sm font-medium">Category</label>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="clothing">Clothing</SelectItem>
            <SelectItem value="books">Books</SelectItem>
            <SelectItem value="home">Home & Garden</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
};
