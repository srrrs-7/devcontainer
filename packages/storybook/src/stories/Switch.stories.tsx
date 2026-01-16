import type { Meta, StoryObj } from "@storybook/react";
import { Bell, Bluetooth, Moon, Plane, Sun, Wifi } from "lucide-react";
import { useState } from "react";
import { Switch } from "../components/ui/switch";

const meta: Meta<typeof Switch> = {
  title: "UI/Switch",
  component: Switch,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  render: () => <Switch />,
};

export const WithLabel: Story = {
  name: "With Label",
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <label
        htmlFor="airplane-mode"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Airplane Mode
      </label>
    </div>
  ),
};

export const Checked: Story = {
  render: () => <Switch defaultChecked />,
};

export const Disabled: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch disabled />
        <label className="text-sm text-muted-foreground">Disabled (off)</label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch disabled defaultChecked />
        <label className="text-sm text-muted-foreground">Disabled (on)</label>
      </div>
    </div>
  ),
};

export const Controlled: Story = {
  render: function ControlledSwitch() {
    const [checked, setChecked] = useState(false);
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch checked={checked} onCheckedChange={setChecked} />
          <label className="text-sm font-medium">
            {checked ? "On" : "Off"}
          </label>
        </div>
        <p className="text-sm text-muted-foreground">
          Current state:{" "}
          <code className="bg-muted px-1 rounded">{String(checked)}</code>
        </p>
      </div>
    );
  },
};

export const DarkMode: Story = {
  name: "Dark Mode Toggle",
  render: function DarkModeToggle() {
    const [isDark, setIsDark] = useState(false);
    return (
      <div className="flex items-center space-x-3">
        <Sun className="h-4 w-4 text-muted-foreground" />
        <Switch checked={isDark} onCheckedChange={setIsDark} />
        <Moon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm ml-2">{isDark ? "Dark" : "Light"} Mode</span>
      </div>
    );
  },
};

export const SettingsList: Story = {
  name: "Settings List",
  render: function SettingsList() {
    const [settings, setSettings] = useState({
      notifications: true,
      wifi: true,
      bluetooth: false,
      airplane: false,
    });

    const updateSetting = (key: keyof typeof settings) => (value: boolean) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    };

    return (
      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center space-x-3">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Notifications</p>
              <p className="text-xs text-muted-foreground">
                Receive push notifications
              </p>
            </div>
          </div>
          <Switch
            checked={settings.notifications}
            onCheckedChange={updateSetting("notifications")}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center space-x-3">
            <Wifi className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Wi-Fi</p>
              <p className="text-xs text-muted-foreground">
                Connect to wireless networks
              </p>
            </div>
          </div>
          <Switch
            checked={settings.wifi}
            onCheckedChange={updateSetting("wifi")}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center space-x-3">
            <Bluetooth className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Bluetooth</p>
              <p className="text-xs text-muted-foreground">
                Connect to Bluetooth devices
              </p>
            </div>
          </div>
          <Switch
            checked={settings.bluetooth}
            onCheckedChange={updateSetting("bluetooth")}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center space-x-3">
            <Plane className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Airplane Mode</p>
              <p className="text-xs text-muted-foreground">
                Disable all wireless connections
              </p>
            </div>
          </div>
          <Switch
            checked={settings.airplane}
            onCheckedChange={updateSetting("airplane")}
          />
        </div>
      </div>
    );
  },
};

export const FormExample: Story = {
  name: "Form Integration",
  render: () => (
    <form className="space-y-6 w-full max-w-md">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Email Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <label htmlFor="marketing" className="text-sm font-medium">
                Marketing emails
              </label>
              <p className="text-xs text-muted-foreground">
                Receive emails about new products, features, and more.
              </p>
            </div>
            <Switch id="marketing" defaultChecked />
          </div>
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <label htmlFor="security" className="text-sm font-medium">
                Security emails
              </label>
              <p className="text-xs text-muted-foreground">
                Receive emails about your account security.
              </p>
            </div>
            <Switch id="security" defaultChecked disabled />
          </div>
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <label htmlFor="updates" className="text-sm font-medium">
                Product updates
              </label>
              <p className="text-xs text-muted-foreground">
                Get notified when we release new features.
              </p>
            </div>
            <Switch id="updates" />
          </div>
        </div>
      </div>
    </form>
  ),
};
