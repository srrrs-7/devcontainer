import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { NumberStepper } from "../components/ui/number-stepper";

const meta: Meta<typeof NumberStepper> = {
  title: "UI/NumberStepper",
  component: NumberStepper,
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
type Story = StoryObj<typeof NumberStepper>;

export const Default: Story = {
  render: function DefaultExample() {
    const [value, setValue] = useState(1);
    return <NumberStepper value={value} onValueChange={setValue} />;
  },
};

export const WithLabel: Story = {
  name: "With Label",
  render: function WithLabelExample() {
    const [value, setValue] = useState(1);
    return (
      <NumberStepper value={value} onValueChange={setValue} label="Quantity" />
    );
  },
};

export const WithMinMax: Story = {
  name: "With Min/Max",
  render: function MinMaxExample() {
    const [value, setValue] = useState(5);
    return (
      <div className="space-y-4">
        <NumberStepper
          value={value}
          onValueChange={setValue}
          min={1}
          max={10}
          label="Rating (1-10)"
        />
        <p className="text-sm text-muted-foreground">
          Min: 1, Max: 10, Current: {value}
        </p>
      </div>
    );
  },
};

export const WithStep: Story = {
  name: "With Custom Step",
  render: function StepExample() {
    const [value, setValue] = useState(0);
    return (
      <div className="space-y-4">
        <NumberStepper
          value={value}
          onValueChange={setValue}
          step={5}
          label="Quantity (step: 5)"
        />
        <p className="text-sm text-muted-foreground">Current value: {value}</p>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: function SizesExample() {
    const [sm, setSm] = useState(1);
    const [md, setMd] = useState(1);
    const [lg, setLg] = useState(1);

    return (
      <div className="space-y-6">
        <NumberStepper
          value={sm}
          onValueChange={setSm}
          size="sm"
          label="Small"
        />
        <NumberStepper
          value={md}
          onValueChange={setMd}
          size="default"
          label="Default"
        />
        <NumberStepper
          value={lg}
          onValueChange={setLg}
          size="lg"
          label="Large"
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: function DisabledExample() {
    const [value, setValue] = useState(5);
    return (
      <NumberStepper
        value={value}
        onValueChange={setValue}
        disabled
        label="Disabled"
      />
    );
  },
};

export const ProductQuantity: Story = {
  name: "Product Quantity Selector",
  render: function ProductExample() {
    const [quantity, setQuantity] = useState(1);
    const price = 29.99;
    const total = (quantity * price).toFixed(2);

    return (
      <div className="w-72 space-y-4 rounded-lg border p-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded bg-muted" />
          <div>
            <h3 className="font-medium">Product Name</h3>
            <p className="text-sm text-muted-foreground">${price}/each</p>
          </div>
        </div>
        <NumberStepper
          value={quantity}
          onValueChange={setQuantity}
          min={1}
          max={99}
          size="sm"
          label="Quantity"
        />
        <div className="flex items-center justify-between border-t pt-4">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-lg font-semibold">${total}</span>
        </div>
      </div>
    );
  },
};

export const GuestCounter: Story = {
  name: "Guest Counter",
  render: function GuestExample() {
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [rooms, setRooms] = useState(1);

    return (
      <div className="w-72 space-y-4 rounded-lg border p-4">
        <h3 className="font-medium">Guests & Rooms</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Adults</p>
              <p className="text-xs text-muted-foreground">Ages 13+</p>
            </div>
            <NumberStepper
              value={adults}
              onValueChange={setAdults}
              min={1}
              max={10}
              size="sm"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Children</p>
              <p className="text-xs text-muted-foreground">Ages 2-12</p>
            </div>
            <NumberStepper
              value={children}
              onValueChange={setChildren}
              min={0}
              max={6}
              size="sm"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Rooms</p>
            </div>
            <NumberStepper
              value={rooms}
              onValueChange={setRooms}
              min={1}
              max={5}
              size="sm"
            />
          </div>
        </div>
        <div className="border-t pt-4 text-sm text-muted-foreground">
          Total: {adults + children} guests, {rooms} room(s)
        </div>
      </div>
    );
  },
};
