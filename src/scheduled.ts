// Cloudflare Workers Scheduled Handler
// This file handles Cloudflare Cron Triggers for scheduled publishing
// Only used when deployed to Cloudflare Workers with cron triggers enabled

/// <reference types="@cloudflare/workers-types" />

export interface Env {
  CRON_SECRET: string;
  SANITY_API_WRITE_TOKEN: string;
  PUBLIC_SANITY_PROJECT_ID: string;
  PUBLIC_SANITY_DATASET: string;
}

export default {
  async scheduled(
    event: ScheduledController,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    console.log('Cloudflare Cron Trigger: Publishing scheduled posts...');
    console.log('Trigger time:', new Date(event.scheduledTime).toISOString());

    try {
      // Call the publish-scheduled API endpoint
      const response = await fetch('https://www.tuliocunha.dev/api/publish-scheduled', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${env.CRON_SECRET}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${JSON.stringify(result)}`);
      }

      console.log('✅ Successfully published scheduled posts:', result);
    } catch (error) {
      console.error('❌ Error publishing scheduled posts:', error);
      // Don't throw - let the cron continue on next schedule
    }
  },
};
