import { teaserTemplates, templatesByMood } from "./teaserTemplates.js";
import { TeaserChannel } from "./teaser.types.js";

/**
 * Pure curiosity-teaser generator.
 *
 * Architecture rules:
 *   - No DOM. No window. No localStorage. No fetch.
 *   - No imports from features/* or styles/*.
 *   - Deterministic when a seed is given (used by tests + CI gates).
 *   - Randomized when no seed is given (used at runtime per share).
 */

function seededIndex(seed, length) {
  let h = 2166136261 >>> 0;
  const text = String(seed);
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h % length;
}

function pick(list, seed) {
  if (!list.length) throw new Error("TEASER_TEMPLATE_POOL_EMPTY");
  if (seed != null) return list[seededIndex(seed, list.length)];
  return list[Math.floor(Math.random() * list.length)];
}

/**
 * @param {{ seed?: string|number; mood?: "playful"|"mysterious" }} [options]
 * @returns {{ id: string; emoji: string; body: string; mood: string }}
 */
export function chooseTeaser(options = {}) {
  const pool = options.mood ? templatesByMood(options.mood) : teaserTemplates;
  return pick(pool, options.seed);
}

/**
 * Build the final shareable text for a given channel.
 *
 * - WhatsApp: body + blank line + url (WhatsApp auto-previews URLs).
 * - Telegram: same shape; Telegram also previews.
 * - Native Web Share: `text` excludes the URL because the platform appends it.
 * - Clipboard / generic: body + URL on a new line.
 *
 * @param {object} input
 * @param {string} input.url
 * @param {string} [input.channel]
 * @param {string|number} [input.seed]
 * @param {string} [input.mood]
 * @returns {{ title: string; text: string; url: string; teaserId: string; teaserEmoji: string }}
 */
export function buildTeaserPayload(input) {
  if (!input || typeof input.url !== "string" || !input.url) {
    throw new Error("TEASER_URL_REQUIRED");
  }
  const teaser = chooseTeaser({ seed: input.seed, mood: input.mood });
  const channel = input.channel || TeaserChannel.GENERIC;

  const title = (`CodeMoji ${teaser.emoji}`).trim();
  let text;
  if (channel === TeaserChannel.NATIVE) {
    text = teaser.body;
  } else {
    text = `${teaser.body}\n${input.url}`;
  }

  return {
    title,
    text,
    url: input.url,
    teaserId: teaser.id,
    teaserEmoji: teaser.emoji
  };
}
