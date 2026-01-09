import { beforeEach, describe, expect, test } from "vitest";
import { testFunc } from "./func";

describe("testFunc", () => {
  beforeEach(() => {
    // Setup if needed
  });

  test("should return the correct string", () => {
    const result = testFunc();
    expect(result).toBe("This is a test function");
  });
});
