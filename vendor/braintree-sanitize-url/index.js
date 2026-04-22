// Minimal ESM implementation compatible with `@braintree/sanitize-url`.
// Keystatic imports `sanitizeUrl` as a named export in a worker bundle.

const invalidProtocolRegex = /^([^\w]*)(javascript|data|vbscript)/im;
const htmlEntitiesRegex = /&#(\w+)(^\w|;)?/g;
const htmlCtrlEntityRegex = /&(newline|tab);/gi;
const ctrlCharactersRegex = /[\u0000-\u001F\u007F-\u009F\u2000-\u200D\uFEFF]/gim;
const urlSchemeRegex = /^.+(:|&colon;)/gim;
const relativeFirstCharacters = [".", "/"];

export const BLANK_URL = "about:blank";

function isRelativeUrlWithoutProtocol(url) {
  return relativeFirstCharacters.indexOf(url[0]) > -1;
}

function decodeHtmlCharacters(str) {
  const removedNullByte = str.replace(ctrlCharactersRegex, "");
  return removedNullByte.replace(htmlEntitiesRegex, (_match, dec) => String.fromCharCode(dec));
}

export function sanitizeUrl(url) {
  if (!url) return BLANK_URL;

  const sanitizedUrl = decodeHtmlCharacters(String(url))
    .replace(htmlCtrlEntityRegex, "")
    .replace(ctrlCharactersRegex, "")
    .trim();

  if (!sanitizedUrl) return BLANK_URL;
  if (isRelativeUrlWithoutProtocol(sanitizedUrl)) return sanitizedUrl;

  const urlSchemeParseResults = sanitizedUrl.match(urlSchemeRegex);
  if (!urlSchemeParseResults) return sanitizedUrl;

  const urlScheme = urlSchemeParseResults[0];
  return invalidProtocolRegex.test(urlScheme) ? BLANK_URL : sanitizedUrl;
}
