import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID || '61249gtj',
  dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2023-05-03',
});

// Simple markdown to PortableText converter
function markdownToPortableText(markdown) {
  const lines = markdown.split('\n');
  const blocks = [];
  let currentBlock = null;

  for (const line of lines) {
    const trimmed = line.trim();
    
    if (!trimmed) {
      if (currentBlock) {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      continue;
    }

    // Headers
    if (trimmed.startsWith('## ')) {
      if (currentBlock) blocks.push(currentBlock);
      blocks.push({
        _type: 'block',
        _key: Math.random().toString(36).substr(2, 9),
        style: 'h2',
        children: [{
          _type: 'span',
          _key: Math.random().toString(36).substr(2, 9),
          text: trimmed.substring(3),
          marks: []
        }],
        markDefs: []
      });
      currentBlock = null;
    } else if (trimmed.startsWith('### ')) {
      if (currentBlock) blocks.push(currentBlock);
      blocks.push({
        _type: 'block',
        _key: Math.random().toString(36).substr(2, 9),
        style: 'h3',
        children: [{
          _type: 'span',
          _key: Math.random().toString(36).substr(2, 9),
          text: trimmed.substring(4),
          marks: []
        }],
        markDefs: []
      });
      currentBlock = null;
    } else {
      // Regular paragraph
      if (!currentBlock) {
        currentBlock = {
          _type: 'block',
          _key: Math.random().toString(36).substr(2, 9),
          style: 'normal',
          children: [],
          markDefs: []
        };
      }
      
      if (currentBlock.children.length > 0) {
        currentBlock.children.push({
          _type: 'span',
          _key: Math.random().toString(36).substr(2, 9),
          text: ' ' + trimmed,
          marks: []
        });
      } else {
        currentBlock.children.push({
          _type: 'span',
          _key: Math.random().toString(36).substr(2, 9),
          text: trimmed,
          marks: []
        });
      }
    }
  }

  if (currentBlock) {
    blocks.push(currentBlock);
  }

  return blocks;
}

async function convertMarkdownToPortableText() {
  console.log('Fetching posts with markdown content...');
  
  // Get all posts
  const posts = await client.fetch(`
    *[_type == "post"] {
      _id,
      title,
      content
    }
  `);

  console.log(`Found ${posts.length} posts`);

  for (const post of posts) {
    if (typeof post.content === 'string' && post.content.includes('#')) {
      console.log(`Converting "${post.title}"...`);
      
      try {
        const portableText = markdownToPortableText(post.content);

        // Update the post in Sanity
        await client
          .patch(post._id)
          .set({ content: portableText })
          .commit();

        console.log(`✅ Converted "${post.title}"`);
      } catch (error) {
        console.error(`❌ Failed to convert "${post.title}":`, error.message);
      }
    } else {
      console.log(`⏭️  Skipping "${post.title}" (already PortableText or no markdown)`);
    }
  }

  console.log('Conversion complete!');
}

convertMarkdownToPortableText().catch(console.error);
