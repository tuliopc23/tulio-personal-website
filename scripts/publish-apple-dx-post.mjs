/**
 * One-shot: create sourceReference docs + published post for the Apple dev tooling essay.
 * Run: node scripts/publish-apple-dx-post.mjs
 * Re-run safe: uses fixed _id values with createOrReplace.
 */
import { createReadStream } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const POST_ID = "post-apple-dev-tooling-april-2026";

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error("Missing SANITY_API_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID || "61249gtj",
  dataset: process.env.PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-02-19",
  token,
  useCdn: false,
});

function key() {
  return (
    globalThis.crypto?.randomUUID?.().replace(/-/g, "").slice(0, 12) ??
    Math.random().toString(36).slice(2, 14)
  );
}

/** @param {string} text */
function span(text, marks = []) {
  return { _type: "span", _key: key(), text, marks };
}

/** @param {import('@portabletext/types').PortableTextBlock['children']} children */
function block(style, children, markDefs = []) {
  return { _type: "block", _key: key(), style, children, markDefs };
}

function P(text) {
  return block("normal", [span(text)]);
}

function H2(text) {
  return block("h2", [span(text)]);
}

function H3(text) {
  return block("h3", [span(text)]);
}

function BQ(text) {
  return block("blockquote", [span(text)]);
}

function divider(style = "line") {
  return { _type: "divider", _key: key(), style };
}

/** @param {'info'|'tip'|'warning'|'success'|'error'} variant */
function callout(variant, title, bodyText) {
  return {
    _type: "callout",
    _key: key(),
    variant,
    title,
    body: [block("normal", [span(bodyText)])],
  };
}

/** Inline code spans: segments are strings or {code: string} */
function Pmix(segments) {
  /** @type {import('@portabletext/types').PortableTextBlock['children']} */
  const children = [];
  for (const seg of segments) {
    if (typeof seg === "string") {
      children.push(span(seg));
    } else if (seg && typeof seg.code === "string") {
      children.push(span(seg.code, ["code"]));
    }
  }
  return block("normal", children);
}

