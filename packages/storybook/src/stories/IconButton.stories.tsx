import type { Meta, StoryObj } from "@storybook/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bell,
  Bold,
  ChevronLeft,
  ChevronRight,
  Copy,
  Edit,
  Heart,
  Italic,
  Menu,
  Mic,
  MicOff,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Search,
  Settings,
  Share,
  SkipBack,
  SkipForward,
  Trash,
  Underline,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useState } from "react";
import { IconButton } from "../components/ui/icon-button";

const meta: Meta<typeof IconButton> = {
  title: "UI/IconButton",
  component: IconButton,
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
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  render: () => <IconButton icon={<Settings />} label="Settings" />,
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <IconButton icon={<Settings />} label="Default" />
      <IconButton icon={<Settings />} label="Secondary" variant="secondary" />
      <IconButton icon={<Trash />} label="Destructive" variant="destructive" />
      <IconButton icon={<Settings />} label="Outline" variant="outline" />
      <IconButton icon={<Settings />} label="Ghost" variant="ghost" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <IconButton icon={<Settings />} label="Small" size="sm" />
      <IconButton icon={<Settings />} label="Default" />
      <IconButton icon={<Settings />} label="Large" size="lg" />
    </div>
  ),
};

export const TooltipPositions: Story = {
  name: "Tooltip Positions",
  render: () => (
    <div className="flex items-center gap-8">
      <IconButton icon={<Settings />} label="Top tooltip" tooltipSide="top" />
      <IconButton
        icon={<Settings />}
        label="Right tooltip"
        tooltipSide="right"
      />
      <IconButton
        icon={<Settings />}
        label="Bottom tooltip"
        tooltipSide="bottom"
      />
      <IconButton icon={<Settings />} label="Left tooltip" tooltipSide="left" />
    </div>
  ),
};

export const WithoutTooltip: Story = {
  name: "Without Tooltip",
  render: () => (
    <IconButton icon={<Settings />} label="Settings" showTooltip={false} />
  ),
};

export const Toolbar: Story = {
  name: "Text Editor Toolbar",
  render: function ToolbarExample() {
    const [activeFormat, setActiveFormat] = useState<string[]>([]);

    const toggleFormat = (format: string) => {
      setActiveFormat((prev) =>
        prev.includes(format)
          ? prev.filter((f) => f !== format)
          : [...prev, format],
      );
    };

    const isActive = (format: string) => activeFormat.includes(format);

    return (
      <div className="flex items-center gap-1 rounded-lg border p-1">
        <IconButton
          icon={<Bold />}
          label="Bold"
          size="sm"
          variant={isActive("bold") ? "secondary" : "ghost"}
          onClick={() => toggleFormat("bold")}
        />
        <IconButton
          icon={<Italic />}
          label="Italic"
          size="sm"
          variant={isActive("italic") ? "secondary" : "ghost"}
          onClick={() => toggleFormat("italic")}
        />
        <IconButton
          icon={<Underline />}
          label="Underline"
          size="sm"
          variant={isActive("underline") ? "secondary" : "ghost"}
          onClick={() => toggleFormat("underline")}
        />
        <div className="mx-1 h-6 w-px bg-border" />
        <IconButton
          icon={<AlignLeft />}
          label="Align Left"
          size="sm"
          variant="ghost"
        />
        <IconButton
          icon={<AlignCenter />}
          label="Align Center"
          size="sm"
          variant="ghost"
        />
        <IconButton
          icon={<AlignRight />}
          label="Align Right"
          size="sm"
          variant="ghost"
        />
      </div>
    );
  },
};

export const ActionButtons: Story = {
  name: "Action Buttons Row",
  render: () => (
    <div className="flex items-center gap-2">
      <IconButton icon={<Edit />} label="Edit" variant="ghost" size="sm" />
      <IconButton icon={<Copy />} label="Copy" variant="ghost" size="sm" />
      <IconButton icon={<Share />} label="Share" variant="ghost" size="sm" />
      <IconButton
        icon={<Trash />}
        label="Delete"
        variant="ghost"
        size="sm"
        className="text-destructive hover:text-destructive"
      />
    </div>
  ),
};

