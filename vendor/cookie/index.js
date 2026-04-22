// Minimal ESM implementation compatible with `cookie`'s parse/serialize API.
// This exists to satisfy Astro's `import { parse, serialize } from "cookie"` during bundling.

const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;

export function parse(str, options = {}) {
  if (typeof str !== "string") {
    throw new TypeError("cookie.parse: argument str must be a string");
  }

  const obj = {};
  const decode = typeof options.decode === "function" ? options.decode : decodeURIComponent;

  const pairs = str.split(/; */);
  for (const pair of pairs) {
    if (!pair) continue;
    const eqIdx = pair.indexOf("=");
    if (eqIdx < 0) continue;

    const key = pair.slice(0, eqIdx).trim();
    if (!key) continue;
    if (obj[key] !== undefined) continue;

    let val = pair.slice(eqIdx + 1).trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);

    try {
      obj[key] = decode(val);
    } catch {
      obj[key] = val;
    }
  }

  return obj;
}

function encodeCookieValue(value) {
  return encodeURIComponent(value);
}

export function serialize(name, val, options = {}) {
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("cookie.serialize: invalid name");
  }

  const encode = typeof options.encode === "function" ? options.encode : encodeCookieValue;
  const value = encode(String(val));

  if (!fieldContentRegExp.test(value)) {
    throw new TypeError("cookie.serialize: invalid value");
  }

  let str = `${name}=${value}`;

  if (options.maxAge != null) {
    const maxAge = Math.floor(Number(options.maxAge));
    if (!Number.isFinite(maxAge)) throw new TypeError("cookie.serialize: invalid maxAge");
    str += `; Max-Age=${maxAge}`;
  }

  if (options.domain) {
    if (!fieldContentRegExp.test(options.domain))
      throw new TypeError("cookie.serialize: invalid domain");
    str += `; Domain=${options.domain}`;
  }

  if (options.path) {
    if (!fieldContentRegExp.test(options.path))
      throw new TypeError("cookie.serialize: invalid path");
    str += `; Path=${options.path}`;
  }

  if (options.expires) {
    const expires = options.expires instanceof Date ? options.expires : new Date(options.expires);
    if (Number.isNaN(expires.valueOf())) throw new TypeError("cookie.serialize: invalid expires");
    str += `; Expires=${expires.toUTCString()}`;
  }

  if (options.httpOnly) str += "; HttpOnly";
  if (options.secure) str += "; Secure";

  if (options.priority) {
    const p = String(options.priority).toLowerCase();
    if (p === "low") str += "; Priority=Low";
    else if (p === "medium") str += "; Priority=Medium";
    else if (p === "high") str += "; Priority=High";
    else throw new TypeError("cookie.serialize: invalid priority");
  }

  if (options.sameSite) {
    const sameSite = options.sameSite;
    const v = typeof sameSite === "string" ? sameSite.toLowerCase() : sameSite;
    if (v === true || v === "strict") str += "; SameSite=Strict";
    else if (v === "lax") str += "; SameSite=Lax";
    else if (v === "none") str += "; SameSite=None";
    else throw new TypeError("cookie.serialize: invalid sameSite");
  }

  return str;
}