function buildContent() {
  return [
    BQ("Apple sells a fairy tale about development."),
    P(
      "You can see it every June. The demos are clean. The APIs are framed as inevitable. The design language is immaculate. The docs look coherent enough to imply a philosophy underneath the stack. Xcode is presented as world-class. SwiftUI is presented as the future. Swift is presented as safe, expressive, and modern. Some of that is even true: Xcode 26 ships with Swift 6.2 and the SDKs for the 26-generation OS releases, and Apple is clearly still investing in the toolchain.",
    ),
    P(
      "Then you sit down to ship a real app, and the story changes. The problem is not that Apple platforms are hard. Hard is fine. The problem is how much of the difficulty is artificial: project configuration weirdness, flaky indexing, opaque builds, fragile previews, and documentation that describes the happy path while omitting the caveats you will actually hit.",
    ),
    P(
      "Apple keeps talking about intelligence features, coding assistants, and polished workflows, while the baseline experience still trains too many people to delete DerivedData and hope for absolution. Xcode 26’s own “What’s new” story leans on coding assistants, inline generation, and Playground macro previews. That work matters. It is still not the same thing as fixing the architectural paper cuts that have defined Apple development for years.",
    ),
    divider("dots"),

    H2("Xcode: the IDE that time forgot, then partially repainted"),
    P(
      "The editor itself is better than many developers admit. It feels native because it is native. Text looks sharp. Scrolling is smooth. Responsiveness has improved over the last few releases. If you care about a Mac-native editor, Xcode still has something most cross-platform IDEs do not.",
    ),
    P(
      "And yet Xcode remains one of the biggest offenders against Apple’s own interface values. It is visually dense, full of tiny controls, overloaded with panels, and often weak on discoverability. It feels like a product that tried to become every developer tool at once: editor, build orchestrator, source control client, design surface, simulator launcher, signing console, profiling gateway, package UI, archive manager, test dashboard, doc browser, and now an AI shell. The result is not cohesion. It is accretion.",
    ),

    H3("The core concept still feels wrong: the Xcode project"),
    P(
      "The modern norm is simple. The filesystem is the source of truth. Configuration lives in plain text. The build graph is inspectable. The editor is a client of that truth, not the owner of it. Xcode still behaves too much like an IDE-owned graph: projects, targets, schemes, build phases, groups, workspaces, signing state, derived metadata, and a project file that models more than most developers should have to think about. Apple’s documentation still frames app development in terms of projects and workspaces, not a manifest-first model.",
    ),
    Pmix([
      "That is why ",
      { code: ".xcodeproj" },
      " feels cursed. It is not just a config file. It is a serialized representation of the IDE’s worldview. It can diverge from the actual folder structure. It turns routine collaboration into needless merge friction. It makes modularization more configuration-heavy than it should be. It makes the UI, not the repository, feel like the source of truth. In 2026, that is hard to defend.",
    ]),

    H2("The build system is evolving. The authoring model is not."),
    callout(
      "info",
      "Swift Build is real progress",
      "Swift Package Manager is previewing Swift Build as a replacement for the current native build system, and Apple’s WWDC25 session on Xcode 26 describes Swift Build as the open-source build engine used by Xcode. That modernizes what runs under the hood. It does not, by itself, fix the day-to-day model most teams still live inside.",
    ),
    P(
      "You can modernize the build engine and still leave most pain intact if the experience remains mediated through Xcode projects, schemes, workspaces, and IDE-owned state. Build transparency stays weak. Logs are still too often optimized for the Xcode UI instead of for humans trying to reason about what just happened. Cache invalidation still feels mystical. One-line changes can trigger work that looks wildly disproportionate. Type-checking failures remain slow and unhelpful far too often. Even when SwiftPM exposes more CLI surface than people assume, the command UX still feels verbose next to the best modern tooling ecosystems.",
    ),
    P(
      "That is why CI on Apple platforms still feels worse than it should. Apple has a testing story: Xcode 16 and later include Swift Testing, described as expressive, scalable, and integrated with SwiftPM workflows. Swift Testing is a real step forward. Native app automation still does not feel normal. Too much of CI stays coupled to the Xcode worldview: schemes, simulator state, signing, entitlements, distribution flows, and a project model that is more fragile than a good CI substrate should be. Plenty of teams can wire better CI for web, Rust, Go, or backend work faster than for a serious Apple app—not because Apple development is uniquely sophisticated, but because Apple still piles incidental complexity on normal software engineering.",
    ),
    divider("line"),

    H2("SwiftUI is the future. It is still a negotiation."),
    P(
      "SwiftUI deserves praise and criticism in equal measure. On good days, it is one of Apple’s best ideas in years. The declarative model is elegant. The code can be beautiful. The framework is still moving: recent updates add APIs and deeper design-system integration, and WWDC25 added new sessions on SwiftUI performance, concurrency, spatial layout, and the 26-era design language. SwiftUI is not stagnating.",
    ),
    callout(
      "warning",
      "Previews: brilliant concept, uneven reality",
      "When SwiftUI previews work, they feel magical. When they do not, they can burn absurd amounts of time. Many teams quietly fall back to “just build and run the app,” because the preview path can become its own debugging project.",
    ),
    P(
      "SwiftUI still has a black-box quality that makes real apps harder than Apple admits. Layout is too often something you discover experimentally rather than understand from first principles. State management has improved, but ownership, observation boundaries, update propagation, and patterns for nontrivial apps still confuse people. Complex navigation remains touchier than it should be. On macOS, SwiftUI still often feels like the less-loved child: workable and improving, but not yet sufficient by itself for many truly desktop-class apps.",
    ),
    P(
      "Apple’s own recent SwiftUI work makes the tension visible. Dedicated WWDC sessions on optimizing SwiftUI performance with Instruments, exploring concurrency in SwiftUI, and mixing SwiftUI with RealityKit or AppKit-adjacent features are evidence of a living framework—and evidence that the easy story only gets you so far.",
    ),

    H2("SwiftData is getting better. That is not the same as “trust it blindly.”"),
    callout(
      "warning",
      "Persistence is where optimism gets expensive",
      "SwiftData sells a compelling high-level story with a more complicated low-level reality. Recent releases add indexing, richer predicates, compound uniqueness, and WWDC25 introduced deeper work on inheritance and schema migration. Early versions were rough; real model graphs exposed edge cases; migration stories were not always reassuring. The framework has improved, but it does not yet earn the automatic trust a mature persistence layer should. Core Data remains battle-tested, but still carries the shape of an older era. Apple managed the rare feat of making both the old system and the new system feel like compromises.",
    ),

    H2("Documentation looks complete right up until you need it"),
    BQ("The problem is not aesthetics. The problem is omission."),
    P(
      "Apple’s documentation is often excellent at showing what an API is supposed to do on the happy path. It is less reliable when you need to know what breaks, what is underspecified, what behaves differently across platforms, what gets awkward in large codebases, or what migration traps other developers already hit. The official pages for Xcode, SwiftUI, Testing, and SwiftData present polished summaries of intent. They are far less likely to carry the candid caveats experienced developers actually search for.",
    ),
    P(
      "That is why so much practical Apple knowledge still lives outside Apple: blog posts, forum threads, old GitHub issues, conference talks, random gists, and tribal memory. The docs look complete, but the working developer experience is still full of folklore. When Apple deprecates APIs, migration guidance is often directionally useful but not conceptually exhaustive. When toolchain bugs appear, Feedback Assistant can feel more like a submission chute than a conversation. The subtle result is corrosive: people internalize that the polished official story is only half the story.",
    ),
    divider("asterisks"),

    H2("The pretension problem"),
    P(
      "Apple’s tooling culture still projects the idea that development on Apple platforms is seamless if you are doing it correctly. The demos work. The visuals are composed. The docs are serene. The marketing language around Xcode 26 talks about productivity, coding intelligence, improved testing, and integrated workflows.",
    ),
    P(
      "Real projects are not WWDC demos. They have history: CI constraints, dependency graphs, migration baggage, signing problems, old targets, weird package resolution failures, AppKit and UIKit escape hatches, and layout bugs that reproduce on one platform on alternate Tuesdays. Apple rarely acknowledges that texture in public. When the tooling fights you, it can feel like you are the problem.",
    ),
    callout(
      "tip",
      "Route around the pain (honestly)",
      "Teams adopt Tuist, custom build flows, and heavier internal tooling for a reason. Some keep one foot in native and one foot in cross-platform stacks. That is rational behavior when the daily loop is expensive—not developer disloyalty.",
    ),
    P(
      "That stance is getting riskier. Apple operates in a more competitive environment. Alternative distribution is not theoretical anymore: Apple’s EU documentation and MarketplaceKit materials acknowledge the post–iOS 17.4 world of alternative marketplaces and new distribution paths, while EU business terms continue evolving. Developers have more leverage, more platform choices, and more viable cross-platform stacks than a few years ago. In that world, developer experience is not a side issue. It is a competitive feature.",
    ),

    H2("Swift is great. That raises the stakes."),
    P(
      "Swift is excellent. Swift 6’s data-race safety model is a real achievement, and Swift 6.2 continues steady, serious evolution. The language is expressive, fast, and unusually pleasant for something that can work close to the metal. Swift Package Manager is useful and still improving. Swift Testing is promising. Swift Build could become a major structural improvement.",
    ),
    P(
      "That is exactly why the tooling situation feels frustrating. The platform has the raw ingredients. The ecosystem does not need fairy dust. It needs product discipline. Apple needs to treat developer tooling as a first-class product area, not as an accessory to the platform story: a clearer architectural direction for app projects, better build transparency, faster iteration on Xcode stability, documentation that includes caveats—not only aspirations—a feedback loop that feels real, more honesty about where SwiftUI still falls short on macOS, and less obsession with demo gloss relative to what happens after week three of a real production app.",
    ),
    P(
      "Because if Apple does not make the daily experience better, the best developers will do what developers always do: route around the pain. That would be a shame, because this ecosystem is still worth fighting for. It is long past time for Apple to stop acting like the fight is not happening.",
    ),
  ];
}

