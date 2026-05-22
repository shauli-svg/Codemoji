import { readFileSync, writeFileSync } from "node:fs";

function edit(file, fn) {
  const oldText = readFileSync(file, "utf8");
  const newText = fn(oldText);
  if (oldText !== newText) writeFileSync(file, newText, "utf8");
}

edit("src/core/config/featureFlags.js", (s) =>
  s
    .replace("onboardingHint: true", "onboardingHint: false")
    .replace("onboardingTour: true", "onboardingTour: false")
);

edit("src/product/copy.js", (s) =>
  s
    .replace('sendBack: "שלח סוד בחזרה 🔮"', 'sendBack: "שלח סוד בחזרה"')
    .replace('lockSecret: "סגור את הסוד 🔒"', 'lockSecret: "סגור את הסוד"')
    .replace('privacyHint: "הסוד לא גלוי בלינק. הוא נפתח עם הסימן."', 'privacyHint: "נפתח רק עם הסימן."')
    .replace('composeIntroLead: "🔮 סוד אחד. רק עם הסימן שלך הוא נפתח."', 'composeIntroLead: "כתוב סוד. צייר סימן."')
);

edit("src/styles/base.css", (s) => {
  if (!s.includes("/* PTW mobile polish")) {
    s += `

/* PTW mobile polish: centered, minimal, safe reveal field */
.ritual-card,
.ritual-card h1,
.ritual-card p,
.lead,
.sub,
.pattern-status,
.share-preview,
.manual-link {
  text-align: center;
}

.lead,
.sub,
.pattern-status,
.share-preview {
  margin-inline: auto;
}

.secret-input {
  text-align: center;
  width: min(100%, 390px);
}

.share-preview {
  overflow-wrap: anywhere;
  word-break: break-word;
}

.manual-link textarea {
  max-width: 100%;
  overflow-wrap: anywhere;
  word-break: break-all;
}

.secret-bubble.open {
  width: min(100%, 420px);
  min-height: 190px;
  height: auto;
  aspect-ratio: auto;
  border-radius: 28px;
}

.secret-bubble.open .bubble-core {
  min-height: 190px;
  height: auto;
  border-radius: 28px;
  padding: 24px;
  overflow: auto;
}

.secret-bubble.open .secret-message {
  max-width: 100%;
  max-height: min(48svh, 340px);
  overflow: auto;
  text-align: center;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
}

@media (max-width: 460px) {
  .screen {
    padding: 14px;
    place-items: start center;
  }

  .ritual-card {
    min-height: auto;
    justify-content: flex-start;
    gap: 14px;
    padding-block: 18px;
  }

  h1 {
    font-size: clamp(30px, 10vw, 46px);
  }

  .secret-bubble {
    width: min(72vw, 240px);
  }

  .secret-bubble.open {
    width: 100%;
  }

  .secret-input {
    min-height: 104px;
    border-radius: 24px;
  }

  .primary,
  .secondary {
    width: min(100%, 320px);
    min-width: 0;
  }
}
`;
  }
  return s;
});
