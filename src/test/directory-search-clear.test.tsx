import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PublicDirectory } from '@/components/client/PublicDirectory';
import { LanguageProvider } from '@/components/client/LanguageProvider';
import * as serverDir from '@/lib/server-directory';

vi.mock('@/lib/server-directory', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/server-directory')>();
  return {
    ...actual,
    fetchDirectory: vi.fn(),
  };
});

describe('PublicDirectory Search Clear Button', () => {
  const dummyNodes: serverDir.ServerNode[] = [
    {
      id: '1',
      name: 'Amsterdam Fast',
      country: 'NL',
      flag: '🇳🇱',
      protocol: 'vmess',
      link: 'vmess://sample1',
    },
    {
      id: '2',
      name: 'Frankfurt Direct',
      country: 'DE',
      flag: '🇩🇪',
      protocol: 'vless',
      link: 'vless://sample2',
    },
  ];

  beforeEach(() => {
    vi.mocked(serverDir.fetchDirectory).mockResolvedValue({
      nodes: dummyNodes,
      skipped: 0,
      truncated: false,
      fetchedAt: Date.now(),
    });
  });

  it('renders search input without clear button initially, and shows clear button when text is entered', async () => {
    render(
      <LanguageProvider>
        <PublicDirectory onImport={() => {}} protocols={['vmess', 'vless', 'trojan', 'shadowsocks']} />
      </LanguageProvider>
    );

    const searchInput = screen.getByPlaceholderText('Search name, protocol or location');
    expect(searchInput).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'Amsterdam' } });

    const clearButton = screen.getByRole('button', { name: 'Clear search' });
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);

    expect(searchInput).toHaveValue('');
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
  });

  it('supports Myanmar translation for the Clear search aria-label', async () => {
    localStorage.setItem('netcon-language-v1', 'my');
    render(
      <LanguageProvider>
        <PublicDirectory onImport={() => {}} protocols={['vmess', 'vless', 'trojan', 'shadowsocks']} />
      </LanguageProvider>
    );

    const searchInput = screen.getByPlaceholderText('အမည်၊ protocol သို့မဟုတ် တည်နေရာဖြင့် ရှာပါ');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    const clearButton = screen.getByRole('button', { name: 'ရှာဖွေမှုကို ရှင်းရန်' });
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);
    expect(searchInput).toHaveValue('');
    localStorage.removeItem('netcon-language-v1');
  });
});
