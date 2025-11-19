import { render, screen, fireEvent } from "@testing-library/react";
import BannerHeader from "../components/layout/BannerHeader";

describe("BannerHeader", () => {
  const baseProps = {
    activeModeConfig: { title: "Football Mode", subtitle: "All matches" },
    activeMode: "football",
    onModeChange: vi.fn(),
    lastRenderAt: new Date("2024-01-01T12:00:00Z"),
    options: [
      { id: "football", label: "Football" },
      { id: "togel", label: "Togel" },
    ],
  };

  it("renders header text and mode buttons", () => {
    render(<BannerHeader {...baseProps} />);

    expect(screen.getByText("Football Mode")).toBeInTheDocument();
    expect(screen.getByText("All matches")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Football" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Togel" })).toBeInTheDocument();
  });

  it("calls onModeChange when button clicked", () => {
    render(<BannerHeader {...baseProps} />);
    fireEvent.click(screen.getByRole("button", { name: "Togel" }));
    expect(baseProps.onModeChange).toHaveBeenCalledWith("togel");
  });
});
