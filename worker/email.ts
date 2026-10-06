// Branded HTML + plain-text bodies for the emails sent by index.ts.
// Email clients only honour inline styles and table layout, hence the markup.
// Colours mirror the site theme in src/app/globals.css.

const C = {
  ivory: "#f7f2ea",
  cream: "#fdfbf7",
  charcoal: "#3e3a35",
  taupe: "#8a7b6b",
  champagne: "#c9b8a3",
  hairline: "#ebe2d5",
  blush: "#e8d3cd",
  sageDeep: "#7c8b74",
  sageMist: "#dce0d5",
};
const SERIF = "Georgia,'Times New Roman',serif";
const SANS = "'Helvetica Neue',Helvetica,Arial,sans-serif";
const LABEL = `font-family:${SANS};font-size:11px;line-height:1.4;letter-spacing:2.5px;text-transform:uppercase;color:${C.taupe}`;

export type EmailBrand = {
  /** e.g. ["Alisha", "Neel"] */
  names: [string, string];
  /** e.g. "January 29, 2027 · South Gujarat, India" */
  dateLine: string;
  hashtag: string;
  siteUrl: string;
};

export type EmailContent = {
  /** Preview line shown next to the subject in the inbox */
  preheader: string;
  eyebrow: string;
  heading: string;
  intro: string;
  /** Optional pill under the intro, e.g. "Joyfully accepts" */
  badge?: { label: string; tone: "sage" | "blush" };
  details: { label: string; value: string; href?: string }[];
  button: { label: string; href: string };
  footnote?: string;
  signoff?: string;
};

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export function renderEmailHtml(brand: EmailBrand, content: EmailContent): string {
  const [first, second] = brand.names.map(escapeHtml);
  const siteHost = new URL(brand.siteUrl).host;

  const details = content.details
    .map(({ label, value, href }) => {
      const text = escapeHtml(value);
      return (
        `<tr><td style="padding:16px 0;border-top:1px solid ${C.hairline}">` +
        `<div style="${LABEL}">${escapeHtml(label)}</div>` +
        `<div style="margin-top:6px;font-family:${SERIF};font-size:17px;line-height:1.5;color:${C.charcoal};white-space:pre-wrap;word-break:break-word">${
          href
            ? `<a href="${escapeHtml(href)}" style="color:${C.charcoal};text-decoration:none">${text}</a>`
            : text
        }</div>` +
        `</td></tr>`
      );
    })
    .join("");

  return (
    `<!doctype html><html lang="en"><head><meta charset="utf-8">` +
    `<meta name="viewport" content="width=device-width,initial-scale=1">` +
    `<meta name="color-scheme" content="light only"></head>` +
    `<body style="margin:0;padding:0;background:${C.ivory}">` +
    `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.ivory}">${escapeHtml(content.preheader)}</div>` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.ivory}"><tr><td align="center" style="padding:40px 16px">` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px">` +
    // Masthead
    `<tr><td align="center" style="padding:0 0 28px">` +
    `<div style="font-family:${SERIF};font-size:34px;line-height:1.2;color:${C.charcoal}">${first} <span style="font-style:italic;color:${C.sageDeep}">&amp;</span> ${second}</div>` +
    `<div style="margin-top:10px;${LABEL}">${escapeHtml(brand.dateLine)}</div>` +
    `</td></tr>` +
    // Card — arched top like the cards on the site
    `<tr><td style="background:${C.cream};border:1px solid ${C.champagne};border-radius:48px 48px 0 0;padding:44px 28px 36px">` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">` +
    `<tr><td align="center">` +
    `<div style="${LABEL};color:${C.sageDeep}">${escapeHtml(content.eyebrow)}</div>` +
    `<div style="margin-top:12px;font-family:${SERIF};font-size:30px;line-height:1.25;color:${C.charcoal}">${escapeHtml(content.heading)}</div>` +
    `<div style="margin:16px auto 0;width:40px;border-top:1px solid ${C.champagne};font-size:0;line-height:0">&nbsp;</div>` +
    `<div style="margin-top:20px;font-family:${SANS};font-size:15px;line-height:1.7;color:${C.charcoal}">${escapeHtml(content.intro)}</div>` +
    (content.badge
      ? `<div style="margin-top:24px"><span style="display:inline-block;padding:9px 20px;border-radius:999px;background:${
          content.badge.tone === "sage" ? C.sageMist : C.blush
        };font-family:${SANS};font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:${C.charcoal}">${escapeHtml(content.badge.label)}</span></div>`
      : "") +
    `</td></tr>` +
    `<tr><td style="padding-top:28px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${details}</table></td></tr>` +
    `<tr><td align="center" style="padding-top:20px;border-top:1px solid ${C.hairline}">` +
    `<a href="${escapeHtml(content.button.href)}" style="display:inline-block;margin-top:12px;padding:14px 32px;border-radius:999px;background:${C.charcoal};font-family:${SANS};font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:${C.ivory};text-decoration:none">${escapeHtml(content.button.label)}</a>` +
    (content.footnote
      ? `<div style="margin-top:18px;font-family:${SANS};font-size:13px;line-height:1.6;color:${C.taupe}">${escapeHtml(content.footnote)}</div>`
      : "") +
    (content.signoff
      ? `<div style="margin-top:28px;font-family:${SERIF};font-size:18px;font-style:italic;line-height:1.5;color:${C.charcoal}">${escapeHtml(content.signoff)}<br>${first} &amp; ${second}</div>`
      : "") +
    `</td></tr>` +
    `</table></td></tr>` +
    // Footer
    `<tr><td align="center" style="padding:24px 0 0;${LABEL}">` +
    `${escapeHtml(brand.hashtag)} &nbsp;·&nbsp; <a href="${escapeHtml(brand.siteUrl)}" style="color:${C.taupe};text-decoration:none">${escapeHtml(siteHost)}</a>` +
    `</td></tr>` +
    `</table></td></tr></table></body></html>`
  );
}

// Plain-text twin of the HTML — mail clients that can't show HTML use it, and
// spam filters trust messages that carry both.
export function renderEmailText(brand: EmailBrand, content: EmailContent): string {
  return [
    content.heading,
    content.intro,
    content.badge?.label,
    content.details.map(({ label, value }) => `${label}: ${value}`).join("\n"),
    `${content.button.label}: ${content.button.href}`,
    content.footnote,
    content.signoff && `${content.signoff}\n${brand.names.join(" & ")}`,
    `${brand.names.join(" & ")} · ${brand.dateLine}\n${brand.siteUrl}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}
