import type { Meta, StoryObj } from "@storybook/react";
import {
  AlertCircle,
  Bell,
  Bold,
  Bookmark,
  Check,
  Clipboard,
  Clock,
  Code,
  Command,
  Copy,
  Crown,
  Download,
  Edit,
  Eye,
  FileText,
  Folder,
  Heart,
  HelpCircle,
  Home,
  Image,
  Info,
  Italic,
  Keyboard,
  Link,
  List,
  Lock,
  Mail,
  Moon,
  MoreHorizontal,
  Pause,
  Play,
  Redo,
  RefreshCw,
  Search,
  Settings,
  Share,
  Shuffle,
  SkipBack,
  SkipForward,
  Sparkles,
  Sun,
  Trash2,
  Underline,
  Undo,
  Video,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Switch } from "../components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "UI/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <div className="flex min-h-[300px] items-center justify-center p-8">
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

// =============================================================================
// Basic Examples
// =============================================================================

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This is a tooltip</p>
      </TooltipContent>
    </Tooltip>
  ),
};

export const OnText: Story = {
  name: "On Text",
  render: () => (
    <p className="text-sm">
      Hover over the{" "}
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help border-b border-dashed border-muted-foreground font-medium">
            underlined text
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>This is additional information</p>
        </TooltipContent>
      </Tooltip>{" "}
      to see more info.
    </p>
  ),
};

export const OnIcon: Story = {
  name: "On Icon",
  render: () => (
    <div className="flex items-center gap-2">
      <span className="text-sm">Password requirements</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="h-4 w-4 cursor-help text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Must be at least 8 characters</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

// =============================================================================
// Positions
// =============================================================================

export const Positions: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <div />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" className="w-full">
            Top
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Tooltip on top</p>
        </TooltipContent>
      </Tooltip>
      <div />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" className="w-full">
            Left
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Tooltip on left</p>
        </TooltipContent>
      </Tooltip>
      <div className="flex items-center justify-center">
        <Info className="h-5 w-5 text-muted-foreground" />
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" className="w-full">
            Right
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Tooltip on right</p>
        </TooltipContent>
      </Tooltip>

      <div />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" className="w-full">
            Bottom
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Tooltip on bottom</p>
        </TooltipContent>
      </Tooltip>
      <div />
    </div>
  ),
};

export const Alignment: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex justify-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Start</Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="start">
            <p>Aligned to start</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Center</Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            <p>Aligned to center</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">End</Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="end">
            <p>Aligned to end</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  ),
};

// =============================================================================
// Delay Durations
// =============================================================================

export const DelayDurations: Story = {
  name: "Delay Durations",
  render: () => (
    <div className="flex gap-4">
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button variant="outline">Instant (0ms)</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>No delay</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button variant="outline">Fast (300ms)</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>300ms delay</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip delayDuration={700}>
        <TooltipTrigger asChild>
          <Button variant="outline">Slow (700ms)</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>700ms delay</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

// =============================================================================
// Rich Content
// =============================================================================

export const RichContent: Story = {
  name: "Rich Content",
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">
          <Info className="mr-2 h-4 w-4" />
          Feature Info
        </Button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <div className="space-y-1">
          <p className="font-semibold">Pro Feature</p>
          <p className="text-xs text-muted-foreground">
            This feature requires a Pro subscription. Upgrade your plan to
            unlock advanced functionality.
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  ),
};

export const WithList: Story = {
  name: "With List",
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">
          <HelpCircle className="mr-2 h-4 w-4" />
          Requirements
        </Button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <div className="space-y-2">
          <p className="font-semibold">Password Requirements:</p>
          <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
            <li>At least 8 characters</li>
            <li>One uppercase letter</li>
            <li>One lowercase letter</li>
            <li>One number</li>
            <li>One special character</li>
          </ul>
        </div>
      </TooltipContent>
    </Tooltip>
  ),
};

