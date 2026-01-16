import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SearchInput } from "../components/ui/search-input";

const meta: Meta<typeof SearchInput> = {
  title: "UI/SearchInput",
  component: SearchInput,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-8">
        <div className="w-72">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  render: () => <SearchInput placeholder="Search..." />,
};

export const WithValue: Story = {
  name: "With Value",
  render: () => <SearchInput defaultValue="React components" />,
};

export const Loading: Story = {
  render: () => <SearchInput placeholder="Searching..." loading />,
};

export const Disabled: Story = {
  render: () => <SearchInput placeholder="Search..." disabled />,
};

export const Controlled: Story = {
  render: function ControlledExample() {
    const [value, setValue] = useState("");

    return (
      <div className="space-y-4">
        <SearchInput
          value={value}
          onValueChange={setValue}
          placeholder="Type to search..."
        />
        <p className="text-sm text-muted-foreground">
          Current value:{" "}
          <code className="rounded bg-muted px-1">{value || "(empty)"}</code>
        </p>
      </div>
    );
  },
};

export const WithCallback: Story = {
  name: "With Clear Callback",
  render: function CallbackExample() {
    const [lastAction, setLastAction] = useState<string>("");

    return (
      <div className="space-y-4">
        <SearchInput
          placeholder="Search..."
          defaultValue="Test query"
          onClear={() => setLastAction("Cleared!")}
          onValueChange={(val) => setLastAction(`Changed to: ${val}`)}
        />
        <p className="text-sm text-muted-foreground">
          Last action:{" "}
          <code className="rounded bg-muted px-1">
            {lastAction || "(none yet)"}
          </code>
        </p>
      </div>
    );
  },
};

export const WithoutClearButton: Story = {
  name: "Without Clear Button",
  render: () => (
    <SearchInput
      placeholder="Search..."
      defaultValue="No clear button"
      showClearButton={false}
    />
  ),
};

export const SearchResults: Story = {
  name: "Search Results Example",
  render: function SearchResultsExample() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);

    const items = [
      "React",
      "Vue",
      "Angular",
      "Svelte",
      "SolidJS",
      "Preact",
      "Next.js",
      "Nuxt",
    ];

    const filteredItems = query
      ? items.filter((item) => item.toLowerCase().includes(query.toLowerCase()))
      : items;

    const handleSearch = (value: string) => {
      setLoading(true);
      setQuery(value);
      // Simulate search delay
      setTimeout(() => setLoading(false), 300);
    };

    return (
      <div className="w-80 space-y-4">
        <SearchInput
          value={query}
          onValueChange={handleSearch}
          placeholder="Search frameworks..."
          loading={loading}
        />
        <div className="rounded-lg border">
          {filteredItems.length > 0 ? (
            <ul className="divide-y">
              {filteredItems.map((item) => (
                <li key={item} className="px-4 py-2 text-sm hover:bg-muted">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              No results found
            </p>
          )}
        </div>
      </div>
    );
  },
};
