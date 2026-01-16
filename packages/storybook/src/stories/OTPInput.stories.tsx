import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { OTPInput } from "../components/ui/otp-input";

const meta: Meta<typeof OTPInput> = {
  title: "UI/OTPInput",
  component: OTPInput,
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
type Story = StoryObj<typeof OTPInput>;

export const Default: Story = {
  render: function DefaultExample() {
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
    return <OTPInput value={otp} onValueChange={setOtp} />;
  },
};

export const FourDigit: Story = {
  name: "4-Digit Code",
  render: function FourDigitExample() {
    const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
    return <OTPInput value={otp} onValueChange={setOtp} length={4} />;
  },
};

export const WithValue: Story = {
  name: "With Prefilled Value",
  render: function PrefilledExample() {
    const [otp, setOtp] = useState<string[]>(["1", "2", "3", "4", "5", "6"]);
    return <OTPInput value={otp} onValueChange={setOtp} />;
  },
};

export const Disabled: Story = {
  render: function DisabledExample() {
    const [otp, setOtp] = useState<string[]>(["1", "2", "3", "4", "5", "6"]);
    return <OTPInput value={otp} onValueChange={setOtp} disabled />;
  },
};

export const AutoFocus: Story = {
  name: "Auto Focus",
  render: function AutoFocusExample() {
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
    return <OTPInput value={otp} onValueChange={setOtp} autoFocus />;
  },
};

export const VerificationFlow: Story = {
  name: "Verification Flow",
  render: function VerificationExample() {
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
    const [status, setStatus] = useState<
      "idle" | "loading" | "success" | "error"
    >("idle");

    const isComplete = otp.every((digit) => digit !== "");

    const handleVerify = () => {
      setStatus("loading");
      setTimeout(() => {
        if (otp.join("") === "123456") {
          setStatus("success");
        } else {
          setStatus("error");
          setOtp(["", "", "", "", "", ""]);
        }
      }, 1500);
    };

    return (
      <div className="w-80 space-y-6 text-center">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Enter verification code</h3>
          <p className="text-sm text-muted-foreground">
            We sent a 6-digit code to your email
          </p>
        </div>

        <OTPInput
          value={otp}
          onValueChange={setOtp}
          disabled={status === "loading" || status === "success"}
        />

        {status === "error" && (
          <p className="text-sm text-destructive">
            Invalid code. Please try again.
          </p>
        )}

        {status === "success" && (
          <p className="text-sm text-green-600">Verification successful!</p>
        )}

        <Button
          onClick={handleVerify}
          disabled={!isComplete || status === "loading" || status === "success"}
          className="w-full"
        >
          {status === "loading" ? "Verifying..." : "Verify Code"}
        </Button>

        <p className="text-xs text-muted-foreground">
          Hint: Try code "123456" for success
        </p>
      </div>
    );
  },
};

export const PhoneVerification: Story = {
  name: "Phone Verification",
  render: function PhoneExample() {
    const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
    const [resendTimer, setResendTimer] = useState(30);

    const handleResend = () => {
      setResendTimer(30);
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    return (
      <div className="w-72 space-y-6 rounded-lg border p-6 text-center">
        <div className="space-y-2">
          <h3 className="font-semibold">Verify your phone</h3>
          <p className="text-sm text-muted-foreground">
            Enter the 4-digit code sent to
            <br />
            <span className="font-medium text-foreground">
              +1 (555) ***-7890
            </span>
          </p>
        </div>

        <OTPInput value={otp} onValueChange={setOtp} length={4} />

        <div className="space-y-2">
          <Button className="w-full" disabled={!otp.every((d) => d)}>
            Confirm
          </Button>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendTimer > 0}
            className="text-sm text-muted-foreground hover:text-foreground disabled:cursor-not-allowed"
          >
            {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Resend code"}
          </button>
        </div>
      </div>
    );
  },
};

export const TwoFactorAuth: Story = {
  name: "Two-Factor Authentication",
  render: function TwoFactorExample() {
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

    return (
      <div className="w-80 space-y-6 rounded-lg border p-6">
        <div className="space-y-2 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h3 className="font-semibold">Two-Factor Authentication</h3>
          <p className="text-sm text-muted-foreground">
            Enter the code from your authenticator app
          </p>
        </div>

        <OTPInput value={otp} onValueChange={setOtp} />

        <div className="space-y-2">
          <Button className="w-full">Verify</Button>
          <p className="text-center text-xs text-muted-foreground">
            Can't access your authenticator?{" "}
            <a href="#" className="text-primary hover:underline">
              Use backup code
            </a>
          </p>
        </div>
      </div>
    );
  },
};