export const MediaPlayer: Story = {
  name: "Media Player Controls",
  render: function MediaPlayerExample() {
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);

    return (
      <div className="flex items-center gap-2 rounded-lg bg-muted p-4">
        <IconButton
          icon={<SkipBack />}
          label="Previous"
          variant="ghost"
          size="sm"
        />
        <IconButton
          icon={playing ? <Pause /> : <Play />}
          label={playing ? "Pause" : "Play"}
          onClick={() => setPlaying(!playing)}
        />
        <IconButton
          icon={<SkipForward />}
          label="Next"
          variant="ghost"
          size="sm"
        />
        <div className="mx-2 h-6 w-px bg-border" />
        <IconButton
          icon={muted ? <VolumeX /> : <Volume2 />}
          label={muted ? "Unmute" : "Mute"}
          variant="ghost"
          size="sm"
          onClick={() => setMuted(!muted)}
        />
      </div>
    );
  },
};

export const VideoCall: Story = {
  name: "Video Call Controls",
  render: function VideoCallExample() {
    const [micOn, setMicOn] = useState(true);
    const [videoOn, setVideoOn] = useState(true);

    return (
      <div className="flex items-center gap-3 rounded-full bg-gray-900 px-6 py-3">
        <IconButton
          icon={micOn ? <Mic /> : <MicOff />}
          label={micOn ? "Mute" : "Unmute"}
          variant={micOn ? "secondary" : "destructive"}
          onClick={() => setMicOn(!micOn)}
        />
        <IconButton
          icon={videoOn ? <Video /> : <VideoOff />}
          label={videoOn ? "Turn off camera" : "Turn on camera"}
          variant={videoOn ? "secondary" : "destructive"}
          onClick={() => setVideoOn(!videoOn)}
        />
        <IconButton
          icon={<X />}
          label="End call"
          variant="destructive"
          size="lg"
        />
      </div>
    );
  },
};

export const ImageViewer: Story = {
  name: "Image Viewer Controls",
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border p-2">
        <IconButton
          icon={<ChevronLeft />}
          label="Previous image"
          variant="ghost"
        />
        <div className="flex items-center gap-2">
          <IconButton icon={<ZoomOut />} label="Zoom out" variant="ghost" />
          <span className="min-w-[60px] text-center text-sm">100%</span>
          <IconButton icon={<ZoomIn />} label="Zoom in" variant="ghost" />
        </div>
        <IconButton
          icon={<ChevronRight />}
          label="Next image"
          variant="ghost"
        />
      </div>
    </div>
  ),
};

export const HeaderActions: Story = {
  name: "Header Actions",
  render: () => (
    <div className="flex w-full items-center justify-between rounded-lg border px-4 py-2">
      <IconButton icon={<Menu />} label="Menu" variant="ghost" />
      <div className="flex items-center gap-1">
        <IconButton icon={<Search />} label="Search" variant="ghost" />
        <IconButton icon={<Bell />} label="Notifications" variant="ghost" />
        <IconButton icon={<Settings />} label="Settings" variant="ghost" />
      </div>
    </div>
  ),
};

export const FloatingAction: Story = {
  name: "Floating Action Button",
  render: () => (
    <div className="relative h-40 w-full rounded-lg bg-muted">
      <IconButton
        icon={<Plus />}
        label="Add new item"
        size="lg"
        className="absolute bottom-4 right-4 rounded-full shadow-lg"
      />
    </div>
  ),
};

export const SocialActions: Story = {
  name: "Social Actions",
  render: function SocialExample() {
    const [liked, setLiked] = useState(false);

    return (
      <div className="flex items-center gap-2">
        <IconButton
          icon={<Heart className={liked ? "fill-red-500 text-red-500" : ""} />}
          label={liked ? "Unlike" : "Like"}
          variant="ghost"
          onClick={() => setLiked(!liked)}
        />
        <IconButton icon={<Share />} label="Share" variant="ghost" />
        <IconButton
          icon={<MoreHorizontal />}
          label="More options"
          variant="ghost"
        />
      </div>
    );
  },
};
