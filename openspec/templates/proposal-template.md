# [Feature/Change Title]

**Status:** draft
**Date:** YYYY-MM-DD
**Author:** [Your Name / AI Agent]

## Overview

[Describe what problem this solves and why it's needed. Be specific about the user need or technical requirement driving this change.]

## Proposed Changes

### Files/Components Affected
- `src/component/Example.astro` - [specific changes]
- `src/utils/helper.ts` - [specific changes]
- Add any new files that will be created

### API Changes (if applicable)
```typescript
// Before
interface OldAPI {
  // ...
}

// After
interface NewAPI {
  // ...
}
```

### Data Structure Changes (if applicable)
[Document any changes to Sanity schemas, TypeScript types, or data formats]

## Implementation Plan

1. **Step 1** - [Detailed description]
   - Specific files: `src/...`
   - What changes: [...]
   
2. **Step 2** - [Detailed description]
   - Specific files: `src/...`
   - What changes: [...]
   
3. **Step 3** - [Detailed description]
   - Specific files: `src/...`
   - What changes: [...]

4. **Testing & Verification**
   - Run `bun run check`
   - Manual testing steps
   - Visual review

## Alternatives Considered

### Alternative 1: [Name]
**Approach:** [Description]
**Pros:** [Benefits]
**Cons:** [Drawbacks]
**Why not chosen:** [Reasoning]

### Alternative 2: [Name]
**Approach:** [Description]
**Pros:** [Benefits]
**Cons:** [Drawbacks]
**Why not chosen:** [Reasoning]

## Risks & Considerations

### Security
- [Any security implications or concerns]
- [Authentication/authorization impacts]
- [Data privacy considerations]

### Performance
- [Expected performance impact]
- [Bundle size changes]
- [Runtime performance considerations]

### Breaking Changes
- [What breaks in the public API]
- [What breaks for content editors]
- [Migration path if applicable]

### Dependencies
- [New dependencies to add]
- [Version upgrades required]
- [Potential conflicts]

### Design/UX Impact
- [Visual changes]
- [User experience considerations]
- [Accessibility impacts]

### Browser/Device Support
- [Any compatibility concerns]
- [Progressive enhancement needs]

## Testing Strategy

### Automated Tests
- [ ] Unit tests for [specific functionality]
- [ ] Type checking passes (`bun run typecheck`)
- [ ] Linting passes (`bun run lint`)
- [ ] Build succeeds (`bun run build`)

### Manual Testing
- [ ] Test in Chrome/Safari/Firefox
- [ ] Test light and dark modes
- [ ] Test responsive layouts (mobile, tablet, desktop)
- [ ] Test keyboard navigation
- [ ] Test screen reader if UI changes
- [ ] Visual review against Apple HIG principles

### Sanity Testing (if applicable)
- [ ] Test content editing in Studio
- [ ] Test Portable Text rendering
- [ ] Verify visual editing overlays work
- [ ] Test with different content scenarios

## Documentation Updates

- [ ] Update `openspec/project.md` if architecture changes
- [ ] Update component comments if needed
- [ ] Update README.md if user-facing changes
- [ ] Update environment variable docs if applicable

## Implementation Notes

[Fill this section in AFTER implementation]

### What Was Actually Done
[Describe what was implemented, any deviations from the plan]

### Challenges Encountered
[Document any unexpected issues and how they were resolved]

### Lessons Learned
[What would you do differently next time]

### Follow-up Items
[Any technical debt or future improvements identified]

### Commits/PRs
- Commit: [hash] - [message]
- PR: [link if applicable]

### Verification Results
```bash
# Output from bun run check
[paste results here]
```
