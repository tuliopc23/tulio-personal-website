const TONES = new Map([
  ["note", "note"],
  ["tip", "tip"],
  ["important", "important"],
  ["warning", "warning"],
  ["caution", "caution"],
]);

function humanize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getTitle(node, fallback) {
  const candidate =
    (typeof node?.attributes?.title === "string" && node.attributes.title) ||
    (typeof node?.attributes?.label === "string" && node.attributes.label) ||
    (typeof node?.label === "string" && node.label) ||
    fallback;

  return String(candidate).trim() || fallback;
}

function getParagraphText(node) {
  if (!node || node.type !== "paragraph" || !Array.isArray(node.children)) {
    return null;
  }

  let text = "";
  for (const child of node.children) {
    if (!child || child.type !== "text") {
      return null;
    }
    text += child.value;
  }

  return text.trim();
}

function makeCalloutNode(tone, title, children) {
  return {
    type: "mdxJsxFlowElement",
    name: "Callout",
    attributes: [
      { type: "mdxJsxAttribute", name: "tone", value: tone },
      { type: "mdxJsxAttribute", name: "title", value: title },
    ],
    children,
  };
}

function normalizeDirectiveNodes(children) {
  const next = [];

  for (let index = 0; index < children.length; index++) {
    const node = children[index];

    if (node && Array.isArray(node.children)) {
      node.children = normalizeDirectiveNodes(node.children);
    }

    if (node && (node.type === "containerDirective" || node.type === "leafDirective")) {
      const tone = TONES.get(node.name);
      if (tone) {
        next.push(
          makeCalloutNode(
            tone,
            getTitle(node, humanize(tone)),
            Array.isArray(node.children) ? node.children : [],
          ),
        );
        continue;
      }
    }

    const marker = getParagraphText(node);
    const startMatch = marker?.match(/^:::(note|tip|important|warning|caution)\s*(.*)$/i);
    if (!startMatch) {
      next.push(node);
      continue;
    }

    const tone = TONES.get(startMatch[1].toLowerCase());
    if (!tone) {
      next.push(node);
      continue;
    }

    const title = startMatch[2]?.trim() || humanize(tone);
    const body = [];
    let endIndex = index + 1;

    while (endIndex < children.length) {
      const candidate = children[endIndex];
      const candidateText = getParagraphText(candidate);
      if (candidateText === ":::") {
        break;
      }

      if (candidate && Array.isArray(candidate.children)) {
        candidate.children = normalizeDirectiveNodes(candidate.children);
      }
      body.push(candidate);
      endIndex += 1;
    }

    if (endIndex < children.length) {
      next.push(makeCalloutNode(tone, title, body));
      index = endIndex;
      continue;
    }

    next.push(node);
  }

  return next;
}

export default function remarkCalloutDirectives() {
  return function transform(tree) {
    if (Array.isArray(tree.children)) {
      tree.children = normalizeDirectiveNodes(tree.children);
    }
  };
}
