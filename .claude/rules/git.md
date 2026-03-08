---
description: "Git commit standards, branch naming, and merge request workflow"
---

# Development Workflow

## Conventional Commits

All commits follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

**Format:**

```
<type>[optional scope]: <description>

<body>

[optional footer(s)]
```

**Required Types:**

| Type       | Purpose                  |
| ---------- | ------------------------ |
| `feat`     | New features             |
| `fix`      | Bug fixes                |
| `docs`     | Documentation            |
| `style`    | Code style changes       |
| `refactor` | Code refactoring         |
| `test`     | Test additions/changes   |
| `chore`    | Build/tool changes       |
| `perf`     | Performance improvements |
| `ci`       | CI/CD changes            |

## Commit Rules

- **One logical change per commit** — no bundling unrelated changes
- **Working code only** — never commit broken builds
- Commit after every logical unit of work

## Branch Naming

Pattern: `<type>/<short-description>`

