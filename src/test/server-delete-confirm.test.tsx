import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ServerManager } from "@/components/client/ServerManager";
import { translate } from "@/lib/translations";
import type { ServerNode } from "@/lib/v2ray";

const mockNode: ServerNode = {
  id: "test-node-1",
  name: "Singapore Fast SG-1",
  address: "sg1.example.com",
  port: 443,
  protocol: "vless",
  flag: "🇸🇬",
  country: "Singapore",
  ping: 45,
};

describe("Server deletion confirmation dialog micro-UX", () => {
  it("shows confirmation dialog before deleting and does not delete when cancelled", async () => {
    const onDelete = vi.fn();
    const onSelect = vi.fn();
    const onAdd = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <ServerManager
        open={true}
        onOpenChange={onOpenChange}
        nodes={[mockNode]}
        selected="test-node-1"
        onSelect={onSelect}
        onAdd={onAdd}
        onDelete={onDelete}
        protocols={["vless"]}
      />
    );

    // Switch to "My servers" view
    const myServersBtn = screen.getByRole("button", { name: /My servers/i });
    fireEvent.click(myServersBtn);

    // The delete button is rendered with accessible localized label
    const deleteBtn = screen.getByRole("button", {
      name: `Delete server: ${mockNode.name}`,
    });
    expect(deleteBtn).toBeDefined();

    // Clicking delete opens the confirmation dialog and does not immediately call onDelete
    fireEvent.click(deleteBtn);
    expect(onDelete).not.toHaveBeenCalled();

    // Confirmation dialog is open
    expect(screen.getByText("Delete server?")).toBeDefined();
    expect(
      screen.getByText(/This will remove the server configuration from your saved list\./i)
    ).toBeDefined();

    // Clicking cancel closes the dialog without calling onDelete
    const cancelBtn = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelBtn);

    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.queryByText("Delete server?")).toBeNull();
  });

  it("deletes the server when confirmation action is confirmed", async () => {
    const onDelete = vi.fn();
    const onSelect = vi.fn();
    const onAdd = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <ServerManager
        open={true}
        onOpenChange={onOpenChange}
        nodes={[mockNode]}
        selected="test-node-1"
        onSelect={onSelect}
        onAdd={onAdd}
        onDelete={onDelete}
        protocols={["vless"]}
      />
    );

    // Switch to "My servers"
    fireEvent.click(screen.getByRole("button", { name: /My servers/i }));

    // Click delete button
    const deleteBtn = screen.getByRole("button", {
      name: `Delete server: ${mockNode.name}`,
    });
    fireEvent.click(deleteBtn);

    // Click the confirmation Delete button in dialog
    const confirmDeleteBtn = screen.getByRole("button", { name: "Delete" });
    fireEvent.click(confirmDeleteBtn);

    // onDelete must have been called with the node id
    expect(onDelete).toHaveBeenCalledWith("test-node-1");
  });

  it("provides Myanmar translations for delete confirmation dialog strings", () => {
    expect(translate("my", "Delete server?")).toBe("ဆာဗာကို ဖျက်မလား။");
    expect(
      translate("my", "This will remove the server configuration from your saved list.")
    ).toBe("ဤဆာဗာ configuration ကို သိမ်းဆည်းထားသည့် စာရင်းမှ ဖယ်ရှားပါမည်။");
    expect(translate("my", "Delete")).toBe("ဖျက်ရန်");
    expect(translate("my", "Cancel")).toBe("မလုပ်တော့ပါ");
  });
});
