import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { SettingsPanel } from '@/components/client/SettingsPanel';
import { defaultSettings, type ServerNode } from '@/lib/v2ray';
import { translate } from '@/lib/translations';

const mockNode: ServerNode = {
  id: 'test-node-1',
  name: 'Singapore Fast VLESS',
  protocol: 'vless',
  address: 'sg.example.com',
  port: 443,
  country: 'SG',
  flag: '🇸🇬',
  params: { id: 'uuid-1234' },
};

describe('SettingsPanel Copy Configuration micro-UX', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders COPY CONFIGURATION button with disabled state when no node is selected', () => {
    render(
      <SettingsPanel
        settings={defaultSettings}
        onChange={() => {}}
        node={null}
        onOpenVpnSettings={() => {}}
      />
    );

    const copyBtn = screen.getByRole('button', { name: /COPY CONFIGURATION/i });
    expect(copyBtn).toBeDisabled();
  });

  it('updates label to COPIED! and reverts back after timeout when clicked', async () => {
    render(
      <SettingsPanel
        settings={defaultSettings}
        onChange={() => {}}
        node={mockNode}
        onOpenVpnSettings={() => {}}
      />
    );

    const copyBtn = screen.getByRole('button', { name: /COPY CONFIGURATION/i });
    expect(copyBtn).not.toBeDisabled();

    await act(async () => {
      fireEvent.click(copyBtn);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: /COPIED!/i })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByRole('button', { name: /COPY CONFIGURATION/i })).toBeInTheDocument();
  });

  it('provides Myanmar translation for COPIED! label', () => {
    expect(translate('my', 'COPIED!')).toBe('ကူးယူပြီး!');
  });
});
