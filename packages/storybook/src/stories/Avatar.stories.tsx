import type { Meta, StoryObj } from "@storybook/react";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

const meta: Meta<typeof Avatar> = {
  title: "UI/Avatar",
  component: Avatar,
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
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const WithFallback: Story = {
  name: "With Fallback",
  render: () => (
    <Avatar>
      <AvatarImage src="https://invalid-url.com/broken.png" alt="Fallback" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

export const IconFallback: Story = {
  name: "Icon Fallback",
  render: () => (
    <Avatar>
      <AvatarImage src="https://invalid-url.com/broken.png" />
      <AvatarFallback>
        <User className="h-5 w-5" />
      </AvatarFallback>
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar className="h-6 w-6">
        <AvatarImage src="https://github.com/shadcn.png" alt="XS" />
        <AvatarFallback className="text-xs">XS</AvatarFallback>
      </Avatar>
      <Avatar className="h-8 w-8">
        <AvatarImage src="https://github.com/shadcn.png" alt="SM" />
        <AvatarFallback className="text-sm">SM</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="MD" />
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar className="h-14 w-14">
        <AvatarImage src="https://github.com/shadcn.png" alt="LG" />
        <AvatarFallback className="text-lg">LG</AvatarFallback>
      </Avatar>
      <Avatar className="h-20 w-20">
        <AvatarImage src="https://github.com/shadcn.png" alt="XL" />
        <AvatarFallback className="text-2xl">XL</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const Group: Story = {
  name: "Avatar Group",
  render: () => (
    <div className="flex -space-x-4">
      <Avatar className="border-2 border-background">
        <AvatarImage src="https://i.pravatar.cc/150?u=1" alt="User 1" />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarImage src="https://i.pravatar.cc/150?u=2" alt="User 2" />
        <AvatarFallback>U2</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarImage src="https://i.pravatar.cc/150?u=3" alt="User 3" />
        <AvatarFallback>U3</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarFallback>+5</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const WithStatus: Story = {
  name: "With Status Indicator",
  render: () => (
    <div className="flex items-center gap-6">
      <div className="relative">
        <Avatar>
          <AvatarImage src="https://i.pravatar.cc/150?u=online" alt="Online" />
          <AvatarFallback>ON</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
      </div>

      <div className="relative">
        <Avatar>
          <AvatarImage src="https://i.pravatar.cc/150?u=away" alt="Away" />
          <AvatarFallback>AW</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-yellow-500 ring-2 ring-background" />
      </div>

      <div className="relative">
        <Avatar>
          <AvatarImage src="https://i.pravatar.cc/150?u=busy" alt="Busy" />
          <AvatarFallback>BS</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-background" />
      </div>

      <div className="relative">
        <Avatar>
          <AvatarImage
            src="https://i.pravatar.cc/150?u=offline"
            alt="Offline"
          />
          <AvatarFallback>OF</AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-gray-400 ring-2 ring-background" />
      </div>
    </div>
  ),
};

export const UserCard: Story = {
  name: "User Card",
  render: () => (
    <div className="flex items-center gap-4 rounded-lg border p-4">
      <Avatar className="h-12 w-12">
        <AvatarImage src="https://i.pravatar.cc/150?u=user" alt="John Doe" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-medium">John Doe</p>
        <p className="text-xs text-muted-foreground">john@example.com</p>
      </div>
    </div>
  ),
};

export const WithTooltip: Story = {
  name: "With Tooltip",
  render: () => (
    <TooltipProvider>
      <div className="flex -space-x-3">
        {[
          {
            name: "Alice Smith",
            initials: "AS",
            src: "https://i.pravatar.cc/150?u=alice",
          },
          {
            name: "Bob Johnson",
            initials: "BJ",
            src: "https://i.pravatar.cc/150?u=bob",
          },
          {
            name: "Carol Williams",
            initials: "CW",
            src: "https://i.pravatar.cc/150?u=carol",
          },
        ].map((user) => (
          <Tooltip key={user.name}>
            <TooltipTrigger asChild>
              <Avatar className="border-2 border-background cursor-pointer transition-transform hover:z-10 hover:scale-110">
                <AvatarImage src={user.src} alt={user.name} />
                <AvatarFallback>{user.initials}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>{user.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  ),
};

export const ColorfulFallbacks: Story = {
  name: "Colorful Fallbacks",
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarFallback className="bg-red-500 text-white">AB</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-orange-500 text-white">CD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-green-500 text-white">EF</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-blue-500 text-white">GH</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-purple-500 text-white">IJ</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-pink-500 text-white">KL</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const Squared: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar className="rounded-md">
        <AvatarImage src="https://github.com/shadcn.png" alt="Squared" />
        <AvatarFallback className="rounded-md">CN</AvatarFallback>
      </Avatar>
      <Avatar className="rounded-lg">
        <AvatarImage src="https://github.com/shadcn.png" alt="Rounded" />
        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
      </Avatar>
      <Avatar className="rounded-none">
        <AvatarImage src="https://github.com/shadcn.png" alt="Square" />
        <AvatarFallback className="rounded-none">CN</AvatarFallback>
      </Avatar>
    </div>
  ),
};
