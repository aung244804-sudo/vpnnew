import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PublicDirectory } from '@/components/client/PublicDirectory';
import { LanguageProvider } from '@/components/client/LanguageProvider';
import * as serverDirectory from '@/lib/server-directory';
import type { ServerNode } from '@/lib/v2ray';

const mockNode: ServerNode = {
  id: 'node-test-1',
  name: 'Singapore Fast 01',
  country: 'SG',
  flag: '🇸🇬',
  protocol: 'trojan',
  address: '1.2.3.4',
  port: 443,
  raw: 'trojan://test@1.2.3.4:443',
};

describe('PublicDirectory UX enhancements', () => {
  it('updates import button to check icon and imported state when clicked', async () => {
    vi.spyOn(serverDirectory, 'fetchDirectory').mockResolvedValue({
      nodes: [mockNode],
      skipped: 0,
      truncated: false,
      fetchedAt: new Date().toISOString(),
    });

    const onImport = vi.fn();

    render(
      <LanguageProvider>
        <PublicDirectory onImport={onImport} protocols={['trojan']} />
      </LanguageProvider>
    );

    const importBtn = await screen.findByRole('button', { name: /import server Singapore Fast 01/i });
    expect(importBtn).toBeDefined();
    expect(importBtn).not.toBeDisabled();

    fireEvent.click(importBtn);

    expect(onImport).toHaveBeenCalledWith(mockNode);

    await waitFor(() => {
      expect(importBtn).toBeDisabled();
      expect(screen.getByRole('button', { name: /Singapore Fast 01 \(Imported\)/i })).toBeDefined();
    });
  });
});
