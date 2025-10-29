import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID || '61249gtj',
  dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01',
});

function generateKey() {
  return Math.random().toString(36).substr(2, 9);
}

function parseInlineText(text) {
  const children = [];
  let currentText = '';
  let i = 0;
  
  while (i < text.length) {
    if (text[i] === '*' && text[i + 1] === '*') {
      // Bold
      if (currentText) {
        children.push({
          _type: 'span',
          _key: generateKey(),
          text: currentText,
          marks: []
        });
        currentText = '';
      }
      
      i += 2;
      let boldText = '';
      while (i < text.length - 1 && !(text[i] === '*' && text[i + 1] === '*')) {
        boldText += text[i];
        i++;
      }
      i += 2;
      
      children.push({
        _type: 'span',
        _key: generateKey(),
        text: boldText,
        marks: ['strong']
      });
    } else if (text[i] === '*') {
      // Italic
      if (currentText) {
        children.push({
          _type: 'span',
          _key: generateKey(),
          text: currentText,
          marks: []
        });
        currentText = '';
      }
      
      i++;
      let italicText = '';
      while (i < text.length && text[i] !== '*') {
        italicText += text[i];
        i++;
      }
      i++;
      
      children.push({
        _type: 'span',
        _key: generateKey(),
        text: italicText,
        marks: ['em']
      });
    } else if (text[i] === '`') {
      // Code
      if (currentText) {
        children.push({
          _type: 'span',
          _key: generateKey(),
          text: currentText,
          marks: []
        });
        currentText = '';
      }
      
      i++;
      let codeText = '';
      while (i < text.length && text[i] !== '`') {
        codeText += text[i];
        i++;
      }
      i++;
      
      children.push({
        _type: 'span',
        _key: generateKey(),
        text: codeText,
        marks: ['code']
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

function markdownToPortableText(markdown) {
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
    
    if (trimmed.startsWith('### ')) {
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
      currentParagraph.push(trimmed);
    }
  }
  
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

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function uploadArticle(filepath, options = {}) {
  try {
    const markdown = readFileSync(filepath, 'utf-8');
    const lines = markdown.split('\n');
    
    // Extract title (first H1 or H2)
    let title = options.title;
    let contentStart = 0;
    
    if (!title) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('# ')) {
          title = line.substring(2);
          contentStart = i + 1;
          break;
        } else if (line.startsWith('## ')) {
          title = line.substring(3);
          contentStart = i + 1;
          break;
        }
      }
    }
    
    if (!title) {
      throw new Error('No title found. Add a title with --title or use # Title in the markdown');
    }
    
    const content = lines.slice(contentStart).join('\n');
    const slug = options.slug || slugify(title);
    const portableText = markdownToPortableText(content);
    
    console.log(`📝 Title: ${title}`);
    console.log(`🔗 Slug: ${slug}`);
    console.log(`📄 Content blocks: ${portableText.length}`);
    
    // Create document
    const doc = {
      _type: 'post',
      title,
      slug: { _type: 'slug', current: slug },
      body: portableText,
      publishedAt: new Date().toISOString(),
      featured: options.featured || false,
    };
    
    if (options.excerpt) {
      doc.excerpt = options.excerpt;
    }
    
    if (options.category) {
      // You'll need to fetch the category reference
      const category = await client.fetch(
        `*[_type == "category" && slug.current == $slug][0]`,
        { slug: options.category }
      );
      if (category) {
        doc.category = { _type: 'reference', _ref: category._id };
      }
    }
    
    console.log('\n⏳ Uploading to Sanity...');
    const result = await client.create(doc);
    
    console.log(`\n✅ Article uploaded successfully!`);
    console.log(`📍 Document ID: ${result._id}`);
    console.log(`🌐 View in Studio: https://tulio-cunha-dev.sanity.studio/desk/post;${result._id}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Parse CLI arguments
const args = process.argv.slice(2);
const filepath = args[0];

if (!filepath) {
  console.log(`
Usage: node scripts/upload-article.js <filepath> [options]

Options:
  --title "Article Title"
  --slug "article-slug"
  --excerpt "Short description"
  --category "category-slug"
  --featured

Example:
  node scripts/upload-article.js articles/my-post.md --title "My Post" --featured
  `);
  process.exit(1);
}

const options = {};
for (let i = 1; i < args.length; i++) {
  if (args[i] === '--title') options.title = args[++i];
  if (args[i] === '--slug') options.slug = args[++i];
  if (args[i] === '--excerpt') options.excerpt = args[++i];
  if (args[i] === '--category') options.category = args[++i];
  if (args[i] === '--featured') options.featured = true;
}

uploadArticle(filepath, options);
