import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import App from "../App";

vi.mock("../utils/canvas-utils", () => ({
  CanvasUtils: {
    drawBackground: vi.fn(),
    drawOverlay: vi.fn(),
    drawBrandLogo: vi.fn(() => 0),
    drawHeader: vi.fn(() => 0),
    drawFooter: vi.fn(),
  },
}));

describe("App", () => {
  it("renders form and preview panel", async () => {
    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { level: 2, name: /Preview Banner/i })
      ).toBeInTheDocument();
    });

    const previewButtons = screen.getAllByRole("button", {
      name: /Preview Banner/i,
    });
    expect(previewButtons.length).toBeGreaterThan(0);
    expect(
      screen.getByPlaceholderText(/Masukkan judul liga/i)
    ).toBeInTheDocument();
  });
});
