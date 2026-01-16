import type { Meta, StoryObj } from "@storybook/react";
import { PasswordInput } from "../components/ui/password-input";

const meta: Meta<typeof PasswordInput> = {
  title: "UI/PasswordInput",
  component: PasswordInput,
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
type Story = StoryObj<typeof PasswordInput>;

export const Default: Story = {
  render: () => <PasswordInput placeholder="Enter password" />,
};

export const WithoutIcon: Story = {
  name: "Without Lock Icon",
  render: () => <PasswordInput placeholder="Enter password" showIcon={false} />,
};

export const WithValue: Story = {
  name: "With Default Value",
  render: () => (
    <PasswordInput placeholder="Enter password" defaultValue="secretpassword" />
  ),
};

export const Disabled: Story = {
  render: () => (
    <PasswordInput
      placeholder="Enter password"
      defaultValue="disabledpassword"
      disabled
    />
  ),
};

export const WithLabel: Story = {
  name: "With Label",
  render: () => (
    <div className="space-y-2">
      <label htmlFor="password" className="text-sm font-medium">
        Password
      </label>
      <PasswordInput id="password" placeholder="Enter your password" />
    </div>
  ),
};

export const LoginForm: Story = {
  name: "Login Form Example",
  render: () => (
    <form className="space-y-4 rounded-lg border p-6">
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-semibold">Sign In</h2>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to continue
        </p>
      </div>
      <div className="space-y-2">
        <label htmlFor="login-email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          placeholder="name@example.com"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="login-password" className="text-sm font-medium">
          Password
        </label>
        <PasswordInput id="login-password" placeholder="Enter your password" />
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Sign In
      </button>
    </form>
  ),
};
