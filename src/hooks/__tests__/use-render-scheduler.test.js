import { act, renderHook } from "@testing-library/react-hooks";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import useRenderScheduler from "../use-render-scheduler";

describe("useRenderScheduler", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(window, "setTimeout");
    vi.spyOn(window, "clearTimeout");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("debounces multiple rapid calls into a single render", () => {
    const renderFn = vi.fn();
    const { result } = renderHook(() => useRenderScheduler(renderFn, { delay: 100 }));

    act(() => {
      result.current();
      result.current();
      result.current();
    });

    expect(renderFn).not.toHaveBeenCalled();
    expect(window.clearTimeout).toHaveBeenCalledTimes(2);

    vi.advanceTimersByTime(100);
    expect(renderFn).toHaveBeenCalledTimes(1);
  });

  it("executes callback after the configured delay", () => {
    const renderFn = vi.fn();
    const { result } = renderHook(() => useRenderScheduler(renderFn, { delay: 200 }));

    act(() => result.current());

    vi.advanceTimersByTime(150);
    expect(renderFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(renderFn).toHaveBeenCalledTimes(1);
  });

  it("cancels previous timeout when a new call is scheduled", () => {
    const renderFn = vi.fn();
    const { result } = renderHook(() => useRenderScheduler(renderFn, { delay: 80 }));

    act(() => result.current());
    act(() => result.current());

    expect(window.clearTimeout).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(80);
    expect(renderFn).toHaveBeenCalledTimes(1);
  });

  it("respects render lock and resumes when released", () => {
    const renderFn = vi.fn();
    const renderLockRef = { current: true };
    const { result } = renderHook(() => useRenderScheduler(renderFn, { renderLockRef, delay: 50 }));

    act(() => result.current());
    vi.advanceTimersByTime(50);
    expect(renderFn).not.toHaveBeenCalled();

    renderLockRef.current = false;
    act(() => result.current());
    vi.advanceTimersByTime(50);
    expect(renderFn).toHaveBeenCalledTimes(1);
  });

  it("cleans up pending timeouts on unmount", () => {
    const renderFn = vi.fn();
    const { result, unmount } = renderHook(() => useRenderScheduler(renderFn, { delay: 120 }));

    act(() => result.current());
    unmount();

    expect(window.clearTimeout).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(200);
    expect(renderFn).not.toHaveBeenCalled();
  });

  it("does not execute after unmount", () => {
    const renderFn = vi.fn();
    const { result, unmount } = renderHook(() => useRenderScheduler(renderFn));

    act(() => result.current());
    unmount();

    vi.runAllTimers();
    expect(renderFn).not.toHaveBeenCalled();
  });

  it("preserves the latest render function reference", () => {
    const initialRender = vi.fn();
    const nextRender = vi.fn();
    const { result, rerender } = renderHook(
      ({ renderFn }) => useRenderScheduler(renderFn, { delay: 60 }),
      { initialProps: { renderFn: initialRender } }
    );

    act(() => result.current());
    rerender({ renderFn: nextRender });

    vi.advanceTimersByTime(60);
    expect(initialRender).not.toHaveBeenCalled();
    expect(nextRender).toHaveBeenCalledTimes(1);
  });
});

