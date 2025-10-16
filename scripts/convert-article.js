// Convert the markdown article to PortableText format
const markdown = `## When Desktop Was King

There was a time when "software" meant *desktop*. On a Mac, that meant carefully crafted native applications—Carbon, then Cocoa. I remember the passionate community around "Cocoa apps," entire sites curating design-obsessed Mac software. Almost every major enterprise tool had a Cocoa counterpart, and many of them offered *better experiences* than cross-platform equivalents. Those apps felt *alive*—personal, responsive, and deeply integrated.

## The Shift: When the Web Knocked on the Door

Then came the web. At first, it was a place to *read*, not to work. But with the rise of broadband and the cloud, browsers evolved into operating systems. Suddenly, apps didn't need installers. Deployment got easier and avoided frustrating vendor restrictions (looking at you, Apple). JavaScript took over; web developers became application developers. Big tech leaned in. The web evolved so fast that keeping up felt impossible—and web apps turned from companions into *primary interfaces*.

## The Native App "Feeling" Recognition

Electron began innocently—as the backend for the Atom editor. Companies quickly saw an opportunity: use web technologies to build *desktop apps*, maintain a single codebase, and ship to macOS, Windows, and Linux at once. Costs down, reach up. Financially? Brilliant.

The migration followed. Former Cocoa darlings moved to Electron; browser-born tools shipped "desktop" versions. And despite complaints, the decision made sense: browser tabs are chaotic, compatibility is messy, and users *do* want apps installed on their machines. Score one for Electron.

## The Overhead Companies Chose to Ignore

Electron didn't revive native desktop—it *simulated it*. Each app carries a full Chromium instance. A "simple" notes app can eat hundreds of MBs just to draw a window. Idle CPU spikes, sluggish startup—this isn't the lightweight elegance we associate with native software.

Beyond performance, something deeper is lost: *coherence*. Many apps ignore system conventions—macOS animations, menu standards, gestures, scrolling physics. Some don't even call basic OS APIs. The result? A subtle but persistent downgrade. The experience becomes *generic*, detached from the platform.

## The Web's Qualities

I love the web. Most of my projects are web-based. The web is a fast-moving, open platform that supercharges open source and makes deep customization possible. Meanwhile, native ecosystems can feel painful: proprietary SDKs, restrictive policies, App Store rules—again, Apple. The web lets you build what you want with community-driven tools. It's exciting and empowering.

## My Confession

Still—*nothing beats a well-crafted native Mac app*. The responsiveness. The buttery animations. The global shortcuts. The alignment with system conventions. The inexplicable *feel*. It's ergonomics and rhythm, not nostalgia.

I constantly search (often in vain) for native alternatives to web-wrapped tools. From development to productivity, I choose native whenever I can. It's getting harder to find them.

---

## The Lost Potential—And the Indie Opportunity

It's not just big companies shipping Electron now. Indie developers—the people who once *defined* native craft—are following suit. Maker communities are full of Electron, Tauri, and Flutter. One codebase, three platforms. Faster to ship. Broader reach. Logical, sure. But here's the dangerous truth:

> **By building with the same generic tools as billion-dollar companies, indie developers step onto the giants' battlefield.**

And there—where massive teams, growth budgets, and QA armies dominate—you can't win by playing *their* game.

### Native as a Competitive Edge

Native is an *advantage*. Native is a *niche*. You may not reach everyone—but you don't need everyone. Indies don't need a million users. They need **a thousand true fans**—the kind who *pay*, *stay*, and *advocate*. Those users live on platforms like macOS, where quality still matters. Where people happily buy a wonderfully made menu-bar utility. Where attention to detail is a *currency*.

> **Native apps create loyalty. Web wrappers create utility. One is kept; the other is replaced.**

### Quality Over Reach

Big tech optimizes for reach. Indies should optimize for *love*.  
Big tech ships features. Indies can ship *feelings*.

When everything is just another Chromium window, luxury becomes something rooted in the OS—something that *belongs there*.

## A Final Thought

We didn't fall in love with software because it ran everywhere.  
We fell in love because it *felt like it was made for us*.

The giants moved on. The field is open. It's waiting—not for another wrapper, but for the next generation of *true desktop software*.

**For indie developers, native isn't a limitation.  
It's the last frontier.  
The lost potential—waiting to be claimed.**`;

function generateKey() {
  return Math.random().toString(36).substr(2, 9);
}

