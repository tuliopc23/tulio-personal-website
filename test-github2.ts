import { loadQuery } from "./src/sanity/lib/load-query.ts";

async function test() {
  console.log("Fetching all featuredGithubRepo documents...");
  const query = `*[_type == "featuredGithubRepo"] { _id, repoFullName, featured, visibleInProofOfWork }`;
  try {
    const { data } = await loadQuery({ query });
    console.log("All Sanity repos:", data);
  } catch (err) {
    console.error("Sanity query error:", err);
  }
}
test();
