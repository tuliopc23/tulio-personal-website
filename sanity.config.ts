import { codeInput } from "@sanity/code-input";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { resolve } from "./src/sanity/lib/resolve";
import { schemaTypes } from "./src/sanity/schemaTypes";

const projectId = "61249gtj";
const dataset = "production";
const previewUrl = "https://tulio-cunha-dev.vercel.app";

export default defineConfig({
  name: "tulio-personal-website",
  title: "Tulio's Blog",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Articles")
              .icon(() => "📄")
              .child(S.documentTypeList("post").title("All Articles")),

            S.divider(),

            S.listItem()
              .title("⭐ Featured Articles")
              .child(
                S.documentList()
                  .title("Featured Articles")
                  .filter('_type == "post" && featured == true'),
              ),

            S.divider(),

            S.listItem()
              .title("Categories")
              .icon(() => "🏷️")
              .schemaType("category")
              .child(S.documentTypeList("category").title("Categories")),

            S.listItem()
              .title("Author")
              .icon(() => "👤")
              .schemaType("author")
              .child(S.documentTypeList("author").title("Author")),
          ]),
    }),
    presentationTool({
      resolve,
      previewUrl,
    }),
    codeInput(),
  ],
  schema: {
    types: schemaTypes,
  },
});
