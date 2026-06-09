const CONTACT_EMAIL = "contact@tuliocunha.dev";
const FALLBACK_DELAY_MS = 1800;

type ContactStatusKind = "idle" | "pending" | "fallback";

function getStatusEl(form: HTMLFormElement): HTMLElement | null {
  return form.querySelector<HTMLElement>("[data-contact-status]");
}

function setStatus(form: HTMLFormElement, kind: ContactStatusKind, message: string): void {
  const el = getStatusEl(form);
  if (!el) return;
  el.dataset.kind = kind;
  el.textContent = message;
}

function setFallbackHtml(form: HTMLFormElement): void {
  const el = getStatusEl(form);
  if (!el) return;
  el.dataset.kind = "fallback";
  el.innerHTML = "";

  const text = document.createElement("span");
  text.textContent = "If nothing opened, email ";
  el.append(text);

  const link = document.createElement("a");
  link.href = `mailto:${CONTACT_EMAIL}`;
  link.textContent = CONTACT_EMAIL;
  el.append(link);

  const suffix = document.createElement("span");
  suffix.textContent = " or copy the address.";
  el.append(suffix);

  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.className = "contactFormCopy";
  copyButton.dataset.contactCopy = "true";
  copyButton.textContent = "Copy email";
  el.append(copyButton);
}

async function copyEmail(button: HTMLButtonElement): Promise<void> {
  const form = button.closest("form");
  if (!form) return;

  try {
    await navigator.clipboard.writeText(CONTACT_EMAIL);
    button.textContent = "Copied";
    window.setTimeout(() => {
      button.textContent = "Copy email";
    }, 2000);
    setStatus(form, "fallback", `Copied ${CONTACT_EMAIL} to clipboard.`);
  } catch {
    button.textContent = "Copy failed";
    window.setTimeout(() => {
      button.textContent = "Copy email";
    }, 2000);
  }
}

export function initContactForm(root: ParentNode = document): void {
  const form = root.querySelector("[data-contact-form]");
  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  if (form.dataset.contactFormInitialized === "true") {
    return;
  }

  form.dataset.contactFormInitialized = "true";

  form.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const copyButton = target.closest<HTMLButtonElement>("[data-contact-copy]");
    if (!copyButton) return;
    event.preventDefault();
    void copyEmail(copyButton);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);

    const name = (data.get("name") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const subject = (data.get("subject") || "").toString().trim();
    const message = (data.get("message") || "").toString().trim();

    const body = [`Name: ${name}`, `Email: ${email}`, "", message].join("\n");
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setStatus(form, "pending", "Opening your mail client…");
    window.location.assign(mailto);

    window.setTimeout(() => {
      setFallbackHtml(form);
    }, FALLBACK_DELAY_MS);
  });
}

if (typeof document !== "undefined") {
  initContactForm();
}
