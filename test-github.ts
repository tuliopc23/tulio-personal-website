import { loadQuery } from "./src/sanity/lib/load-query.ts";

async function test() {
  console.log("Fetching Sanity repos...");
  const query = `
    *[_type == "featuredGithubRepo" && featured == true && visibleInProofOfWork == true] | order(order asc) {
      _id,
      repoFullName,
      displayTitle,
      description,
      category,
      featured,
      order,
      showRepositoryLink,
      showPrivate,
      visibleInProofOfWork
    }
  `;
  try {
    const { data } = await loadQuery({ query });
    console.log("Sanity repos:", data);
  } catch (err) {
    console.error("Sanity query error:", err);
  }
}
test();
