import dotenv from 'dotenv';
import { createClient } from '@sanity/client';

dotenv.config();

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID || '61249gtj',
  dataset: process.env.PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function setupWebhook() {
  // Check for required GitHub credentials
  const githubToken = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
  const githubRepo = process.env.GITHUB_REPOSITORY || 'tuliopc23/tulio-personal-website';
  
  if (!githubToken) {
    console.error('❌ Error: GITHUB_PERSONAL_ACCESS_TOKEN is not set');
    console.log('\n📋 Setup Instructions:');
    console.log('1. Go to https://github.com/settings/tokens');
    console.log('2. Click "Generate new token (classic)"');
    console.log('3. Name: "Sanity Webhook"');
    console.log('4. Permissions: Check "repo" (full control)');
    console.log('5. Copy the token');
    console.log('\n6. Add to .env:');
    console.log('   GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your-token-here');
    console.log('   GITHUB_REPOSITORY=tuliopc23/tulio-personal-website  # (optional)');
    process.exit(1);
  }
  
  // Build the webhook URL that will trigger GitHub Actions
  const githubWebhookUrl = `https://api.github.com/repos/${githubRepo}/dispatches`;

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error('❌ Error: SANITY_API_WRITE_TOKEN is not set in your environment');
    console.log('\n📋 Setup Instructions:');
    console.log('1. Go to https://www.sanity.io/manage');
    console.log('2. Select your project → API → Tokens');
    console.log('3. Create new token with "Editor" permissions');
    console.log('4. Add to .env: SANITY_API_WRITE_TOKEN=<your-token>');
    process.exit(1);
  }

  try {
    // Check if webhook already exists
    const existingHooks = await client.request({
      method: 'GET',
      uri: '/hooks',
    });

    const existingHook = existingHooks.find(
      (hook) => hook.name === 'Cloudflare Pages Deploy'
    );

    if (existingHook) {
      console.log('⚠️  Webhook already exists. Updating...');
      await client.request({
        method: 'DELETE',
        uri: `/hooks/${existingHook.id}`,
      });
    }

    // Create new webhook with GROQ-powered filter
    const webhook = await client.request({
      method: 'POST',
      uri: '/hooks',
      body: {
        name: 'GitHub Actions Deploy',
        description: 'Triggers GitHub Actions to rebuild Cloudflare Pages when articles are published',
        url: githubWebhookUrl,
        httpMethod: 'POST',
        
        // GROQ filter: only trigger on published posts (not drafts)
        filter: '_type == "post" && !(_id in path("drafts.**"))',
        
        // Projection: GitHub repository dispatch payload
        projection: `{
          "event_type": "sanity-content-update",
          "client_payload": {
            "documentId": _id,
            "documentType": _type,
            "title": title,
            "slug": slug.current,
            "publishedAt": publishedAt,
            "operation": select(
              delta::operation() == "create" => "created",
              delta::operation() == "update" => "updated",
              delta::operation() == "delete" => "deleted"
            )
          }
        }`,
        
        // Trigger on create, update, delete
        on: ['create', 'update', 'delete'],
        
        // Only published documents (not drafts)
        includeDrafts: false,
        
        // API version
        apiVersion: '2024-01-01',
        
        // Headers (required for GitHub API)
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'X-Sanity-Webhook': 'github-deploy',
        },
      },
    });

    console.log('✅ Webhook created successfully!');
    console.log('\n📋 Webhook Details:');
    console.log(`  ID: ${webhook.id}`);
    console.log(`  Name: ${webhook.name}`);
    console.log(`  URL: ${webhook.url}`);
    console.log(`  Filter: ${webhook.filter}`);
    console.log('\n🎉 Your site will now auto-deploy when you publish articles!');
    console.log('\n💡 Test it:');
    console.log('  1. Publish or update an article in Sanity Studio');
    console.log('  2. Check Cloudflare Pages deployment logs');
    console.log('  3. Your site should rebuild automatically');
    
  } catch (error) {
    console.error('❌ Error creating webhook:', error);
    
    if (error.statusCode === 401) {
      console.log('\n⚠️  Authentication failed. Check your SANITY_API_WRITE_TOKEN');
    } else if (error.statusCode === 404) {
      console.log('\n⚠️  Project not found. Check your PUBLIC_SANITY_PROJECT_ID');
    } else {
      console.log('\n⚠️  Full error:', JSON.stringify(error, null, 2));
    }
    
    process.exit(1);
  }
}

// Run the setup
console.log('🚀 Setting up Sanity webhook for Cloudflare Pages...\n');
setupWebhook();
