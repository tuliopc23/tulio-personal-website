import { defineField, defineType } from "sanity";

export default defineType({
  name: "featuredGithubRepo",
  type: "document",
  title: "Featured GitHub Repo",
  fields: [
    defineField({
      name: "repoFullName",
      type: "string",
      title: "Repository Full Name",
      description: "e.g., owner/repo (tuliopc23/tulio-personal-website)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "displayTitle",
      type: "string",
      title: "Display Title Override",
      description: "Optional: Override the repository name for display.",
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description Override",
      description: "Optional: Override the repository description provided by GitHub.",
      rows: 3,
    }),
    defineField({
      name: "category",
      type: "string",
      title: "Category",
      description: "e.g., Open Source, Personal, Client",
    }),
    defineField({
      name: "featured",
      type: "boolean",
      title: "Featured",
      description: "Include this repository in the Proof of Work section.",
      initialValue: true,
    }),
    defineField({
      name: "order",
      type: "number",
      title: "Order",
      description: "Sorting priority for the components.",
      initialValue: 0,
    }),
    defineField({
      name: "showRepositoryLink",
      type: "boolean",
      title: "Show Repository Link",
      description: "Whether to render the outbound link to the repository.",
      initialValue: true,
    }),
    defineField({
      name: "showPrivate",
      type: "boolean",
      title: "Render Private Repository",
      description:
        "Allow rendering even if the repository is private. Warning: this requires a valid GitHub token with private access.",
      initialValue: false,
    }),
    defineField({
      name: "visibleInProofOfWork",
      type: "boolean",
      title: "Visible in Proof of Work",
      description: "Specifically show this repo in the Proof of Work section.",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "displayTitle",
      subtitle: "repoFullName",
      featured: "featured",
    },
    prepare({ title, subtitle, featured }) {
      return {
        title: title || subtitle,
        subtitle: `${subtitle} ${featured ? "(Featured)" : ""}`,
      };
    },
  },
});
