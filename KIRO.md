# context-mode routing

This repo may also have `AGENTS.md` or other repo-local guidance. Follow those stronger repo-specific rules first.

When `context-mode` MCP tools are available in Kiro, use them for large-output analysis and indexed retrieval.

- Prefer `@context-mode/ctx_batch_execute`, `@context-mode/ctx_search`, `@context-mode/ctx_execute`, and `@context-mode/ctx_execute_file`.
- Avoid `curl`, `wget`, long raw shell output, and direct large web fetches when `context-mode` can keep data in the sandbox.
- Keep native editor tools for file writes. Do not use `context-mode` execution tools to write files.
