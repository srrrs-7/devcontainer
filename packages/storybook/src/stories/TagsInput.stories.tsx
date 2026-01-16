import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TagsInput } from "../components/ui/tags-input";

const meta: Meta<typeof TagsInput> = {
  title: "UI/TagsInput",
  component: TagsInput,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center p-8">
        <div className="w-80">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TagsInput>;

export const Default: Story = {
  render: function DefaultExample() {
    const [tags, setTags] = useState<string[]>(["React", "TypeScript"]);
    return <TagsInput value={tags} onValueChange={setTags} />;
  },
};

export const WithLabel: Story = {
  name: "With Label",
  render: function WithLabelExample() {
    const [tags, setTags] = useState<string[]>(["Design", "Development"]);
    return (
      <TagsInput
        value={tags}
        onValueChange={setTags}
        label="Skills"
        description="Press Enter to add a tag"
      />
    );
  },
};

export const Empty: Story = {
  render: function EmptyExample() {
    const [tags, setTags] = useState<string[]>([]);
    return (
      <TagsInput
        value={tags}
        onValueChange={setTags}
        placeholder="Add your first tag..."
      />
    );
  },
};

export const WithMaxTags: Story = {
  name: "With Max Tags",
  render: function MaxTagsExample() {
    const [tags, setTags] = useState<string[]>(["Tag 1", "Tag 2", "Tag 3"]);
    return (
      <div className="space-y-4">
        <TagsInput
          value={tags}
          onValueChange={setTags}
          maxTags={5}
          label="Tags (max 5)"
        />
        <p className="text-sm text-muted-foreground">
          {tags.length}/5 tags used
        </p>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: function DisabledExample() {
    const [tags, setTags] = useState<string[]>(["Read", "Only", "Tags"]);
    return (
      <TagsInput
        value={tags}
        onValueChange={setTags}
        disabled
        label="Disabled"
      />
    );
  },
};

export const AllowDuplicates: Story = {
  name: "Allow Duplicates",
  render: function DuplicatesExample() {
    const [tags, setTags] = useState<string[]>(["Duplicate"]);
    return (
      <TagsInput
        value={tags}
        onValueChange={setTags}
        allowDuplicates
        label="Allow Duplicates"
        description="You can add the same tag multiple times"
      />
    );
  },
};

export const BlogPostTags: Story = {
  name: "Blog Post Tags",
  render: function BlogExample() {
    const [tags, setTags] = useState<string[]>([
      "javascript",
      "web-development",
    ]);

    return (
      <div className="w-full space-y-4 rounded-lg border p-4">
        <h3 className="font-medium">Edit Post</h3>
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <input
            type="text"
            defaultValue="Getting Started with React Hooks"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <TagsInput
          value={tags}
          onValueChange={setTags}
          maxTags={5}
          label="Tags"
          description="Add up to 5 tags to categorize your post"
        />
      </div>
    );
  },
};

export const EmailRecipients: Story = {
  name: "Email Recipients",
  render: function EmailExample() {
    const [recipients, setRecipients] = useState<string[]>([
      "john@example.com",
      "jane@example.com",
    ]);

    return (
      <div className="w-full space-y-4 rounded-lg border p-4">
        <h3 className="font-medium">Send Email</h3>
        <TagsInput
          value={recipients}
          onValueChange={setRecipients}
          label="To"
          placeholder="Add email address..."
        />
        <div className="space-y-2">
          <label className="text-sm font-medium">Subject</label>
          <input
            type="text"
            placeholder="Enter subject..."
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <button
          type="button"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Send to {recipients.length} recipient(s)
        </button>
      </div>
    );
  },
};

export const SkillsSelection: Story = {
  name: "Skills Selection",
  render: function SkillsExample() {
    const [skills, setSkills] = useState<string[]>([
      "React",
      "TypeScript",
      "Node.js",
    ]);
    const suggestedSkills = [
      "GraphQL",
      "PostgreSQL",
      "Docker",
      "AWS",
      "Python",
    ];

    const addSuggested = (skill: string) => {
      if (!skills.includes(skill)) {
        setSkills([...skills, skill]);
      }
    };

    return (
      <div className="w-full space-y-4">
        <TagsInput
          value={skills}
          onValueChange={setSkills}
          label="Your Skills"
          description="Add skills to showcase your expertise"
        />
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Suggested skills:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedSkills
              .filter((s) => !skills.includes(s))
              .map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => addSuggested(skill)}
                  className="rounded-full border px-3 py-1 text-xs hover:bg-muted"
                >
                  + {skill}
                </button>
              ))}
          </div>
        </div>
      </div>
    );
  },
};
