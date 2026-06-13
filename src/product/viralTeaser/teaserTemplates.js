import { TeaserMood } from "./teaser.types.js";

export const teaserTemplates = Object.freeze([
  {
    id: "private-code-1",
    mood: TeaserMood.PLAYFUL,
    emoji: "",
    body: "נשלח אליך סוד קטן\nפותחים אותו עם קוד פתיחה"
  },
  {
    id: "private-code-2",
    mood: TeaserMood.PLAYFUL,
    emoji: "",
    body: "יש לך הודעה פרטית\nהקישור נפתח רק עם הקוד"
  },
  {
    id: "locked-note-1",
    mood: TeaserMood.PLAYFUL,
    emoji: "",
    body: "השארתי לך סוד\nפתחו אותו עם קוד הפתיחה"
  },
  {
    id: "quiet-signal-1",
    mood: TeaserMood.MYSTERIOUS,
    emoji: "",
    body: "אות שקט הגיע אליך\nהסוד נפתח רק עם הקוד"
  },
  {
    id: "locked-link-1",
    mood: TeaserMood.MYSTERIOUS,
    emoji: "",
    body: "קיבלתם סוד נעול\nהחליקו קוד פתיחה כדי לפתוח"
  },
  {
    id: "private-link-1",
    mood: TeaserMood.MYSTERIOUS,
    emoji: "",
    body: "משהו פרטי מחכה בקישור\nרק קוד הפתיחה פותח אותו"
  },
  {
    id: "short-secret-1",
    mood: TeaserMood.PLAYFUL,
    emoji: "",
    body: "סוד קצר מחכה לך\nפתחו עם קוד פתיחה"
  },
  {
    id: "silent-lock-1",
    mood: TeaserMood.MYSTERIOUS,
    emoji: "",
    body: "הודעה נעולה מחכה\nהחליקו את הקוד כדי לפתוח"
  }
]);

export function templatesByMood(mood) {
  return teaserTemplates.filter((t) => t.mood === mood);
}