export const WithIconContent: Story = {
  name: "With Icon Content",
  render: () => (
    <div className="flex gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon">
            <Lock className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-green-500" />
            <span>Secure connection</span>
          </div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <span>Requires attention</span>
          </div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon">
            <Check className="h-4 w-4 text-green-500" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>Verified</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const WithBadge: Story = {
  name: "With Badge",
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">
          <Sparkles className="mr-2 h-4 w-4" />
          New Feature
        </Button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
              New
            </Badge>
            <span className="font-semibold">AI Assistant</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Our new AI-powered assistant helps you write better code faster.
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  ),
};

// =============================================================================
// Keyboard Shortcuts
// =============================================================================

export const KeyboardShortcuts: Story = {
  name: "Keyboard Shortcuts",
  render: () => (
    <div className="flex gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon">
            <Copy className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center gap-2">
            <span>Copy</span>
            <kbd className="pointer-events-none flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
              <Command className="h-3 w-3" />C
            </kbd>
          </div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon">
            <Clipboard className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center gap-2">
            <span>Paste</span>
            <kbd className="pointer-events-none flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
              <Command className="h-3 w-3" />V
            </kbd>
          </div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon">
            <Undo className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center gap-2">
            <span>Undo</span>
            <kbd className="pointer-events-none flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
              <Command className="h-3 w-3" />Z
            </kbd>
          </div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon">
            <Redo className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center gap-2">
            <span>Redo</span>
            <kbd className="pointer-events-none flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
              <Command className="h-3 w-3" />
              <span>Shift</span>Z
            </kbd>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const KeyboardShortcutsList: Story = {
  name: "Keyboard Shortcuts List",
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">
          <Keyboard className="mr-2 h-4 w-4" />
          Shortcuts
        </Button>
      </TooltipTrigger>
      <TooltipContent className="w-64">
        <div className="space-y-2">
          <p className="font-semibold">Keyboard Shortcuts</p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span>New file</span>
              <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono">
                Ctrl+N
              </kbd>
            </div>
            <div className="flex items-center justify-between">
              <span>Save</span>
              <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono">
                Ctrl+S
              </kbd>
            </div>
            <div className="flex items-center justify-between">
              <span>Search</span>
              <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono">
                Ctrl+F
              </kbd>
            </div>
            <div className="flex items-center justify-between">
              <span>Command palette</span>
              <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono">
                Ctrl+P
              </kbd>
            </div>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  ),
};

// =============================================================================
// Toolbars
// =============================================================================

export const IconToolbar: Story = {
  name: "Icon Toolbar",
  render: () => (
    <div className="flex items-center gap-1 rounded-lg border p-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Edit</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <Copy className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <Share className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Share</p>
        </TooltipContent>
      </Tooltip>

      <div className="mx-1 h-6 w-px bg-border" />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Settings</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const TextFormattingToolbar: Story = {
  name: "Text Formatting Toolbar",
  render: () => (
    <div className="flex items-center gap-0.5 rounded-lg border p-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bold className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center gap-2">
            <span>Bold</span>
            <kbd className="rounded border bg-muted px-1 text-[10px]">⌘B</kbd>
          </div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Italic className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center gap-2">
            <span>Italic</span>
            <kbd className="rounded border bg-muted px-1 text-[10px]">⌘I</kbd>
          </div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Underline className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center gap-2">
            <span>Underline</span>
            <kbd className="rounded border bg-muted px-1 text-[10px]">⌘U</kbd>
          </div>
        </TooltipContent>
      </Tooltip>

      <div className="mx-1 h-5 w-px bg-border" />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Link className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center gap-2">
            <span>Link</span>
            <kbd className="rounded border bg-muted px-1 text-[10px]">⌘K</kbd>
          </div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Code className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center gap-2">
            <span>Code</span>
            <kbd className="rounded border bg-muted px-1 text-[10px]">⌘E</kbd>
          </div>
        </TooltipContent>
      </Tooltip>

      <div className="mx-1 h-5 w-px bg-border" />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <List className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Bullet list</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Image className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Insert image</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const MediaPlayerControls: Story = {
  name: "Media Player Controls",
  render: function MediaPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isShuffled, setIsShuffled] = useState(false);

    return (
      <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isShuffled ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsShuffled(!isShuffled)}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isShuffled ? "Disable shuffle" : "Enable shuffle"}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <SkipBack className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Previous</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              size="icon"
              className="h-10 w-10"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isPlaying ? "Pause" : "Play"}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <SkipForward className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Next</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isMuted ? "Unmute" : "Mute"}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  },
};

// =============================================================================
// Navigation
// =============================================================================

export const SidebarNavigation: Story = {
  name: "Sidebar Navigation",
  render: () => (
    <div className="flex w-14 flex-col gap-2 rounded-lg border bg-card p-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Home className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Home</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Search className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Search</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Notifications (3 new)</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Mail className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Messages</p>
        </TooltipContent>
      </Tooltip>

      <div className="my-2 h-px bg-border" />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Settings className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Settings</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Avatar className="h-10 w-10 cursor-pointer">
            <AvatarImage src="https://i.pravatar.cc/150?u=nav" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent side="right">
          <div className="flex items-center gap-2">
            <div>
              <p className="font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">View profile</p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

// =============================================================================
// Form Elements
// =============================================================================

export const FormFieldHints: Story = {
  name: "Form Field Hints",
  render: () => (
    <div className="w-72 space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 cursor-help text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>We&apos;ll never share your email</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Input id="email" type="email" placeholder="john@example.com" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label htmlFor="api-key" className="text-sm font-medium">
            API Key
          </label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 cursor-help text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                Find your API key in the Settings → Developer → API Keys section
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Input id="api-key" type="password" placeholder="sk-..." />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label htmlFor="2fa" className="text-sm font-medium">
            Two-factor auth
          </label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Lock className="h-4 w-4 cursor-help text-green-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Adds an extra layer of security</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Switch id="2fa" />
      </div>
    </div>
  ),
};

// =============================================================================
// Truncated Text
// =============================================================================

export const TruncatedText: Story = {
  name: "Truncated Text",
  render: () => (
    <div className="w-64 space-y-3">
      <Tooltip>
        <TooltipTrigger asChild>
          <p className="cursor-default truncate text-sm">
            This is a very long text that will be truncated and needs a tooltip
            to show the full content
          </p>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm">
          <p>
            This is a very long text that will be truncated and needs a tooltip
            to show the full content
          </p>
        </TooltipContent>
      </Tooltip>

      <div className="flex items-center gap-2 rounded-lg border p-2">
        <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-default truncate text-sm">
              very-long-filename-that-exceeds-container-width.tsx
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>very-long-filename-that-exceeds-container-width.tsx</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  ),
};

// =============================================================================
// Interactive Tooltips
// =============================================================================

export const CopyToClipboard: Story = {
  name: "Copy to Clipboard",
  render: function CopyExample() {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" onClick={handleCopy}>
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? "Copied!" : "Copy to clipboard"}</p>
        </TooltipContent>
      </Tooltip>
    );
  },
};

export const LikeButton: Story = {
  name: "Like Button",
  render: function LikeExample() {
    const [liked, setLiked] = useState(false);
    const [count, setCount] = useState(42);

    const handleLike = () => {
      setLiked(!liked);
      setCount(liked ? count - 1 : count + 1);
    };

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={liked ? "default" : "outline"}
            size="sm"
            onClick={handleLike}
            className="gap-2"
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
            {count}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{liked ? "Unlike" : "Like"}</p>
        </TooltipContent>
      </Tooltip>
    );
  },
};

