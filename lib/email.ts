export const EMAIL_PARTS = ["gmail.com", "@", "juniordmontero2026"];

export const getMailtoHref = () =>
  `mailto:${[...EMAIL_PARTS].reverse().join("")}`;
