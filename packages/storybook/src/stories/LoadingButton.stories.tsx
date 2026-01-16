import type { Meta, StoryObj } from "@storybook/react";
import { Download, Mail, RefreshCw, Save, Send, Upload } from "lucide-react";
import { useState } from "react";
import { LoadingButton } from "../components/ui/loading-button";

const meta: Meta<typeof LoadingButton> = {
  title: "UI/LoadingButton",
  component: LoadingButton,
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
type Story = StoryObj<typeof LoadingButton>;

export const Default: Story = {
  render: () => <LoadingButton>Submit</LoadingButton>,
};

export const Loading: Story = {
  render: () => <LoadingButton loading>Submit</LoadingButton>,
};

export const WithLoadingText: Story = {
  name: "With Loading Text",
  render: () => (
    <LoadingButton loading loadingText="Submitting...">
      Submit
    </LoadingButton>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <LoadingButton loading>Default</LoadingButton>
      <LoadingButton loading variant="secondary">
        Secondary
      </LoadingButton>
      <LoadingButton loading variant="destructive">
        Destructive
      </LoadingButton>
      <LoadingButton loading variant="outline">
        Outline
      </LoadingButton>
      <LoadingButton loading variant="ghost">
        Ghost
      </LoadingButton>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <LoadingButton loading size="sm">
        Small
      </LoadingButton>
      <LoadingButton loading>Default</LoadingButton>
      <LoadingButton loading size="lg">
        Large
      </LoadingButton>
    </div>
  ),
};

export const WithIcon: Story = {
  name: "With Icon",
  render: () => (
    <div className="flex flex-wrap gap-4">
      <LoadingButton>
        <Mail className="mr-2 h-4 w-4" />
        Send Email
      </LoadingButton>
      <LoadingButton loading loadingText="Sending...">
        <Mail className="mr-2 h-4 w-4" />
        Send Email
      </LoadingButton>
    </div>
  ),
};

export const Interactive: Story = {
  render: function InteractiveExample() {
    const [loading, setLoading] = useState(false);

    const handleClick = () => {
      setLoading(true);
      setTimeout(() => setLoading(false), 2000);
    };

    return (
      <LoadingButton loading={loading} onClick={handleClick}>
        <Save className="mr-2 h-4 w-4" />
        Save Changes
      </LoadingButton>
    );
  },
};

export const FormSubmission: Story = {
  name: "Form Submission Example",
  render: function FormExample() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = () => {
      setLoading(true);
      setSuccess(false);
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
      }, 2000);
    };

    return (
      <div className="w-72 space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-md border px-3 py-2 text-sm"
            disabled={loading}
          />
        </div>
        <LoadingButton
          className="w-full"
          loading={loading}
          loadingText="Subscribing..."
          onClick={handleSubmit}
        >
          <Send className="mr-2 h-4 w-4" />
          Subscribe
        </LoadingButton>
        {success && (
          <p className="text-center text-sm text-green-600">
            Successfully subscribed!
          </p>
        )}
      </div>
    );
  },
};

export const FileUpload: Story = {
  name: "File Upload Example",
  render: function UploadExample() {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleUpload = () => {
      setUploading(true);
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploading(false);
            return 0;
          }
          return prev + 10;
        });
      }, 200);
    };

    return (
      <div className="space-y-4">
        <LoadingButton
          loading={uploading}
          loadingText={`Uploading ${progress}%...`}
          onClick={handleUpload}
          variant="outline"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </LoadingButton>
      </div>
    );
  },
};

export const DataRefresh: Story = {
  name: "Data Refresh Example",
  render: function RefreshExample() {
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const handleRefresh = () => {
      setRefreshing(true);
      setTimeout(() => {
        setRefreshing(false);
        setLastUpdated(new Date());
      }, 1500);
    };

    return (
      <div className="space-y-2">
        <LoadingButton
          loading={refreshing}
          loadingText="Refreshing..."
          onClick={handleRefresh}
          variant="ghost"
          size="sm"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Data
        </LoadingButton>
        {lastUpdated && (
          <p className="text-xs text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>
    );
  },
};

export const DownloadButton: Story = {
  name: "Download Button Example",
  render: function DownloadExample() {
    const [downloading, setDownloading] = useState(false);

    const handleDownload = () => {
      setDownloading(true);
      setTimeout(() => setDownloading(false), 3000);
    };

    return (
      <LoadingButton
        loading={downloading}
        loadingText="Preparing download..."
        onClick={handleDownload}
        variant="secondary"
      >
        <Download className="mr-2 h-4 w-4" />
        Download Report
      </LoadingButton>
    );
  },
};