const SOURCE_SPECS = [
  {
    _id: "sourceRef-apple-xcode",
    title: "Xcode – Apple Developer",
    url: "https://developer.apple.com/xcode/",
    sourceType: "documentation",
    author: "Apple Inc.",
    reliability: "high",
    capturedExcerpt: "Official Xcode product and documentation hub.",
  },
  {
    _id: "sourceRef-wwdc2025-xcode-247",
    title: "What’s new in Xcode 26 (WWDC25)",
    url: "https://developer.apple.com/videos/play/wwdc2025/247/",
    sourceType: "video",
    author: "Apple WWDC",
    reliability: "high",
    capturedExcerpt:
      "Session covering Xcode 26 features including tooling and Swift Build direction.",
  },
  {
    _id: "sourceRef-apple-swift-testing",
    title: "Swift Testing – Apple Developer Documentation",
    url: "https://developer.apple.com/documentation/testing",
    sourceType: "documentation",
    author: "Apple Inc.",
    reliability: "high",
    capturedExcerpt: "Apple’s Swift Testing framework documentation.",
  },
  {
    _id: "sourceRef-apple-dma-eu",
    title: "DMA and apps in the EU – Apple Developer Support",
    url: "https://developer.apple.com/support/dma-and-apps-in-the-eu/",
    sourceType: "documentation",
    author: "Apple Inc.",
    reliability: "high",
    capturedExcerpt:
      "Apple’s overview of EU Digital Markets Act changes affecting distribution and marketplaces.",
  },
  {
    _id: "sourceRef-apple-marketplacekit",
    title: "MarketplaceKit – Apple Developer Documentation",
    url: "https://developer.apple.com/documentation/marketplacekit",
    sourceType: "documentation",
    author: "Apple Inc.",
    reliability: "high",
    capturedExcerpt: "Framework documentation for alternative marketplace distribution flows.",
  },
  {
    _id: "sourceRef-swift-org-swift-build",
    title: "Swift.org – Swift project blog and tooling updates",
    url: "https://www.swift.org/blog/",
    sourceType: "article",
    author: "Swift.org",
    reliability: "medium",
    capturedExcerpt:
      "Official Swift project announcements; use alongside Apple sessions for build-system context.",
  },
];

