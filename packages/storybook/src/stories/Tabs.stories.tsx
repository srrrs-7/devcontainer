import type { Meta, StoryObj } from "@storybook/react";
import {
  Bell,
  Calendar,
  Code,
  CreditCard,
  FileText,
  Folder,
  Grid,
  Image,
  Inbox,
  LayoutDashboard,
  List,
  Lock,
  Mail,
  MessageSquare,
  Music,
  Package,
  Play,
  Settings,
  Star,
  User,
  Video,
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
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui";

const meta: Meta<typeof Tabs> = {
  title: "UI/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

// ============================================
// Basic Examples
// ============================================

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-full">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="space-y-4">
        <h3 className="text-lg font-medium">Account Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </TabsContent>
      <TabsContent value="password" className="space-y-4">
        <h3 className="text-lg font-medium">Password</h3>
        <p className="text-sm text-muted-foreground">
          Change your password and security settings.
        </p>
      </TabsContent>
      <TabsContent value="settings" className="space-y-4">
        <h3 className="text-lg font-medium">Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure application settings.
        </p>
      </TabsContent>
    </Tabs>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Tabs defaultValue="active" className="w-full">
      <TabsList>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          Disabled
        </TabsTrigger>
        <TabsTrigger value="another">Another</TabsTrigger>
      </TabsList>
      <TabsContent value="active">
        <p className="p-4 text-sm text-muted-foreground">
          This tab is active and enabled.
        </p>
      </TabsContent>
      <TabsContent value="another">
        <p className="p-4 text-sm text-muted-foreground">
          This is another enabled tab.
        </p>
      </TabsContent>
    </Tabs>
  ),
};

// ============================================
// With Icons
// ============================================

