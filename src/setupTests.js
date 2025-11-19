import "@testing-library/jest-dom";
import { vi } from "vitest";

const mockCanvasContext = {
  clearRect: () => {},
  canvas: { width: 1080, height: 1080 },
};

if (!HTMLCanvasElement.prototype.getContext) {
  Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
    value: () => mockCanvasContext,
  });
}

if (!HTMLCanvasElement.prototype.toDataURL) {
  Object.defineProperty(HTMLCanvasElement.prototype, "toDataURL", {
    value: () => "",
  });
}

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

if (typeof window !== "undefined" && typeof window.alert !== "function") {
  window.alert = vi.fn();
}