function parseInlineText(text) {
  const children = [];
  let currentText = '';
  let i = 0;
  
  while (i < text.length) {
    if (text[i] === '*' && text[i + 1] !== '*') {
      // Single asterisk - italic
      if (currentText) {
        children.push({
          _type: 'span',
          _key: generateKey(),
          text: currentText,
          marks: []
        });
        currentText = '';
      }
      
      i++; // Skip opening *
      let italicText = '';
      while (i < text.length && text[i] !== '*') {
        italicText += text[i];
        i++;
      }
      i++; // Skip closing *
      
      children.push({
        _type: 'span',
        _key: generateKey(),
        text: italicText,
        marks: ['em']
      });
    } else if (text[i] === '*' && text[i + 1] === '*') {
      // Double asterisk - bold
      if (currentText) {
        children.push({
          _type: 'span',
          _key: generateKey(),
          text: currentText,
          marks: []
        });
        currentText = '';
      }
      
      i += 2; // Skip opening **
      let boldText = '';
      while (i < text.length - 1 && !(text[i] === '*' && text[i + 1] === '*')) {
        boldText += text[i];
        i++;
      }
      i += 2; // Skip closing **
      
      children.push({
        _type: 'span',
        _key: generateKey(),
        text: boldText,
        marks: ['strong']
      });
    } else {
      currentText += text[i];
      i++;
    }
  }
  
  if (currentText) {
    children.push({
      _type: 'span',
      _key: generateKey(),
      text: currentText,
      marks: []
    });
  }
  
  return children;
}

function convertToPortableText(markdown) {
  const lines = markdown.split('\n');
  const blocks = [];
  let currentParagraph = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (!trimmed) {
      if (currentParagraph.length > 0) {
        blocks.push({
          _type: 'block',
          _key: generateKey(),
          style: 'normal',
          children: parseInlineText(currentParagraph.join(' ')),
          markDefs: []
        });
        currentParagraph = [];
      }
      continue;
    }
    
    if (trimmed === '---') {
      // Divider
      if (currentParagraph.length > 0) {
        blocks.push({
          _type: 'block',
          _key: generateKey(),
          style: 'normal',
          children: parseInlineText(currentParagraph.join(' ')),
          markDefs: []
        });
        currentParagraph = [];
      }
      
      blocks.push({
        _type: 'divider',
        _key: generateKey()
      });
      continue;
    }
    
    if (trimmed.startsWith('### ')) {
      // H3
      if (currentParagraph.length > 0) {
        blocks.push({
          _type: 'block',
          _key: generateKey(),
          style: 'normal',
          children: parseInlineText(currentParagraph.join(' ')),
          markDefs: []
        });
        currentParagraph = [];
      }
      
      blocks.push({
        _type: 'block',
        _key: generateKey(),
        style: 'h3',
        children: parseInlineText(trimmed.substring(4)),
        markDefs: []
      });
    } else if (trimmed.startsWith('## ')) {
      // H2
      if (currentParagraph.length > 0) {
        blocks.push({
          _type: 'block',
          _key: generateKey(),
          style: 'normal',
          children: parseInlineText(currentParagraph.join(' ')),
          markDefs: []
        });
        currentParagraph = [];
      }
      
      blocks.push({
        _type: 'block',
        _key: generateKey(),
        style: 'h2',
        children: parseInlineText(trimmed.substring(3)),
        markDefs: []
      });
    } else if (trimmed.startsWith('> ')) {
      // Blockquote
      if (currentParagraph.length > 0) {
        blocks.push({
          _type: 'block',
          _key: generateKey(),
          style: 'normal',
          children: parseInlineText(currentParagraph.join(' ')),
          markDefs: []
        });
        currentParagraph = [];
      }
      
      blocks.push({
        _type: 'block',
        _key: generateKey(),
        style: 'blockquote',
        children: parseInlineText(trimmed.substring(2)),
        markDefs: []
      });
    } else {
      // Regular text - accumulate for paragraph
      currentParagraph.push(trimmed);
    }
  }
  
  // Handle final paragraph
  if (currentParagraph.length > 0) {
    blocks.push({
      _type: 'block',
      _key: generateKey(),
      style: 'normal',
      children: parseInlineText(currentParagraph.join(' ')),
      markDefs: []
    });
  }
  
  return blocks;
}

const portableText = convertToPortableText(markdown);
console.log(JSON.stringify(portableText, null, 2));