export const WithIcons: Story = {
  name: "With Icons",
  render: () => (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Profile</span>
        </TabsTrigger>
        <TabsTrigger value="billing" className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          <span className="hidden sm:inline">Billing</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Settings</span>
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">Alerts</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your personal details here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input defaultValue="John Doe" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" defaultValue="john@example.com" />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="billing">
        <Card>
          <CardHeader>
            <CardTitle>Billing Settings</CardTitle>
            <CardDescription>Manage your billing information.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your current plan: <strong>Pro ($29/mo)</strong>
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Configure your preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Settings content here.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="notifications">
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Choose what notifications you receive.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Notification settings here.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

export const IconOnly: Story = {
  name: "Icon Only",
  render: () => (
    <Tabs defaultValue="grid" className="w-full">
      <TabsList>
        <TabsTrigger value="grid">
          <Grid className="h-4 w-4" />
        </TabsTrigger>
        <TabsTrigger value="list">
          <List className="h-4 w-4" />
        </TabsTrigger>
        <TabsTrigger value="folder">
          <Folder className="h-4 w-4" />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="grid" className="mt-4">
        <p className="text-sm text-muted-foreground">Grid view selected</p>
      </TabsContent>
      <TabsContent value="list" className="mt-4">
        <p className="text-sm text-muted-foreground">List view selected</p>
      </TabsContent>
      <TabsContent value="folder" className="mt-4">
        <p className="text-sm text-muted-foreground">Folder view selected</p>
      </TabsContent>
    </Tabs>
  ),
};

// ============================================
// With Badge/Counter
// ============================================

export const WithBadge: Story = {
  name: "With Badge",
  render: () => (
    <Tabs defaultValue="inbox" className="w-full">
      <TabsList>
        <TabsTrigger value="inbox" className="flex items-center gap-2">
          <Inbox className="h-4 w-4" />
          Inbox
          <Badge variant="secondary" className="ml-1 h-5 px-1.5">
            12
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="sent" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Sent
        </TabsTrigger>
        <TabsTrigger value="starred" className="flex items-center gap-2">
          <Star className="h-4 w-4" />
          Starred
          <Badge variant="secondary" className="ml-1 h-5 px-1.5">
            3
          </Badge>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="inbox" className="mt-4">
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4 flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={`https://i.pravatar.cc/150?u=mail${i}`} />
                  <AvatarFallback>U{i}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">Message Subject {i}</p>
                  <p className="text-sm text-muted-foreground">
                    Preview text...
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">2h ago</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="sent" className="mt-4">
        <p className="text-sm text-muted-foreground">Sent messages</p>
      </TabsContent>
      <TabsContent value="starred" className="mt-4">
        <p className="text-sm text-muted-foreground">Starred messages</p>
      </TabsContent>
    </Tabs>
  ),
};

// ============================================
// Underline Style
// ============================================

export const Underline: Story = {
  name: "Underline Style",
  render: () => (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
        <TabsTrigger
          value="overview"
          className="rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
        >
          Overview
        </TabsTrigger>
        <TabsTrigger
          value="analytics"
          className="rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
        >
          Analytics
        </TabsTrigger>
        <TabsTrigger
          value="reports"
          className="rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
        >
          Reports
        </TabsTrigger>
        <TabsTrigger
          value="settings"
          className="rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
        >
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="pt-6">
        <h3 className="text-lg font-medium mb-2">Overview</h3>
        <p className="text-sm text-muted-foreground">
          Get a quick summary of your project's performance.
        </p>
      </TabsContent>
      <TabsContent value="analytics" className="pt-6">
        <h3 className="text-lg font-medium mb-2">Analytics</h3>
        <p className="text-sm text-muted-foreground">
          Detailed analytics and metrics.
        </p>
      </TabsContent>
      <TabsContent value="reports" className="pt-6">
        <h3 className="text-lg font-medium mb-2">Reports</h3>
        <p className="text-sm text-muted-foreground">
          Generate and download reports.
        </p>
      </TabsContent>
      <TabsContent value="settings" className="pt-6">
        <h3 className="text-lg font-medium mb-2">Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure your preferences.
        </p>
      </TabsContent>
    </Tabs>
  ),
};

// ============================================
// Pill Style
// ============================================

export const PillStyle: Story = {
  name: "Pill Style",
  render: () => (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="bg-transparent gap-2 p-0">
        <TabsTrigger
          value="all"
          className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          All
        </TabsTrigger>
        <TabsTrigger
          value="active"
          className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          Active
        </TabsTrigger>
        <TabsTrigger
          value="completed"
          className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          Completed
        </TabsTrigger>
        <TabsTrigger
          value="archived"
          className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          Archived
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="mt-4">
        <p className="text-sm text-muted-foreground">Showing all items</p>
      </TabsContent>
      <TabsContent value="active" className="mt-4">
        <p className="text-sm text-muted-foreground">Showing active items</p>
      </TabsContent>
      <TabsContent value="completed" className="mt-4">
        <p className="text-sm text-muted-foreground">Showing completed items</p>
      </TabsContent>
      <TabsContent value="archived" className="mt-4">
        <p className="text-sm text-muted-foreground">Showing archived items</p>
      </TabsContent>
    </Tabs>
  ),
};

// ============================================
// Vertical Tabs
// ============================================

export const Vertical: Story = {
  name: "Vertical Layout",
  render: () => (
    <div className="flex gap-6">
      <Tabs
        defaultValue="general"
        orientation="vertical"
        className="flex gap-6"
      >
        <TabsList className="flex-col h-auto bg-transparent">
          <TabsTrigger
            value="general"
            className="justify-start w-full data-[state=active]:bg-muted"
          >
            <Settings className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="justify-start w-full data-[state=active]:bg-muted"
          >
            <Lock className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="justify-start w-full data-[state=active]:bg-muted"
          >
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            className="justify-start w-full data-[state=active]:bg-muted"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </TabsTrigger>
        </TabsList>
        <div className="flex-1">
          <TabsContent value="general" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Manage your general preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Display Name</label>
                    <Input defaultValue="John Doe" />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input defaultValue="john@example.com" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="security" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Manage your security settings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="notifications" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Configure notification preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Notification settings here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="billing" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Billing</CardTitle>
                <CardDescription>
                  Manage your billing information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Billing details here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  ),
};

// ============================================
// Controlled Tabs
// ============================================

export const Controlled: Story = {
  render: function ControlledTabs() {
    const [tab, setTab] = useState("tab1");
    return (
      <div className="space-y-4">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content for Tab 1</TabsContent>
          <TabsContent value="tab2">Content for Tab 2</TabsContent>
          <TabsContent value="tab3">Content for Tab 3</TabsContent>
        </Tabs>
        <p className="text-sm text-muted-foreground">
          Active tab: <code className="bg-muted px-1 rounded">{tab}</code>
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setTab("tab1")}>
            Go to Tab 1
          </Button>
          <Button variant="outline" size="sm" onClick={() => setTab("tab2")}>
            Go to Tab 2
          </Button>
          <Button variant="outline" size="sm" onClick={() => setTab("tab3")}>
            Go to Tab 3
          </Button>
        </div>
      </div>
    );
  },
};

// ============================================
// Media Library
// ============================================

export const MediaLibrary: Story = {
  name: "Media Library",
  render: () => (
    <Tabs defaultValue="images" className="w-full">
      <div className="flex items-center justify-between mb-4">
        <TabsList>
          <TabsTrigger value="images" className="gap-2">
            <Image className="h-4 w-4" />
            Images
          </TabsTrigger>
          <TabsTrigger value="videos" className="gap-2">
            <Video className="h-4 w-4" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="audio" className="gap-2">
            <Music className="h-4 w-4" />
            Audio
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
        </TabsList>
        <Button size="sm">Upload</Button>
      </div>
      <TabsContent value="images">
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="aspect-square rounded-lg bg-muted flex items-center justify-center"
            >
              <Image className="h-8 w-8 text-muted-foreground" />
            </div>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="videos">
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-video rounded-lg bg-muted flex items-center justify-center"
            >
              <Play className="h-8 w-8 text-muted-foreground" />
            </div>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="audio">
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3 rounded-lg border"
            >
              <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                <Music className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Audio File {i}.mp3</p>
                <p className="text-xs text-muted-foreground">3:45</p>
              </div>
              <Button variant="ghost" size="icon">
                <Play className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="documents">
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3 rounded-lg border"
            >
              <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Document {i}.pdf</p>
                <p className="text-xs text-muted-foreground">2.4 MB</p>
              </div>
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  ),
};

// ============================================
// Dashboard Tabs
// ============================================

export const Dashboard: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="analytics">
          <Calendar className="mr-2 h-4 w-4" />
          Analytics
        </TabsTrigger>
        <TabsTrigger value="activity">
          <MessageSquare className="mr-2 h-4 w-4" />
          Activity
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-4 pt-4">
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">Total Users</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">$12,345</div>
              <p className="text-xs text-muted-foreground">Revenue</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">89%</div>
              <p className="text-xs text-muted-foreground">Satisfaction</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="analytics" className="pt-4">
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>View detailed analytics data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center bg-muted rounded-lg">
              Chart placeholder
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="activity" className="pt-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={`https://i.pravatar.cc/150?u=activity${i}`}
                  />
                  <AvatarFallback>U{i}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    User {i} performed an action
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

// ============================================
// Code Editor Style
// ============================================

export const CodeEditor: Story = {
  name: "Code Editor Style",
  render: () => (
    <Tabs defaultValue="index" className="w-full">
      <TabsList className="w-full justify-start rounded-none border-b bg-muted/50 p-0">
        <TabsTrigger
          value="index"
          className="relative rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-mono text-sm data-[state=active]:border-primary data-[state=active]:bg-background"
        >
          <Code className="mr-2 h-4 w-4" />
          index.tsx
        </TabsTrigger>
        <TabsTrigger
          value="styles"
          className="relative rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-mono text-sm data-[state=active]:border-primary data-[state=active]:bg-background"
        >
          <Code className="mr-2 h-4 w-4" />
          styles.css
        </TabsTrigger>
        <TabsTrigger
          value="package"
          className="relative rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-mono text-sm data-[state=active]:border-primary data-[state=active]:bg-background"
        >
          <Package className="mr-2 h-4 w-4" />
          package.json
        </TabsTrigger>
      </TabsList>
      <TabsContent value="index" className="mt-0 border-0 p-0">
        <pre className="p-4 bg-muted rounded-b-lg font-mono text-sm overflow-x-auto">
          {`import React from 'react'

export function App() {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  )
}`}
        </pre>
      </TabsContent>
      <TabsContent value="styles" className="mt-0 border-0 p-0">
        <pre className="p-4 bg-muted rounded-b-lg font-mono text-sm overflow-x-auto">
          {`.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}`}
        </pre>
      </TabsContent>
      <TabsContent value="package" className="mt-0 border-0 p-0">
        <pre className="p-4 bg-muted rounded-b-lg font-mono text-sm overflow-x-auto">
          {`{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^19.0.0"
  }
}`}
        </pre>
      </TabsContent>
    </Tabs>
  ),
};

// ============================================
// Full Width
// ============================================

export const FullWidth: Story = {
  name: "Full Width",
  render: () => (
    <Tabs defaultValue="tab1" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="tab1">First Tab</TabsTrigger>
        <TabsTrigger value="tab2">Second Tab</TabsTrigger>
        <TabsTrigger value="tab3">Third Tab</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <Card>
          <CardContent className="pt-6">Content for first tab</CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="tab2">
        <Card>
          <CardContent className="pt-6">Content for second tab</CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="tab3">
        <Card>
          <CardContent className="pt-6">Content for third tab</CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};
