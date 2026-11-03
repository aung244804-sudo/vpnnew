import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PublicDirectory } from "@/components/client/PublicDirectory";
import { LanguageProvider } from "@/components/client/LanguageProvider";
import { translate } from "@/lib/translations";

describe("PublicDirectory search clear micro-UX", () => {
  it("renders search input with accessible placeholder and without clear button when empty", () => {
    render(
      <LanguageProvider>
        <PublicDirectory onImport={vi.fn()} protocols={["vless", "vmess"]} />
      </LanguageProvider>
    );

    const input = screen.getByRole("textbox", { name: "Search public servers" }) as HTMLInputElement;
    expect(input).toBeDefined();
    expect(input.value).toBe("");
    expect(screen.queryByRole("button", { name: "Clear search" })).toBeNull();
  });

  it("shows accessible clear button when text is entered, and clears search when clicked", () => {
    render(
      <LanguageProvider>
        <PublicDirectory onImport={vi.fn()} protocols={["vless", "vmess"]} />
      </LanguageProvider>
    );

    const input = screen.getByRole("textbox", { name: "Search public servers" }) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Singapore" } });
    expect(input.value).toBe("Singapore");

    const clearButton = screen.getByRole("button", { name: "Clear search" });
    expect(clearButton).toBeDefined();

    fireEvent.click(clearButton);

    expect(input.value).toBe("");
    expect(screen.queryByRole("button", { name: "Clear search" })).toBeNull();
  });

  it("provides Myanmar translation for Clear search label", () => {
    expect(translate("my", "Clear search")).toBe("ရှာဖွေမှုကို ရှင်းရန်");
  });
});
