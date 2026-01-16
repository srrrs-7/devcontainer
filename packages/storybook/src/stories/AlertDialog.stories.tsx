import type { Meta, StoryObj } from "@storybook/react";
import {
  AlertCircle,
  AlertTriangle,
  Archive,
  Ban,
  Check,
  Clock,
  CreditCard,
  Download,
  FileText,
  HardDrive,
  Key,
  Loader2,
  Lock,
  LogOut,
  Mail,
  RefreshCw,
  Send,
  Server,
  Settings,
  Shield,
  ShieldAlert,
  Trash2,
  Upload,
  UserMinus,
  UserX,
  Wifi,
  WifiOff,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const meta: Meta<typeof AlertDialog> = {
  title: "UI/AlertDialog",
  component: AlertDialog,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="flex min-h-[400px] items-center justify-center p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AlertDialog>;

// =============================================================================
// Basic Examples
// =============================================================================

export const Default: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

// =============================================================================
// Destructive Actions
// =============================================================================

export const DeleteConfirmation: Story = {
  name: "Delete Confirmation",
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Item
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Delete this item?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action is permanent and cannot be reversed. All associated data
            will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep Item</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const DeleteAccount: Story = {
  name: "Delete Account",
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <UserX className="h-5 w-5 text-destructive" />
            Delete your account?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your account and all associated data
            including:
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3">
          <ul className="space-y-1 text-sm text-destructive">
            <li>• All your projects and files</li>
            <li>• Your profile and settings</li>
            <li>• Payment history and subscriptions</li>
            <li>• Team memberships</li>
          </ul>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Yes, Delete My Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const RemoveTeamMember: Story = {
  name: "Remove Team Member",
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserMinus className="mr-2 h-4 w-4" />
          Remove
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove team member?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove <strong>John Doe</strong> from the
            team? They will lose access to all team resources immediately.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Remove Member
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

// =============================================================================
// Warning Dialogs
// =============================================================================

export const UnsavedChanges: Story = {
  name: "Unsaved Changes",
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Leave Page</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Unsaved Changes
          </AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes that will be lost if you leave this page.
            Do you want to save your changes before leaving?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:space-x-2">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="border border-input bg-background hover:bg-accent hover:text-accent-foreground">
            Don't Save
          </AlertDialogAction>
          <AlertDialogAction>Save Changes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const DataLoss: Story = {
  name: "Data Loss Warning",
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Clear Data</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            Clear all data?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will clear all cached data and reset the application to its
            default state. Your account and saved preferences will not be
            affected.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-yellow-500 text-white hover:bg-yellow-500/90">
            Clear Data
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

// =============================================================================
// Auth Actions
// =============================================================================

export const Logout: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <LogOut className="h-5 w-5" />
            Sign out?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to sign out? You will need to sign in again to
            access your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Stay Signed In</AlertDialogCancel>
          <AlertDialogAction>Sign Out</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const SessionExpired: Story = {
  name: "Session Expired",
  render: () => (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            Session Expired
          </AlertDialogTitle>
          <AlertDialogDescription>
            Your session has expired due to inactivity. Please sign in again to
            continue.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Sign In Again</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const ChangePassword: Story = {
  name: "Change Password",
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Key className="mr-2 h-4 w-4" />
          Change Password
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Change Password
          </AlertDialogTitle>
          <AlertDialogDescription>
            After changing your password, you will be signed out of all devices
            and will need to sign in again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

// =============================================================================
// With Input Confirmation
// =============================================================================

export const TypeToConfirm: Story = {
  name: "Type to Confirm",
  render: function TypeConfirmExample() {
    const [inputValue, setInputValue] = useState("");
    const confirmText = "delete my account";

    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete Account</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-destructive" />
              Confirm Account Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action is irreversible. To confirm, please type{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm">
                {confirmText}
              </code>{" "}
              below.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Type "${confirmText}"`}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setInputValue("")}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={inputValue !== confirmText}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
};

// =============================================================================
// Loading State
// =============================================================================

export const WithLoading: Story = {
  name: "With Loading State",
  render: function LoadingExample() {
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = () => {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 2000);
    };

    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete Item</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this item?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
};

// =============================================================================
// Success/Error States
// =============================================================================

export const SuccessDialog: Story = {
  name: "Success Dialog",
  render: () => (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <AlertDialogTitle className="text-center">
            Successfully Deleted
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            The item has been permanently removed from your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogAction>Done</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const ErrorDialog: Story = {
  name: "Error Dialog",
  render: () => (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <AlertDialogTitle className="text-center">
            Something went wrong
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            We couldn't complete your request. Please try again later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogCancel>Close</AlertDialogCancel>
          <AlertDialogAction>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

// =============================================================================
// System Actions
// =============================================================================

export const RestartServer: Story = {
  name: "Restart Server",
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Server className="mr-2 h-4 w-4" />
          Restart Server
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Restart Server?
          </AlertDialogTitle>
          <AlertDialogDescription>
            The server will be unavailable for approximately 30 seconds during
            the restart. All active connections will be terminated.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4 flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <span className="text-sm">
            Active users: <strong>12</strong>
          </span>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Restart Now</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const DisableFeature: Story = {
  name: "Disable Feature",
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Ban className="mr-2 h-4 w-4" />
          Disable Feature
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Disable this feature?</AlertDialogTitle>
          <AlertDialogDescription>
            Disabling this feature will affect all users in your organization.
            You can re-enable it at any time from the settings.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Disable Feature</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

// =============================================================================
// Payment & Subscription
// =============================================================================

export const CancelSubscription: Story = {
  name: "Cancel Subscription",
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Cancel Subscription</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel your subscription?</AlertDialogTitle>
          <AlertDialogDescription>
            You will lose access to premium features at the end of your current
            billing period (January 31, 2026).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4 space-y-2 rounded-lg border p-3">
          <div className="flex items-center justify-between text-sm">
            <span>Current plan</span>
            <Badge>Pro - $19/month</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Access until</span>
            <span className="font-medium">January 31, 2026</span>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Cancel Subscription
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const UpgradeRequired: Story = {
  name: "Upgrade Required",
  render: () => (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <Zap className="h-6 w-6 text-yellow-600" />
          </div>
          <AlertDialogTitle className="text-center">
            Upgrade Required
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            You've reached the limit of your free plan. Upgrade to Pro to unlock
            unlimited access and premium features.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogCancel>Maybe Later</AlertDialogCancel>
          <AlertDialogAction>
            <CreditCard className="mr-2 h-4 w-4" />
            Upgrade Now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

// =============================================================================
// File Operations
// =============================================================================

export const OverwriteFile: Story = {
  name: "Overwrite File",
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            File already exists
          </AlertDialogTitle>
          <AlertDialogDescription>
            A file named <strong>document.pdf</strong> already exists in this
            location. Do you want to replace it?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep Both</AlertDialogCancel>
          <AlertDialogAction>Replace File</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const ArchiveProject: Story = {
  name: "Archive Project",
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Archive className="mr-2 h-4 w-4" />
          Archive Project
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Archive this project?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Archived projects are moved to the archive folder and won't appear
            in your dashboard. You can restore them at any time.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Archive Project</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

// =============================================================================
// Network & Connection
// =============================================================================

export const OfflineMode: Story = {
  name: "Offline Mode",
  render: () => (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <WifiOff className="h-6 w-6 text-gray-600" />
          </div>
          <AlertDialogTitle className="text-center">
            You're offline
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Some features may not be available. Your changes will be synced when
            you're back online.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogAction>
            <Wifi className="mr-2 h-4 w-4" />
            Check Connection
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

// =============================================================================
// Security
// =============================================================================

export const RevokeAccess: Story = {
  name: "Revoke Access",
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Lock className="mr-2 h-4 w-4" />
          Revoke Access
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Revoke API Access?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will immediately revoke the API key's access. Any applications
            using this key will no longer be able to authenticate.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4 rounded-lg border bg-muted/50 p-3">
          <div className="text-sm">
            <p className="font-medium">API Key</p>
            <code className="text-xs text-muted-foreground">sk-...7f3d</code>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Revoke Access
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

// =============================================================================
// Storage
// =============================================================================

export const StorageFull: Story = {
  name: "Storage Full",
  render: () => (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <HardDrive className="h-6 w-6 text-red-600" />
          </div>
          <AlertDialogTitle className="text-center">
            Storage Almost Full
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            You've used 95% of your storage. Delete some files or upgrade your
            plan to continue uploading.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4">
          <div className="mb-2 flex justify-between text-sm">
            <span>Storage used</span>
            <span className="font-medium">9.5 GB / 10 GB</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div className="h-2 w-[95%] rounded-full bg-red-500" />
          </div>
        </div>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogCancel>Manage Files</AlertDialogCancel>
          <AlertDialogAction>Upgrade Storage</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

// =============================================================================
// Email & Notifications
// =============================================================================

export const SendEmail: Story = {
  name: "Send Email",
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <Send className="mr-2 h-4 w-4" />
          Send Email
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send this email?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This email will be sent to <strong>156 recipients</strong>. This
            action cannot be undone once the email is sent.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>
            <Send className="mr-2 h-4 w-4" />
            Send Email
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

// =============================================================================
// Export & Download
// =============================================================================

export const ExportData: Story = {
  name: "Export Data",
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export your data?
          </AlertDialogTitle>
          <AlertDialogDescription>
            We'll prepare your data export and send a download link to your
            email. This may take a few minutes depending on the size of your
            data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4 space-y-2 rounded-lg border p-3 text-sm">
          <div className="flex items-center justify-between">
            <span>Format</span>
            <Badge variant="secondary">JSON</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Estimated size</span>
            <span className="font-medium">~45 MB</span>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Start Export</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

// =============================================================================
// Settings
// =============================================================================

export const ResetSettings: Story = {
  name: "Reset Settings",
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Reset to Defaults
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Reset all settings?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will reset all your preferences and settings to their default
            values. Your data and files will not be affected.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Reset Settings</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};