const TITLE = "Apple Needs to Get Their Shit Together in Their Dev Tooling";

const SUMMARY =
  "WWDC polish meets shipping friction: why Apple’s dev stack still buries you in projects, flaky previews, and docs that skip the caveats—and what would actually fix the daily loop.";

const SLUG = "apple-needs-to-get-their-shit-together-dev-tooling";

const META_TITLE = "Apple dev tooling: the gap between the keynote and shipping";

const META_DESCRIPTION =
  "Xcode, SwiftUI, SwiftData, and Apple docs look inevitable in June. This essay names the artificial difficulty that shows up when you ship—and what Apple should fix next.";

async function uploadHeroImage() {
  const imagePath = path.join(ROOT, "public/icons/Tools/xcodelogh_upscayl_2x_digital-art-4x.webp");
  const stream = createReadStream(imagePath);
  const asset = await client.assets.upload("image", stream, {
    filename: "post-apple-dev-tooling-hero.webp",
  });
  return asset;
}

async function main() {
  const authorId = "tulio-cunha-author";
  const categoryId = "84d44bee-0ab7-4ce5-a2dc-caed8b8e73b5";

  console.log("Uploading hero / social image…");
  const asset = await uploadHeroImage();
  const imageField = {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
    alt: "Stylized Xcode app icon on a dark background, representing Apple developer tooling and the IDE.",
  };

  const now = new Date().toISOString();

  console.log("Upserting source references…");
  for (const spec of SOURCE_SPECS) {
    const doc = {
      _id: spec._id,
      _type: "sourceReference",
      title: spec.title,
      url: spec.url,
      sourceType: spec.sourceType,
      author: spec.author,
      reliability: spec.reliability,
      capturedExcerpt: spec.capturedExcerpt,
    };
    await client.createOrReplace(doc);
  }

  const content = buildContent();

  const post = {
    _id: POST_ID,
    _type: "post",
    title: TITLE,
    slug: { _type: "slug", current: SLUG },
    author: { _type: "reference", _ref: authorId },
    categories: [{ _type: "reference", _ref: categoryId }],
    tags: ["Swift", "Tooling", "Engineering"],
    audience: "iOS, macOS, and Swift developers shipping real apps",
    intent:
      "Name the DX gap between Apple’s story and production reality, without pretending platforms should be easy",
    targetKeyword: "Apple developer experience",
    featured: false,
    summary: SUMMARY,
    keyTakeaways: [
      "Artificial difficulty—projects, indexing, previews, opaque builds—hurts more than ‘hard platform’ work.",
      "Swift Build modernizes the engine; the Xcode project model still owns too much of the developer’s mental budget.",
      "SwiftUI and SwiftData are improving; trust is earned through caveats, migrations, and macOS depth—not keynotes alone.",
      "Better DX is a competitive feature now that distribution and stacks are more plural than a few years ago.",
    ],
    pullQuotes: [
      {
        _key: "pq1",
        quote:
          "The filesystem should be the source of truth. Xcode still behaves too much like an IDE-owned graph.",
      },
      {
        _key: "pq2",
        quote:
          "You can modernize the build engine and still leave most pain intact if the experience stays mediated through Xcode projects and schemes.",
      },
      {
        _key: "pq3",
        quote:
          "The docs look complete, but the working developer experience is still full of folklore.",
      },
      {
        _key: "pq4",
        quote: "The ecosystem does not need fairy dust. It needs product discipline.",
      },
    ],
    sourceReferences: SOURCE_SPECS.map((s) => ({
      _key: `sr-${s._id}`,
      _type: "reference",
      _ref: s._id,
    })),
    furtherReading: [
      {
        _key: "fr1",
        title: "Tuist – sane Xcode projects at scale",
        href: "https://tuist.io/",
        note: "One popular way teams reduce project-file pain.",
      },
      {
        _key: "fr2",
        title: "Swift.org",
        href: "https://www.swift.org/",
        note: "Language and tooling direction outside a single WWDC session.",
      },
    ],
    content,
    heroImage: imageField,
    heroCreativeNotes: "Dark, IDE-adjacent treatment; optional swap for custom photography later.",
    coverVariant: "default",
    seo: {
      _type: "seo",
      metaTitle: META_TITLE,
      metaDescription: META_DESCRIPTION,
      socialImage: {
        ...imageField,
        alt: "Open Graph image for the Apple developer tooling essay; stylized Xcode icon on dark background.",
      },
      noIndex: false,
    },
    distributionPackage: {
      newsletterBlurb:
        "New essay: the gap between Apple’s polished dev story and what happens when you ship. Xcode, SwiftUI, SwiftData, docs, CI—and why better DX is a competitive feature now.",
      shortSocialPost:
        "I wrote about Apple dev tooling: the keynote story vs. shipping a real app. If you have ever lived inside .xcodeproj merge hell, this one is for you.",
      longSocialPost:
        "WWDC sells inevitability; your repo sells merge conflicts. New post on Apple’s dev stack: where the difficulty is artificial, what Swift Build does (and does not) change, SwiftUI previews, SwiftData trust, documentation omissions, and why developer experience is now a competitive feature.",
      teaserQuote: "The ecosystem does not need fairy dust. It needs product discipline.",
      ctaLabel: "Read the full essay",
    },
    publishedAt: now,
    status: "published",
    evergreenStatus: "current",
    refreshCadence: "quarterly",
    cta: {
      label: "More writing on tooling",
      href: "/blog",
      intent: "Keep readers in the archive after the essay",
    },
  };

  console.log("Creating / replacing post document…");
  await client.createOrReplace(post);

  console.log("\nDone.");
  console.log(`Post _id: ${POST_ID}`);
  console.log(`Slug: /blog/${SLUG}`);
  console.log(`Studio: https://tulio-cunha-dev.sanity.studio/structure/post;${POST_ID}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
