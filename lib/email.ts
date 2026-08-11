export const EMAIL_PARTS = ["gmail.com", "@", "Juniordomontero"];

export const getMailtoHref = () =>
  `mailto:${[...EMAIL_PARTS].reverse().join("")}`;
