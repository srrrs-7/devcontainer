import type { Meta, StoryObj } from "@storybook/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Grid,
  Italic,
  List,
  Redo,
  Save,
  Share,
  Underline,
  Undo,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { ButtonGroup } from "../components/ui/button-group";

const meta: Meta<typeof ButtonGroup> = {
  title: "UI/ButtonGroup",
  component: ButtonGroup,
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
type Story = StoryObj<typeof ButtonGroup>;

export const Default: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="outline">Left</Button>
      <Button variant="outline">Center</Button>
      <Button variant="outline">Right</Button>
    </ButtonGroup>
  ),
};

export const TwoButtons: Story = {
  name: "Two Buttons",
  render: () => (
    <ButtonGroup>
      <Button variant="outline">Previous</Button>
      <Button variant="outline">Next</Button>
    </ButtonGroup>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ButtonGroup variant="default">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
      <ButtonGroup variant="secondary">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
      <ButtonGroup variant="outline">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <ButtonGroup size="sm" variant="outline">
        <Button>Small</Button>
        <Button>Group</Button>
      </ButtonGroup>
      <ButtonGroup variant="outline">
        <Button>Default</Button>
        <Button>Group</Button>
      </ButtonGroup>
      <ButtonGroup size="lg" variant="outline">
        <Button>Large</Button>
        <Button>Group</Button>
      </ButtonGroup>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <ButtonGroup orientation="vertical" variant="outline">
      <Button>Top</Button>
      <Button>Middle</Button>
      <Button>Bottom</Button>
    </ButtonGroup>
  ),
};

export const IconButtons: Story = {
  name: "Icon Buttons",
  render: () => (
    <ButtonGroup variant="outline">
      <Button size="icon">
        <Bold className="h-4 w-4" />
      </Button>
      <Button size="icon">
        <Italic className="h-4 w-4" />
      </Button>
      <Button size="icon">
        <Underline className="h-4 w-4" />
      </Button>
    </ButtonGroup>
  ),
};

export const TextAlignment: Story = {
  name: "Text Alignment Toggle",
  render: function AlignmentExample() {
    const [alignment, setAlignment] = useState<"left" | "center" | "right">(
      "left",
    );

    return (
      <ButtonGroup variant="outline">
        <Button
          size="icon"
          variant={alignment === "left" ? "secondary" : "outline"}
          onClick={() => setAlignment("left")}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={alignment === "center" ? "secondary" : "outline"}
          onClick={() => setAlignment("center")}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={alignment === "right" ? "secondary" : "outline"}
          onClick={() => setAlignment("right")}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </ButtonGroup>
    );
  },
};

export const ViewToggle: Story = {
  name: "View Toggle",
  render: function ViewToggleExample() {
    const [view, setView] = useState<"list" | "grid">("list");

    return (
      <ButtonGroup variant="outline">
        <Button
          size="icon"
          variant={view === "list" ? "secondary" : "outline"}
          onClick={() => setView("list")}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={view === "grid" ? "secondary" : "outline"}
          onClick={() => setView("grid")}
        >
          <Grid className="h-4 w-4" />
        </Button>
      </ButtonGroup>
    );
  },
};

export const Pagination: Story = {
  name: "Pagination Controls",
  render: function PaginationExample() {
    const [page, setPage] = useState(1);
    const totalPages = 10;

    return (
      <div className="flex items-center gap-4">
        <ButtonGroup variant="outline">
          <Button
            size="icon"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button className="pointer-events-none min-w-[100px]">
            Page {page} of {totalPages}
          </Button>
          <Button
            size="icon"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </ButtonGroup>
      </div>
    );
  },
};

export const SplitButton: Story = {
  name: "Split Button",
  render: () => (
    <ButtonGroup>
      <Button>
        <Save className="mr-2 h-4 w-4" />
        Save
      </Button>
      <Button size="icon">
        <ChevronDown className="h-4 w-4" />
      </Button>
    </ButtonGroup>
  ),
};

export const UndoRedo: Story = {
  name: "Undo/Redo Controls",
  render: () => (
    <ButtonGroup variant="ghost">
      <Button size="icon">
        <Undo className="h-4 w-4" />
      </Button>
      <Button size="icon">
        <Redo className="h-4 w-4" />
      </Button>
    </ButtonGroup>
  ),
};

export const ActionMenu: Story = {
  name: "Action Menu",
  render: () => (
    <ButtonGroup variant="outline">
      <Button>
        <Share className="mr-2 h-4 w-4" />
        Share
      </Button>
      <Button>
        <Copy className="mr-2 h-4 w-4" />
        Copy
      </Button>
    </ButtonGroup>
  ),
};

export const SegmentedControl: Story = {
  name: "Segmented Control",
  render: function SegmentedExample() {
    const [selected, setSelected] = useState("day");

    const options = [
      { value: "day", label: "Day" },
      { value: "week", label: "Week" },
      { value: "month", label: "Month" },
      { value: "year", label: "Year" },
    ];

    return (
      <ButtonGroup variant="outline">
        {options.map((option) => (
          <Button
            key={option.value}
            variant={selected === option.value ? "default" : "outline"}
            onClick={() => setSelected(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </ButtonGroup>
    );
  },
};

export const VerticalNavigation: Story = {
  name: "Vertical Navigation",
  render: function NavExample() {
    const [active, setActive] = useState("dashboard");

    return (
      <ButtonGroup orientation="vertical" variant="ghost" className="w-48">
        <Button
          variant={active === "dashboard" ? "secondary" : "ghost"}
          className="justify-start"
          onClick={() => setActive("dashboard")}
        >
          Dashboard
        </Button>
        <Button
          variant={active === "analytics" ? "secondary" : "ghost"}
          className="justify-start"
          onClick={() => setActive("analytics")}
        >
          Analytics
        </Button>
        <Button
          variant={active === "reports" ? "secondary" : "ghost"}
          className="justify-start"
          onClick={() => setActive("reports")}
        >
          Reports
        </Button>
        <Button
          variant={active === "settings" ? "secondary" : "ghost"}
          className="justify-start"
          onClick={() => setActive("settings")}
        >
          Settings
        </Button>
      </ButtonGroup>
    );
  },
};
