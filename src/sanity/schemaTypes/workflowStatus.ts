import { defineType } from "sanity";

export default defineType({
  name: "workflowStatus",
  title: "Workflow Status",
  type: "string",
  options: {
    list: [
      { title: "Draft", value: "draft" },
      { title: "In Review", value: "in-review" },
      { title: "Approved", value: "approved" },
      { title: "Published", value: "published" },
      { title: "Archived", value: "archived" },
    ],
    layout: "radio",
  },
});