// =============================================================================
// User Info
// =============================================================================

export const UserTooltip: Story = {
  name: "User Tooltip",
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src="https://i.pravatar.cc/150?u=user1" alt="User" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </TooltipTrigger>
      <TooltipContent className="w-64 p-0" side="right">
        <div className="p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src="https://i.pravatar.cc/150?u=user1" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">John Doe</p>
                <Badge variant="secondary" className="text-xs">
                  <Crown className="mr-1 h-3 w-3" />
                  Pro
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">@johndoe</p>
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Full-stack developer passionate about React and TypeScript.
          </p>
          <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
            <span>
              <strong className="text-foreground">1.2k</strong> followers
            </span>
            <span>
              <strong className="text-foreground">342</strong> following
            </span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  ),
};

export const TeamMembers: Story = {
  name: "Team Members",
  render: () => (
    <div className="flex -space-x-2">
      {[
        { name: "Alice", username: "alice", img: "alice" },
        { name: "Bob", username: "bob", img: "bob" },
        { name: "Carol", username: "carol", img: "carol" },
        { name: "David", username: "david", img: "david" },
      ].map((user) => (
        <Tooltip key={user.username}>
          <TooltipTrigger asChild>
            <Avatar className="cursor-pointer border-2 border-background transition-transform hover:z-10 hover:scale-110">
              <AvatarImage
                src={`https://i.pravatar.cc/150?u=${user.img}`}
                alt={user.name}
              />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex items-center gap-2">
              <span className="font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">
                @{user.username}
              </span>
            </div>
          </TooltipContent>
        </Tooltip>
      ))}
      <Tooltip>
        <TooltipTrigger asChild>
          <Avatar className="cursor-pointer border-2 border-background">
            <AvatarFallback className="bg-muted text-muted-foreground">
              +5
            </AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent>
          <p>5 more team members</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

// =============================================================================
// Status & Info
// =============================================================================

export const StatusTooltips: Story = {
  name: "Status Tooltips",
  render: () => (
    <div className="flex items-center gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className="cursor-default bg-green-500 hover:bg-green-500">
            <span className="mr-1.5 h-2 w-2 rounded-full bg-green-200 animate-pulse" />
            Online
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>System is operational</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className="cursor-default bg-yellow-500 hover:bg-yellow-500">
            <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
            Syncing
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Synchronizing data...</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="cursor-default">
            <Clock className="mr-1 h-3 w-3" />
            Updated 2m ago
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Last updated: Jan 16, 2026 at 10:30 AM</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

// =============================================================================
// Action Buttons
// =============================================================================

export const ActionButtonsGroup: Story = {
  name: "Action Buttons Group",
  render: () => (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon">
            <Eye className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Preview</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Download</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon">
            <Share className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Share</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon">
            <Bookmark className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Bookmark</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>More options</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

// =============================================================================
// File Types
// =============================================================================

export const FileTypeTooltips: Story = {
  name: "File Type Tooltips",
  render: () => (
    <div className="flex items-center gap-3">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border bg-card transition-colors hover:bg-muted">
            <FileText className="h-6 w-6 text-blue-500" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-medium">document.pdf</p>
            <p className="text-xs text-muted-foreground">
              PDF Document • 2.4 MB
            </p>
          </div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border bg-card transition-colors hover:bg-muted">
            <Image className="h-6 w-6 text-green-500" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-medium">photo.jpg</p>
            <p className="text-xs text-muted-foreground">Image • 1.2 MB</p>
          </div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border bg-card transition-colors hover:bg-muted">
            <Video className="h-6 w-6 text-purple-500" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-medium">video.mp4</p>
            <p className="text-xs text-muted-foreground">Video • 45.8 MB</p>
          </div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border bg-card transition-colors hover:bg-muted">
            <Folder className="h-6 w-6 text-yellow-500" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-medium">Projects</p>
            <p className="text-xs text-muted-foreground">Folder • 12 items</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

// =============================================================================
// Theme Toggle
// =============================================================================

export const ThemeToggle: Story = {
  name: "Theme Toggle",
  render: function ThemeExample() {
    const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

    return (
      <div className="flex items-center gap-1 rounded-lg border p-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={theme === "light" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setTheme("light")}
            >
              <Sun className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Light mode</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={theme === "dark" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setTheme("dark")}
            >
              <Moon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Dark mode</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={theme === "system" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setTheme("system")}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>System preference</p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  },
};

// =============================================================================
// Custom Styled
// =============================================================================

export const CustomStyled: Story = {
  name: "Custom Styled",
  render: () => (
    <div className="flex gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Success</Button>
        </TooltipTrigger>
        <TooltipContent className="bg-green-500 text-white">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            <span>Success message</span>
          </div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Warning</Button>
        </TooltipTrigger>
        <TooltipContent className="bg-yellow-500 text-white">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>Warning message</span>
          </div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Error</Button>
        </TooltipTrigger>
        <TooltipContent className="bg-red-500 text-white">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>Error message</span>
          </div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Info</Button>
        </TooltipTrigger>
        <TooltipContent className="bg-blue-500 text-white">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span>Info message</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};
