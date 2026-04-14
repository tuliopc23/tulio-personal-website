function setStatus(form: HTMLFormElement, message: string, kind: "idle" | "success" | "error") {
  const el = form.querySelector<HTMLElement>("[data-newsletter-status]");
  if (!el) return;
  el.textContent = message;
  el.dataset.kind = kind;
}

function getSource(form: HTMLFormElement): string {
  return (
    form.getAttribute("data-newsletter-source") ??
    form.querySelector<HTMLInputElement>('input[name="source"]')?.value ??
    "unknown"
  );
}

async function submit(form: HTMLFormElement) {
  const source = getSource(form);
  const action = form.getAttribute("action") ?? "/api/newsletter/subscribe";

  setStatus(form, "Submitting…", "idle");

  const body = new FormData(form);
  if (!body.get("source")) body.set("source", source);

  const res = await fetch(action, {
    method: "POST",
    headers: { Accept: "application/json" },
    body,
  });

  const json = (await res.json().catch(() => null)) as
    | { ok: true; message?: string }
    | { ok: false; error?: string }
    | null;

  if (!res.ok || !json) {
    setStatus(form, "Something went wrong. Please try again.", "error");
    return;
  }

  if (json.ok !== true) {
    const message =
      (typeof json.error === "string" && json.error) || "Something went wrong. Please try again.";
    setStatus(form, message, "error");
    return;
  }

  form.reset();
  setStatus(form, json.message ?? "Check your inbox to confirm your subscription.", "success");
}

const newsletterFormsWired = new WeakMap<HTMLFormElement, true>();

function wireUp(form: HTMLFormElement) {
  if (newsletterFormsWired.has(form)) return;
  newsletterFormsWired.set(form, true);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    void submit(form).catch(() => {
      setStatus(form, "Network error. Please try again.", "error");
    });
  });
}

document.querySelectorAll<HTMLFormElement>("[data-newsletter-form]").forEach(wireUp);
