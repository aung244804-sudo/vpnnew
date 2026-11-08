import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SettingsPanel } from "@/components/client/SettingsPanel";
import { defaultSettings, type ServerNode } from "@/lib/v2ray";
import { translate } from "@/lib/translations";

const mockNode: ServerNode = {
  id: "test-node-1",
  name: "Singapore Fast",
  protocol: "vless",
  address: "sg.example.com",
  port: 443,
  credential: "user-id-uuid",
  flag: "🇸🇬",
  country: "Singapore",
  params: {},
};

describe("SettingsPanel export UX enhancements", () => {
  it("renders disabled export buttons with explanatory title, aria-describedby, and hint text when no server is selected", () => {
    render(
      <SettingsPanel
        settings={defaultSettings}
        onChange={vi.fn()}
        node={null}
        onOpenVpnSettings={vi.fn()}
      />,
    );

    const exportBtn = screen.getByRole("button", { name: "EXPORT XRAY JSON" });
    const copyBtn = screen.getByRole("button", { name: "COPY CONFIGURATION" });

    expect(exportBtn).toBeDisabled();
    expect(copyBtn).toBeDisabled();

    expect(exportBtn).toHaveAttribute("title", "Select a server before exporting.");
    expect(copyBtn).toHaveAttribute("title", "Select a server before exporting.");

    expect(exportBtn).toHaveAttribute("aria-describedby", "export-disabled-hint");
    expect(copyBtn).toHaveAttribute("aria-describedby", "export-disabled-hint");

    const hint = screen.getByText("Select a server before exporting.");
    expect(hint).toBeInTheDocument();
    expect(hint).toHaveAttribute("id", "export-disabled-hint");
  });

  it("enables export buttons and provides visual feedback when copied with a selected server", async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(
      <SettingsPanel
        settings={defaultSettings}
        onChange={vi.fn()}
        node={mockNode}
        onOpenVpnSettings={vi.fn()}
      />,
    );

    const exportBtn = screen.getByRole("button", { name: "EXPORT XRAY JSON" });
    const copyBtn = screen.getByRole("button", { name: "COPY CONFIGURATION" });

    expect(exportBtn).not.toBeDisabled();
    expect(copyBtn).not.toBeDisabled();
    expect(exportBtn).not.toHaveAttribute("aria-describedby");
    expect(screen.queryByText("Select a server before exporting.")).toBeNull();

    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.getByText("Configuration copied.")).toBeInTheDocument();
    });
  });

  it("has Myanmar translations for export strings", () => {
    expect(translate("my", "Select a server before exporting.")).toBe(
      "မထုတ်ယူမီ ဆာဗာတစ်ခုကို ရွေးပါ။",
    );
    expect(translate("my", "Configuration copied.")).toBe("Configuration ကူးယူပြီး။");
  });
});
