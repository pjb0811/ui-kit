## Commit Message Generation Guide

This document is a guide for writing commit messages.
Please write it accurately as it will be used for actual commits.

### Basic Format

```
<emoji> <type>(<scope>): <short summary>
│       │        │            │
│       │        │            └─⫸ Imperative, present tense. No capitalization. No period at the end.
│       │        │
│       │        └─⫸ Optional. Only when the change is clearly scoped to one specific area
│       │
│       └─⫸ feat|fix|docs|style|refactor|test|chore|perf|ci|build
│
└─⫸ Select only one gitmoji most appropriate for the change
```

**Language**: English

### Commit Types

| Type       | Description                                 |
| ---------- | ------------------------------------------- |
| `feat`     | Add new feature                             |
| `fix`      | Fix bug                                     |
| `docs`     | Add/update documentation                    |
| `style`    | Code style changes (formatting, semicolons) |
| `refactor` | Code structure improvements                 |
| `perf`     | Performance optimization                    |
| `test`     | Add/update tests                            |
| `chore`    | Build, dependencies, and other changes      |
| `ci`       | CI/CD configuration changes                 |
| `build`    | Build system changes                        |

### Scope Writing Rules

Scope is optional. Add it only when the change is clearly limited to one specific area, e.g.:

- hooks: `useBodyScrollLock`, `useDebounce`, `useLocalStorage`, etc.
- UI: `components`, `styles`
- config: `config`, `build`

**Don't use the branch name as scope** — branch names (especially ones with slashes, like `feat/main`) aren't valid conventional-commit scopes.

For changes spanning multiple areas (e.g. a CI/release pipeline overhaul, a broad documentation cleanup), omit the scope entirely rather than forcing it into one.

### Gitmoji Selection

**Rules**:

- Select **only one** gitmoji from https://gitmoji.dev/
- Add **one space** after gitmoji
- Place before type

**Complete Gitmoji List**:

| Emoji | Description                                      |
| ----- | ------------------------------------------------ |
| 🎨    | Improve structure/format of code                 |
| ⚡️    | Improve performance                              |
| 🔥    | Remove code or files                             |
| 🐛    | Fix a bug                                        |
| 🚑️    | Critical hotfix                                  |
| ✨    | Introduce new features                           |
| 📝    | Add or update documentation                      |
| 🚀    | Deploy stuff                                     |
| 💄    | Add or update UI and style files                 |
| 🎉    | Begin a project                                  |
| ✅    | Add, update, or pass tests                       |
| 🔒️    | Fix security or privacy issues                   |
| 🔐    | Add or update secrets                            |
| 🔖    | Release / Version tags                           |
| 🚨    | Fix compiler / linter warnings                   |
| 🚧    | Work in progress                                 |
| 💚    | Fix CI Build                                     |
| ⬇️    | Downgrade dependencies                           |
| ⬆️    | Upgrade dependencies                             |
| 📌    | Pin dependencies to specific versions            |
| 👷    | Add or update CI build system                    |
| 📈    | Add or update analytics or track code            |
| ♻️    | Refactor code                                    |
| ➕    | Add a dependency                                 |
| ➖    | Remove a dependency                              |
| 🔧    | Add or update configuration files                |
| 🔨    | Add or update development scripts                |
| 🌐    | Internationalization and localization            |
| ✏️    | Fix typos                                        |
| 💩    | Write bad code that needs to be improved         |
| ⏪️    | Revert changes                                   |
| 🔀    | Merge branches                                   |
| 📦️    | Add or update compiled files or packages         |
| 👽️    | Update code due to external API changes          |
| 🚚    | Move or rename resources (files, paths, routes)  |
| 📄    | Add or update license                            |
| 💥    | Introduce breaking changes                       |
| 🍱    | Add or update assets                             |
| ♿️    | Improve accessibility                            |
| 💡    | Add or update comments in source code            |
| 🍻    | Write code drunkenly                             |
| 💬    | Add or update text and literals                  |
| 🗃️    | Perform database related changes                 |
| 🔊    | Add or update logs                               |
| 🔇    | Remove logs                                      |
| 👥    | Add or update contributor(s)                     |
| 🚸    | Improve user experience / usability              |
| 🏗️    | Make architectural changes                       |
| 📱    | Work on responsive design                        |
| 🤡    | Mock things                                      |
| 🥚    | Add or update an easter egg                      |
| 🙈    | Add or update a .gitignore file                  |
| 📸    | Add or update snapshots                          |
| ⚗️    | Perform experiments                              |
| 🔍️    | Improve SEO                                      |
| 🏷️    | Add or update types                              |
| 🌱    | Add or update seed files                         |
| 🚩    | Add, update, or remove feature flags             |
| 🥅    | Catch errors                                     |
| 💫    | Add or update animations and transitions         |
| 🗑️    | Deprecate code that needs to be cleaned up       |
| 🛂    | Work on code related to authorization, roles     |
| 🩹    | Simple fix for a non-critical issue              |
| 🧐    | Data exploration/inspection                      |
| ⚰️    | Remove dead code                                 |
| 🧪    | Add a failing test                               |
| 👔    | Add or update business logic                     |
| 🩺    | Add or update healthcheck                        |
| 🧱    | Infrastructure related changes                   |
| 🧑‍💻    | Improve developer experience                     |
| 💸    | Add sponsorships or money related infrastructure |
| 🧵    | Add or update code related to multithreading     |
| 🦺    | Add or update code related to validation         |
| ✈️    | Improve offline support                          |
| 🦖    | Add backward compatibility                       |

### Message Body Writing

- **Summarize the main title in one line**
- **List message body in bullet point format**
- Add `-` before each item
- Describe detailed changes in list format

### Notes

- **Exclude lock file changes from interpretation**: Lock file changes like `package-lock.json`, `pnpm-lock.yaml` are often auto-generated, so please exclude them when interpreting commit messages.
- **Check based on staged files**: When writing/interpreting commit messages, only consider files that are staged for commit.

### Examples

```
✨ feat(auth): add user authentication feature

- Implement JWT-based login/logout
- Add automatic token refresh logic
- Configure global authentication state management
```

```
🐛 fix(use-query): fix metaform type error

- Change any type to specific type in useMutation
- Improve error handling logic in useQuery
- Resolve circular reference warning
```

```
♻️ refactor(events): improve event directory structure

- Reorganize component folders
- Improve naming consistency
- Remove unnecessary files
```
