# OpenSpec: Agent Workflow Guide

## Overview

OpenSpec is a structured workflow for managing code changes through proposals and specifications. This ensures thoughtful planning before implementation and maintains a clear record of architectural decisions.

## When to Use OpenSpec

Create an OpenSpec proposal when:
- **Planning new features** or capabilities
- **Making breaking changes** to APIs or data structures
- **Architecture changes** that affect multiple components
- **Performance optimizations** requiring structural changes
- **Security improvements** with system-wide impact
- **Ambiguous requests** that need clarification before coding

Skip OpenSpec for:
- Bug fixes (unless they require architectural changes)
- Documentation updates
- Simple refactoring without behavioral changes
- Trivial content or copy changes

## Workflow Steps

### 1. Create a Proposal

When a user requests a feature or change:

1. **Analyze the request** - Understand scope, impact, and requirements
2. **Read project.md** - Review tech stack, conventions, and constraints
3. **Create proposal file** - Use format: `openspec/proposals/YYYY-MM-DD-brief-description.md`
4. **Document the proposal** with these sections:
   - **Title** - Clear, concise description
   - **Status** - `draft`, `approved`, `implemented`, or `rejected`
   - **Date** - Creation date
   - **Overview** - What problem this solves and why
   - **Proposed Changes** - Specific files, components, or systems affected
   - **Implementation Plan** - Step-by-step approach
   - **Alternatives Considered** - Other approaches and why they weren't chosen
   - **Risks & Considerations** - Security, performance, breaking changes
   - **Testing Strategy** - How to verify the changes work

### 2. Review with User

Present the proposal to the user:
- Summarize the approach clearly
- Highlight any major decisions or trade-offs
- Ask for approval or modifications
- Discuss timeline and priorities

### 3. Implement

Once approved:
1. Update proposal status to `approved`
2. Follow the implementation plan step-by-step
3. Run tests as defined in testing strategy
4. Update proposal status to `implemented` when complete

### 4. Document Results

After implementation:
- Update the proposal with actual implementation notes
- Document any deviations from the plan and why
- Link to relevant commits or PRs
- Update project.md if conventions or architecture changed

## File Structure

```
openspec/
├── AGENTS.md           # This file - workflow guide
├── project.md          # Project-specific details
├── proposals/          # Change proposals
│   ├── 2025-01-07-example-feature.md
│   └── 2025-01-08-another-change.md
└── templates/          # Optional templates
    └── proposal-template.md
```

## Proposal Template

```markdown
# [Feature/Change Title]

**Status:** draft | approved | implemented | rejected
**Date:** YYYY-MM-DD
**Author:** AI Agent / User Name

## Overview

[Describe what problem this solves and why it's needed]

## Proposed Changes

### Files/Components Affected
- `src/component/Example.astro` - [what changes]
- `src/utils/helper.ts` - [what changes]

### API Changes
[If applicable, document new or changed APIs]

## Implementation Plan

1. [Step one]
2. [Step two]
3. [Step three]

## Alternatives Considered

### Alternative 1
[Description and why not chosen]

### Alternative 2
[Description and why not chosen]

## Risks & Considerations

- **Security:** [Any security implications]
- **Performance:** [Performance impact]
- **Breaking Changes:** [What breaks, migration path]
- **Dependencies:** [New dependencies or version changes]

## Testing Strategy

- [ ] Unit tests for [component]
- [ ] Integration tests for [workflow]
- [ ] Manual testing: [specific scenarios]
- [ ] Verify `bun run check` passes

## Implementation Notes

[Fill this in after implementation with actual results, deviations, learnings]
```

## Best Practices

### For AI Agents

1. **Be proactive** - Suggest OpenSpec for ambiguous or complex requests
2. **Read project.md first** - Understand the project before proposing
3. **Be specific** - Name actual files and functions, not placeholders
4. **Consider alternatives** - Show you've thought through options
5. **Verify before closing** - Always run the test suite

### Communication

- Keep proposals concise but thorough
- Use code examples when helpful
- Link to relevant documentation
- Update status promptly

### Version Control

- Commit proposals separately from implementation
- Use descriptive commit messages referencing the proposal
- Keep proposal files even after implementation (they're documentation)

## Integration with Existing Tools

This project uses:
- **Bun** for package management and scripts
- **ESLint** for linting (`bun run lint`)
- **Prettier** for formatting (`bun run format:check`)
- **TypeScript** for type checking (`bun run typecheck`)
- **Check script** combines all validation (`bun run check`)

Always run `bun run check` before marking a proposal as implemented.
