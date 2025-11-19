import "@testing-library/jest-dom";

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

if (typeof global.ResizeObserver === "undefined") {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
