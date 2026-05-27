import { useEffect, useState } from "react";

export interface DiscordInviteData {
  name: string;
  iconUrl: string | null;
  memberCount: number | null;
  onlineCount: number | null;
}

const CACHE_TTL = 1000 * 60 * 10; // 10 minutes
const cache = new Map<string, { data: DiscordInviteData; ts: number }>();
const inflight = new Map<string, Promise<DiscordInviteData | null>>();

function extractCode(input: string): string {
  // Accepts a raw code or a full discord.gg/invite URL
  const match = input.match(/(?:discord\.gg\/|discord\.com\/invite\/)([\w-]+)/i);
  return match ? match[1] : input;
}

async function fetchInvite(code: string): Promise<DiscordInviteData | null> {
  // localStorage persistence across reloads
  const storageKey = `discord-invite:${code}`;
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw) as { data: DiscordInviteData; ts: number };
      if (Date.now() - parsed.ts < CACHE_TTL) {
        cache.set(code, parsed);
        return parsed.data;
      }
    }
  } catch {}

  const res = await fetch(
    `https://discord.com/api/v10/invites/${code}?with_counts=true`
  );
  if (!res.ok) return null;
  const json = await res.json();
  const guild = json.guild;
  if (!guild) return null;
  const iconUrl = guild.icon
    ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${
        guild.icon.startsWith("a_") ? "gif" : "png"
      }?size=128`
    : null;
  const data: DiscordInviteData = {
    name: guild.name,
    iconUrl,
    memberCount: json.approximate_member_count ?? null,
    onlineCount: json.approximate_presence_count ?? null,
  };
  const entry = { data, ts: Date.now() };
  cache.set(code, entry);
  try {
    localStorage.setItem(storageKey, JSON.stringify(entry));
  } catch {}
  return data;
}

export function useDiscordInvite(invite: string | undefined) {
  const code = invite ? extractCode(invite) : "";
  const [data, setData] = useState<DiscordInviteData | null>(() => {
    const c = cache.get(code);
    return c ? c.data : null;
  });

  useEffect(() => {
    if (!code) return;
    let cancelled = false;

    const cached = cache.get(code);
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      setData(cached.data);
      return;
    }

    let promise = inflight.get(code);
    if (!promise) {
      promise = fetchInvite(code).finally(() => inflight.delete(code));
      inflight.set(code, promise);
    }
    promise.then((d) => {
      if (!cancelled && d) setData(d);
    });

    return () => {
      cancelled = true;
    };
  }, [code]);

  return data;
}

export function formatMembers(n: number | null | undefined): string {
  if (n == null) return "—";
  if (n >= 1000) {
    const k = n / 1000;
    return k >= 10 ? `${Math.round(k)}k` : `${k.toFixed(1).replace(/\.0$/, "")}k`;
  }
  return String(n);
}
