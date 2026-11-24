import { describe, expect, it } from "vitest";

import {
  SIDEBAR_DEFAULT,
  SIDEBAR_MAX,
  SIDEBAR_MIN,
  clampSidebarWidth,
} from "@/hooks/use-sidebar-resize";

describe("Sidebar resize limits", () => {
  it("keeps a dragged width inside the usable range", () => {
    expect(clampSidebarWidth(900)).toBe(SIDEBAR_MAX);
    expect(clampSidebarWidth(40)).toBe(SIDEBAR_MIN);
  });

  it("keeps a width already inside the range unchanged", () => {
    expect(clampSidebarWidth(337)).toBe(337);
    expect(clampSidebarWidth(SIDEBAR_MIN)).toBe(SIDEBAR_MIN);
    expect(clampSidebarWidth(SIDEBAR_MAX)).toBe(SIDEBAR_MAX);
  });

  it("falls back to the default when the saved value is unusable", () => {
    expect(clampSidebarWidth(Number.NaN)).toBe(SIDEBAR_DEFAULT);
  });
});
