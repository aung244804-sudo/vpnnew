import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { SettingsPanel } from "@/components/client/SettingsPanel";
import { defaultSettings, type ServerNode } from "@/lib/v2ray";
import { translate } from "@/lib/translations";

const mockNode: ServerNode = {
  id: "test-node-1",
  name: "Singapore Test Node",
  protocol: "vless",
  address: "sg.test.node",
  port: 443,
  country: "Singapore",
  flag: "🇸🇬",
  ping: 45,
  params: { id: "11111111-2222-3333-4444-555555555555" },
};

describe("Settings export micro-UX", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("displays helpful explanation when export buttons are disabled without selected server", () => {
    render(
      <SettingsPanel
        settings={defaultSettings}
        onChange={() => {}}
        node={null}
        onOpenVpnSettings={() => {}}
      />,
    );

    const exportBtn = screen.getByRole("button", { name: /EXPORT XRAY JSON/i });
    const copyBtn = screen.getByRole("button", { name: /COPY CONFIGURATION/i });

    expect(exportBtn).toBeDisabled();
    expect(copyBtn).toBeDisabled();

    expect(screen.getByText("Select a server before exporting.")).toBeInTheDocument();
  });

  it("hides disabled explanation when a server is selected", () => {
    render(
      <SettingsPanel
        settings={defaultSettings}
        onChange={() => {}}
        node={mockNode}
        onOpenVpnSettings={() => {}}
      />,
    );

    expect(screen.queryByText("Select a server before exporting.")).toBeNull();

    const copyBtn = screen.getByRole("button", { name: /COPY CONFIGURATION/i });
    expect(copyBtn).not.toBeDisabled();
  });

  it("updates copy button state to COPIED! temporarily upon successful copy", async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(
      <SettingsPanel
        settings={defaultSettings}
        onChange={() => {}}
        node={mockNode}
        onOpenVpnSettings={() => {}}
      />,
    );

    const copyBtn = screen.getByRole("button", { name: /COPY CONFIGURATION/i });

    await act(async () => {
      fireEvent.click(copyBtn);
    });

    expect(writeTextMock).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: /COPIED!/i })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.queryByRole("button", { name: /COPIED!/i })).toBeNull();
    expect(screen.getByRole("button", { name: /COPY CONFIGURATION/i })).toBeInTheDocument();
  });

  it("provides Myanmar translations for copy feedback and export helper", () => {
    expect(translate("my", "COPIED!")).toBe("ကူးယူပြီး!");
    expect(translate("my", "Select a server before exporting.")).toBe(
      "မထုတ်ယူမီ ဆာဗာတစ်ခုကို ရွေးပါ။",
    );
  });
});
