// Minimal ESM shim for `is-hotkey` exporting `isKeyHotkey`.
// Enough for Slate/Keystatic keyboard shortcuts in the browser.

const MOD_ALIASES = {
  cmd: "metaKey",
  command: "metaKey",
  meta: "metaKey",
  ctrl: "ctrlKey",
  control: "ctrlKey",
  alt: "altKey",
  option: "altKey",
  shift: "shiftKey",
};

function normalizeHotkey(hotkey) {
  const parts = String(hotkey)
    .toLowerCase()
    .trim()
    .split("+")
    .map((p) => p.trim())
    .filter(Boolean);

  const mods = { metaKey: false, ctrlKey: false, altKey: false, shiftKey: false };
  let key = null;

  for (const part of parts) {
    if (part in MOD_ALIASES) {
      mods[MOD_ALIASES[part]] = true;
      continue;
    }
    key = part;
  }

  return { mods, key };
}

function eventKey(event) {
  const k = (event?.key ?? "").toLowerCase();
  if (k === " ") return "space";
  if (k === "esc") return "escape";
  if (k === "arrowleft") return "left";
  if (k === "arrowright") return "right";
  if (k === "arrowup") return "up";
  if (k === "arrowdown") return "down";
  return k;
}

export function isKeyHotkey(hotkey, event) {
  const { mods, key } = normalizeHotkey(hotkey);
  if (!event) return false;

  if (mods.metaKey !== Boolean(event.metaKey)) return false;
  if (mods.ctrlKey !== Boolean(event.ctrlKey)) return false;
  if (mods.altKey !== Boolean(event.altKey)) return false;
  if (mods.shiftKey !== Boolean(event.shiftKey)) return false;

  if (!key) return true;
  return eventKey(event) === key;
}

export function isHotkey(hotkey, event) {
  return isKeyHotkey(hotkey, event);
}

export default isKeyHotkey;
