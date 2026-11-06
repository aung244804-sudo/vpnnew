import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useState } from "react";
import { KeyRound, Eye, EyeOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { translate } from "@/lib/translations";

function ApiKeyInputHarness({ initialValue = "" }: { initialValue?: string }) {
  const [apiKey, setApiKey] = useState(initialValue);
  const [showKey, setShowKey] = useState(false);
  const t = (k: string) => translate("en", k);

  return (
    <div className="api-field">
      <KeyRound size={14} />
      <input
        aria-label={t("Gemini API key")}
        type={showKey ? "text" : "password"}
        placeholder={t("Gemini API key (optional)")}
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        autoComplete="off"
      />
      {apiKey && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="api-key-clear-btn"
          aria-label={t("Clear API key")}
          title={t("Clear API key")}
          onClick={() => setApiKey("")}
        >
          <X size={13} />
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        aria-label={showKey ? t("Hide API key") : t("Show API key")}
        title={showKey ? t("Hide API key") : t("Show API key")}
        onClick={() => setShowKey(!showKey)}
      >
        {showKey ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  );
}

describe("API key input clear button micro-UX", () => {
  it("does not render clear button when API key input is empty", () => {
    render(<ApiKeyInputHarness initialValue="" />);
    expect(screen.queryByRole("button", { name: "Clear API key" })).toBeNull();
  });

  it("renders accessible clear button when API key is present and clears input on click", () => {
    render(<ApiKeyInputHarness initialValue="AIzaSyTestKey123" />);
    const input = screen.getByLabelText("Gemini API key") as HTMLInputElement;
    expect(input.value).toBe("AIzaSyTestKey123");

    const clearBtn = screen.getByRole("button", { name: "Clear API key" });
    expect(clearBtn).toBeDefined();

    fireEvent.click(clearBtn);

    expect(input.value).toBe("");
    expect(screen.queryByRole("button", { name: "Clear API key" })).toBeNull();
  });

  it("provides Myanmar translation for Clear API key label", () => {
    expect(translate("my", "Clear API key")).toBe("API key ကို ရှင်းရန်");
  });
});
