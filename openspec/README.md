# OpenSpec Documentation

This directory contains structured documentation and change proposals for systematic development workflow with AI agents.

## Quick Start

### For Users

When working with AI agents on this project:

1. **For new features:** "I want to add [feature]. Create an OpenSpec proposal."
2. **For changes:** "Propose how we should implement [change] using OpenSpec."
3. **Review proposals:** Proposals are created in `proposals/` for your approval.
4. **Approve & implement:** Once you approve, the agent will implement following the spec.

### For AI Agents

1. **Read `AGENTS.md`** - Understand the workflow
2. **Read `project.md`** - Understand the project
3. **Create proposals** when appropriate (see AGENTS.md "When to Use OpenSpec")
4. **Follow the template** in `templates/proposal-template.md`
5. **Update status** as you progress: draft → approved → implemented

## Directory Structure

```
openspec/
├── README.md              # This file
├── AGENTS.md              # Workflow guide for AI agents
├── project.md             # Project tech stack and conventions
├── proposals/             # Change proposals
│   └── YYYY-MM-DD-description.md
└── templates/
    └── proposal-template.md
```

## Files

### AGENTS.md
Complete workflow guide for AI agents including:
- When to create proposals
- How to structure proposals
- Implementation workflow
- Best practices
- Integration with project tools

### project.md
Comprehensive project documentation:
- Tech stack (Astro, React, Sanity, TypeScript)
- Project structure
- Coding conventions
- Component patterns
- Development workflow
- Environment variables
- Design principles

### templates/proposal-template.md
Standard template for change proposals with sections for:
- Overview and problem statement
- Proposed changes and affected files
- Implementation plan
- Alternatives considered
- Risks and considerations
- Testing strategy
- Implementation notes

## Example Workflow

### Creating Your First Proposal

```
User: "I want to add a dark mode toggle button to the navbar"

Agent: 
1. Reads AGENTS.md and project.md
2. Creates openspec/proposals/2025-01-07-navbar-dark-mode-toggle.md
3. Documents the approach, affected components, implementation steps
4. Presents proposal to user for review
5. After approval, implements the changes
6. Updates proposal status to "implemented"
```

### Example Use Cases

✅ **Good for OpenSpec:**
- Adding new pages or major features
- Changing the content architecture
- Modifying the Sanity schema
- Refactoring component structure
- Adding new integrations
- Performance optimizations requiring structural changes

❌ **Skip OpenSpec for:**
- Fixing typos or small bugs
- Updating copy/content
- Adjusting CSS values
- Adding simple utility functions
- Documentation updates

## Benefits

1. **Clear Planning** - Think through changes before coding
2. **Better Communication** - Shared understanding between you and AI agents
3. **Documentation** - Proposals serve as architectural decision records
4. **Quality** - Thoughtful consideration of alternatives and risks
5. **Efficiency** - Less back-and-forth, fewer misunderstandings

## Tips

- Proposals are lightweight - don't overthink them
- They should clarify, not create bureaucracy
- Update them as you learn during implementation
- Keep them even after implementation (they're valuable history)
- Reference them in commits: "Implements proposal 2025-01-07-feature"

## Questions?

The OpenSpec system is designed to be simple and helpful. If it ever feels like overhead, you can always skip it for simpler changes. Use your judgment!
