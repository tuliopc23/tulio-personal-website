import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config();

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN, // Using the write token found in .env
  useCdn: false,
  apiVersion: "2024-03-16",
});

async function fetchGitHubRepos() {
  const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN || process.env.GITHUB_TOKEN;
  if (!token) {
    console.error("GITHUB_TOKEN not found in .env");
    return [];
  }

  try {
    const res = await fetch(
      "https://api.github.com/users/tuliopc23/repos?per_page=100&sort=updated",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    }

    const repos = await res.json();
    return repos;
  } catch (error) {
    console.error("Error fetching from GitHub:", error);
    return [];
  }
}

async function seed() {
  console.log("Fetching repos from GitHub...");
  const ghRepos = await fetchGitHubRepos();

  if (ghRepos.length === 0) {
    console.log("No repos found to seed.");
    return;
  }

  console.log(`Found ${ghRepos.length} repos. Selecting the 6 most recently updated ones...`);

  // Pick the top 6 most recently updated repositories (filtering out forks if you want, but for now we'll take all)
  const reposToSeed = ghRepos.filter((r) => !r.fork).slice(0, 6);

  for (let i = 0; i < reposToSeed.length; i++) {
    const ghRepo = reposToSeed[i];
    const repoDoc = {
      _type: "featuredGithubRepo",
      repoFullName: ghRepo.full_name,
      displayTitle: ghRepo.name,
      category: ghRepo.language || "Code",
      featured: true,
      order: i + 1,
      showRepositoryLink: true,
      showPrivate: ghRepo.private,
      visibleInProofOfWork: true,
    };

    try {
      console.log(`Creating Sanity document for: ${repoDoc.repoFullName}...`);
      const result = await client.create(repoDoc);
      console.log(`✅ Success: ${result.repoFullName} (ID: ${result._id})`);
    } catch (err) {
      console.error(`❌ Error creating repo ${repoDoc.repoFullName}:`, err.message);
    }
  }
  console.log("Seeding complete!");
}

seed();
