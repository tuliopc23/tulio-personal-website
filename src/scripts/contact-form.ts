export function initContactForm(root: ParentNode = document): void {
  const form = root.querySelector("[data-contact-form]");
  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  if (form.dataset.contactFormInitialized === "true") {
    return;
  }

  form.dataset.contactFormInitialized = "true";

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);

    const name = (data.get("name") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const subject = (data.get("subject") || "").toString().trim();
    const message = (data.get("message") || "").toString().trim();

    const body = [`Name: ${name}`, `Email: ${email}`, "", message].join("\n");
    const mailto = `mailto:contact@tuliocunha.dev?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.assign(mailto);
  });
}

if (typeof document !== "undefined") {
  initContactForm();
}
