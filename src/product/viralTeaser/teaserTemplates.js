import { TeaserMood } from "./teaser.types.js";

/**
 * Curiosity-driving share templates.
 *
 * STRICT EMOJI POLICY (enforced by tests/static/forbidden-emojis-check.mjs):
 *
 * Only emojis from Emoji 5.0 (2017) or earlier are allowed in user-visible
 * strings. Anything newer can render as a "diamond-with-question-mark"
 * U+FFFD glyph on older Android / iOS, on desktop WhatsApp, and on
 * recipients with stale system fonts. The whole viral loop depends on
 * the recipient SEEING the curiosity hook.
 *
 * Specifically forbidden:
 *   - 🫧 BUBBLE          (Emoji 14.0, 2021)
 *   - 🪩 DISCO BALL      (Emoji 13.0, 2020)
 *   - 🪄 MAGIC WAND      (Emoji 13.0)
 *   - 🪞 MIRROR          (Emoji 13.0)
 *   - 🫠 MELTING FACE    (Emoji 14.0)
 *   - 🩷 PINK HEART       (Emoji 15.0)
 *
 * Other rules for every template:
 *   - Hebrew first, mobile-line short.
 *   - One emoji trail that signals "secret object".
 *   - Light micro-instruction so a stranger on WhatsApp knows what to do.
 *   - No "encryption" / "crypto" / "key" technical language.
 *   - Must keep room for the URL to be visible on its own line.
 */
export const teaserTemplates = Object.freeze([
  {
    id: "crystal-drop",
    mood: TeaserMood.PLAYFUL,
    emoji: "🔮✨",
    body: "🔮✨ השארתי לך סוד קטן\nלחץ על הקישור וצייר את הסימן 👇"
  },
  {
    id: "shh",
    mood: TeaserMood.PLAYFUL,
    emoji: "🤫🔮",
    body: "🤫 רק שתדע — יש לך סוד מחכה\n🔮 פותחים עם סימן יד 👇"
  },
  {
    id: "gift",
    mood: TeaserMood.PLAYFUL,
    emoji: "🎁🔓",
    body: "🎁 הכנתי לך משהו\n🔓 רק הסימן הנכון יפתח 👇"
  },
  {
    id: "tap-to-open",
    mood: TeaserMood.PLAYFUL,
    emoji: "👆💫",
    body: "👆 לחץ על הקישור. יופיע סוד.\n💫 צייר עליו את הסימן 👇"
  },
  {
    id: "crystal-ball",
    mood: TeaserMood.MYSTERIOUS,
    emoji: "🔮🤫",
    body: "🔮 כדור אחד. סוד אחד.\n🤫 רק עם הסימן הוא נפתח 👇"
  },
  {
    id: "locked-gem",
    mood: TeaserMood.MYSTERIOUS,
    emoji: "💎🔒",
    body: "💎 משהו מסתורי הגיע אליך\n🔒 הסימן הנכון יפתח אותו 👇"
  },
  {
    id: "midnight-note",
    mood: TeaserMood.MYSTERIOUS,
    emoji: "🌙📜",
    body: "🌙 פתק חשאי הגיע\n📜 גע, צייר, גלה 👇"
  },
  {
    id: "whisper",
    mood: TeaserMood.MYSTERIOUS,
    emoji: "🕯️🤫",
    body: "🕯️ לחישה קטנה בשבילך\n🤫 פתח עם הסימן 👇"
  }
]);

export function templatesByMood(mood) {
  return teaserTemplates.filter((t) => t.mood === mood);
}
