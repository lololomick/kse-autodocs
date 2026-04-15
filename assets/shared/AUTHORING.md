# Documentation authoring guide

This file is the instruction set for any AI agent (Claude, Copilot, any tool that can read and write files) asked to create or update documentation under `docs/`. Follow it as written. The goal is that every generated doc reads like it was written by the same careful human.

---

## 1. Mission

Produce developer documentation that:

- Is **written for humans**, not for AI — readable, well-formatted prose, not a type reference dump.
- Explains **what the code does and why**, not just what functions exist.
- Is **complete in its enumerations**: if there are 11 states, list all 11. Never "X, Y, etc.".
- Is structured so **customer-facing documentation can later be derived** without rewriting from scratch.
- Is written in **English**.

If a sentence reads like it came from a code generator, rewrite it.

---

## 2. Audience and register

**Primary audience:** developers who need to understand a component well enough to modify or extend it.
**Secondary audience:** the same developers six months later when they have forgotten everything.
**Derived audience:** technical writers who will later adapt the *Purpose* and behaviour sections into customer documentation.

Register is plain technical prose. Not marketing, not academic, not chatty.

- Short sentences. Active voice.
- Name things by their real names (exact class names, exact attribute names). Do not soften them.
- Assume the reader knows the general shape of the language/framework but not this specific code.
- No emojis. No sign-off. No "hope this helps".

---

## 3. Language detection

Before writing anything, identify the primary language(s) of the repository. Probe in this order; first match wins as the primary language.

| Signal | Language |
| --- | --- |
| `*.sln`, `*.csproj`, `*.fsproj`, `*.vbproj` | C# / F# / VB.NET |
| `package.json` with `typescript` dependency, `tsconfig.json` | TypeScript |
| `package.json` without TypeScript | JavaScript |
| `pyproject.toml`, `setup.py`, `requirements.txt` | Python |
| `Cargo.toml` | Rust |
| `go.mod` | Go |
| `pom.xml`, `build.gradle`, `build.gradle.kts` | Java / Kotlin |
| `Gemfile` | Ruby |
| `composer.json` | PHP |
| `mix.exs` | Elixir |
| `Package.swift` | Swift |
| `CMakeLists.txt`, `Makefile` with `*.c`/`*.cpp` | C / C++ |

A repository may contain more than one language (e.g. a C# backend + a TypeScript frontend). In that case document each tree under its own top-level folder in `docs/` (e.g. `docs/backend/`, `docs/frontend/`).

---

## 4. File organisation

### 4.1. Folder layout mirrors the source layer

Identify the top-level source folder and its immediate children (the *layers*). Mirror that structure under `docs/`.

| Language | Typical layer root | Example layer folders |
| --- | --- | --- |
| C# / .NET | `src/<Project>/` or project root | `Domain`, `Services`, `Infrastructure`, `Common` |
| TypeScript / JavaScript | `src/` | `components`, `hooks`, `services`, `api` |
| Python | `<package>/` | sub-packages |
| Rust | `src/` | modules |
| Go | project root | packages |
| Java / Kotlin | `src/main/java/<package>/` | sub-packages |

If the layer concept does not apply (e.g. a flat small project), mirror the folder structure directly.

Add new top-level folders under `docs/` only when a new source layer appears.

### 4.2. One doc per component — NOT one doc per file

A "component" is the smallest piece a developer would think about as a unit. The mapping from source files to docs is:

| Source shape | Doc shape |
| --- | --- |
| One large file (≥ ~500 lines) implementing a non-trivial concept | Its own `.md` file named after the primary type (e.g. `TransportHandler.md`, `UserService.md`, `parser.md`). |
| An interface + its single implementation, both small | One `.md` covering both (e.g. `Threading.md` covers `IComExecutor` + `StaComThread`). |
| A folder of closely related small files that form one module | One `.md` named after the folder (e.g. `Attributes.md`, `middleware.md`). |
| A folder of enums, constants, DTOs, codes shared across the system | One shared doc under `docs/Reference/` (e.g. `StatesAndCodes.md`, `ApiErrors.md`). |
| Trivial: DI registration, `main`/`Program.cs`/`index.ts` bootstrap, generated code, tests | No doc. |

**When in doubt, merge.** One longer doc is better than five thin ones that cross-reference each other.

### 4.3. Naming

- File names match the primary class / folder they cover.
- Use the same casing convention as the source language (C# → `PascalCase.md`, JS/Python → `snake_case.md` or `kebab-case.md`, consistent within a project).
- Lowercase for meta-docs (`authoring.md`, `index.md`, `README.md`).

### 4.4. Reference docs for shared values

Any enumeration, code table, constant list, or flag set referenced by more than one component goes into `docs/Reference/`, not into the component doc. Component docs link to the reference sections and only inline-mention the specific values they raise or consume.

### 4.5. When to split a doc

Split only when:

1. The doc exceeds ~800 lines, **and**
2. It covers two clearly separable concerns that do not need to be read together.

Otherwise keep them in one file with clear `##` headings. Scrollable beats fragmented.

---

## 5. Document structure

### 5.1. Required top section (every doc)

```markdown
# {Layer} / {Component}

{One or two sentences describing what this component is and what role it plays.
Prose, not bullets. This paragraph is the most likely candidate for reuse in
customer docs — make it good.}

- **Namespace / Package / Module:** `...`
- **Files:** [File1.ext](relative/path), [File2.ext](relative/path)
- **Layer:** {layer}
- **Lifetime:** {Singleton | Scoped | Transient | "One per X" | "Module-level"}

---
```

If any source file is very large, add a one-line callout under the metadata:

```markdown
> {File} is ~{N} lines. This document is a behavioural reference, not a
> line-by-line walkthrough. The **Source map** at the bottom points each topic
> to its location in the code.
```

### 5.2. Required prose section: *What X does* (or *Why X exists*)

Immediately after the metadata, every doc has a prose section explaining the component in plain language. Choose the heading that fits:

- **"What the {component} does"** — when the component has user-visible behaviour (handlers, services, features).
- **"Why this module exists"** — when the component is pure infrastructure and the motivation is not obvious from its API.
- **"Purpose"** — short fallback.

Prose only. No bullets. 2–5 short paragraphs. This is the most important section of the doc.

### 5.3. Architecture context with ASCII diagram

```markdown
## Architecture context

```
{ASCII box-and-arrow diagram. The component in the middle, immediate
collaborators around it. Do NOT draw the whole system.}
```

- **Called by:** ...
- **Calls into:** ...
- **Publishes to / Subscribes on:** ... (when relevant)
```

Use box characters `│ ├ ▼ ◄ ─ └ ┌ ┐ ┘` or ASCII `| +- -> <-`. Lines under 90 columns. Do not use Mermaid — it breaks in PR diffs.

### 5.4. Behaviour sections

After the architecture context, the doc is a sequence of prose sections describing what the component does under different conditions. Section headings should be **operational**, not structural:

- Good: "Startup sequence", "Shutdown behaviour", "Error handling", "Authentication flow", "Destination changes on-the-fly".
- Bad: "Public methods", "State properties", "DI dependencies".

Prose first. Tables only when content is genuinely tabular (enumerations, code lists, parameter matrices). **Never** use tables for function/method signatures.

### 5.5. Enumerations and codes

- If a value set is fully enumerated in this doc, list every value with a description. Never use "etc." or "...".
- If the set lives in a reference doc, link to it and list only the specific values used in this component.

### 5.6. Source map (large files only)

If any source file in the component exceeds ~1000 lines, end the doc with a `## Source map` section that maps every section marker (C# `#region`, Python class / function, Rust `mod`, Go top-level declarations) to its line number.

```markdown
| Line | Section |
| --- | --- |
| 38 | Dependencies |
| 232 | Constructor |
| 1314 | Command processing |
```

Only include sections that exist in the code right now. Never invent.

### 5.7. Sections that MUST NOT appear

- `## Further reading`, `## See also`, `## Related components` — inline links handle this; extra "see also" sections rot.
- `## History`, `## Migration notes`, `## Legacy lineage` — the doc describes what is true **now**; history belongs in commits.
- `## Dependencies` as a table of injected types with type names — describe collaborators in prose in the architecture context.
- `## Public API` as a table of method/function signatures — describe what the component *does*, not what it *exposes*.
- `## TODO`, `## Known issues`, `## Limitations` — belong in the issue tracker.
- `## License`, `## Contributors`, any boilerplate.

---

## 6. Writing rules

### 6.1. Style

- Prose over bullets when content flows. Bullets only when items are genuinely parallel and short.
- No needless tables. A table of one column is not a table.
- Specific numbers and names ("1 s tick", not "short interval").
- No filler ("It is worth noting that", "As mentioned above", "Simply put").
- Operational headings.

### 6.2. Code references

- File references: markdown links with relative paths (`[parser.ts](../../src/lib/parser.ts)`).
- Class, function, attribute, constant names: backticks (`UserService`, `useAuth`).
- Never paste large code blocks. Never paste type signatures. The reader has the source.

### 6.3. Cross-references

- Link **inline** to other component docs when they are the natural next thing to read.
- Do not maintain a "Related" section.
- Reference docs are linked to their exact anchor (`#alarm-codes`).

### 6.4. Length

No target. A doc is the length it needs to be. Signs it is too long: repeated information, a table of contents becomes necessary. Too short: the "What X does" section does not actually explain what the thing does.

---

## 7. How to traverse the code before writing

Perform these steps **in order**. Do not skip.

### 7.1. Scope the component

1. Identify the folder or file(s) this doc covers. Check whether a doc already exists in `docs/`.
2. If documenting a folder, list all source files. Classify each:
   - Primary types (interfaces, main classes, exported modules) — **read fully**.
   - Supporting types (helpers, small records, internal utilities) — **skim**.
   - Generated / trivial / bootstrap / tests — **ignore**.
3. If any single file is > 256 KB or > ~5000 lines, do **not** read it top to bottom. Instead:
   - Grep for section markers (`#region`, `class `, `function `, `def `, `fn `, `interface `, `type `) to build a structure map.
   - Grep for public declarations to find the surface.
   - Read the interface / header file fully if it exists; use it as the spine.

### 7.2. Decide the grouping (section 4.2)

Answer before writing:

- Big enough for its own doc, or merge with a module doc?
- Are there enums/codes that should go in `docs/Reference/` rather than inline?

If a reference doc needs to be created or extended, do that **first**, then link to it.

### 7.3. Extract enumerations and codes

Before writing behaviour sections, pull every enum value, constant, error code, flag, and externally-visible identifier used by the component. Put them in a scratch list. Check against any existing reference doc. This prevents "Idle, Starting, etc." from creeping into the prose.

### 7.4. Identify collaborators

List the types the component **calls into** and the types that **call it**. Look at:

- Constructor / function parameters (what it depends on).
- Exports and imports.
- DI registration (who creates it).
- Call sites via grep.

This list becomes the architecture context.

### 7.5. Write in this order

1. Leading paragraph + metadata block.
2. "What X does" prose.
3. Architecture context + diagram.
4. Behaviour sections, in the order a developer encounters them (startup → normal operation → edge cases → shutdown).
5. Reference pointers for codes.
6. Source map (only if large).

Re-read end-to-end. Remove any sentence that does not add information. Remove any section that is only one sentence.

---

## 8. Modes of operation

### 8.1. Update mode (commit-driven)

Triggered after a commit. Input is a git diff.

1. For each changed source file, find the matching component doc.
2. If a doc exists: re-read the affected regions, then update only the sections whose subject actually changed. Preserve existing correct prose.
3. If a doc does not exist: skip silently. Bootstrap mode creates missing docs, not update mode.
4. If enum values / error codes change: update the reference doc **and** every component doc whose inline mention is now wrong.
5. If a type is renamed or a file moved: update metadata and links in every affected doc.

### 8.2. Bootstrap mode (manual, per session)

Triggered by `/docs-generate` (or equivalent). Seeds docs for existing code.

1. Read the progress file (section 9). Skip components already marked `done`.
2. Enumerate remaining components from the codebase per section 4.2.
3. Extend or create reference docs first.
4. Document components one at a time (or in parallel — see section 10), respecting the session cap.

---

## 9. Progress tracking (critical)

Documentation of a large codebase cannot always fit in one agent session. A persistent progress file makes resuming safe and deterministic.

### 9.1. The progress file

Location: `docs/.docs-progress.json`.

Format:

```json
{
  "version": 1,
  "lastUpdated": "2026-04-14T12:34:56Z",
  "sessionCap": 5,
  "components": [
    {
      "path": "docs/Domain/TransportHandler.md",
      "sources": ["src/Domain/TransportHandler.cs", "src/Domain/ITransportHandler.cs"],
      "status": "done",
      "completedAt": "2026-04-14T12:30:00Z"
    },
    {
      "path": "docs/Domain/TransportController.md",
      "sources": ["src/Domain/TransportController.cs"],
      "status": "pending"
    }
  ]
}
```

Valid statuses: `pending`, `in_progress`, `done`.

### 9.2. Rules the agent MUST follow

1. **Read the progress file at the start of every session.** If it does not exist, create it after enumerating components.
2. **Update the progress file after every completed component**, not at the end of the session. If the agent is interrupted, nothing is lost.
3. **Before starting a component, set its status to `in_progress` and write the file.** After finishing, set it to `done` with a `completedAt` timestamp.
4. **Never silently skip a component.** If something cannot be documented (e.g. source file missing), mark it with a reason and continue.

### 9.3. Session cap

By default, one session documents **at most 5 components** before stopping. This keeps each run inside a single context window with margin.

The cap is stored in the progress file as `sessionCap` and can be tuned by the user.

### 9.4. Stopping protocol

After processing the capped number of components, or when the agent detects it is approaching its context limit (e.g. noticing very long tool results or many accumulated reads), it must:

1. Finish the component currently in progress. Do **not** abandon a half-written doc.
2. Update the progress file.
3. Print a clear, prominent message to the user:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠  DOCUMENTATION NOT COMPLETE — session cap reached
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Completed this session:
  ✓ docs/Domain/TransportHandler.md
  ✓ docs/Services/TransportServer.md
  ✓ docs/ComInterop/Threading.md

Remaining: 12 components
Next up:
  → docs/ComInterop/Attributes.md
  → docs/ComInterop/Events.md
  → docs/Domain/SubTransport.md
  … and 9 more

▶ To continue, start a NEW chat and run /docs-generate again.
  Progress is saved in docs/.docs-progress.json — no work will be repeated.
```

4. Stop. Do not attempt to continue past the cap.

---

## 10. Parallel execution

When the agent runtime supports parallel subagents (Claude Code's `Task` tool), `/docs-generate` may process multiple components concurrently:

1. The orchestrator reads the progress file and picks the next batch (up to `sessionCap` items).
2. For each component, the orchestrator marks its status `in_progress` and spawns one subagent with instructions to document that single component.
3. After each subagent returns, the orchestrator writes its output to disk and updates the progress file.
4. The orchestrator itself does **not** read the source files of components — only the subagents do. This keeps the orchestrator's context free for coordination.

When parallelism is unavailable (most prompt-driven environments), components are processed sequentially in the same session, still respecting the session cap.

---

## 11. Quality bar

Before finishing, re-check the output against this list. If any apply, rewrite until they do not.

- [ ] The "What X does" section exists and is prose, not bullets.
- [ ] Every enumeration is complete, or explicitly links to a reference doc with the complete list.
- [ ] No section heading is "Public API", "Dependencies", "Further reading", "History", or "See also".
- [ ] No function / method signatures appear in tables.
- [ ] No placeholder text (`TBD`, `...`, "etc.", "more to come").
- [ ] Architecture section has a real ASCII diagram, not just a bullet list.
- [ ] If a source file is > 1000 lines, a source map exists and matches real section markers.
- [ ] File paths in links resolve (relative paths, correct case on case-sensitive file systems).
- [ ] No emojis, no sign-off, no AI-tells.
- [ ] The doc reads top-to-bottom as if one person wrote it deliberately.
- [ ] The progress file is updated.

---

## 12. What to do when the guide does not cover a case

If a component does not fit any template, pick the closest existing doc in `docs/` as a reference, mirror its shape, and proceed. Do not invent new section types just because one seems nice.

If you believe the guide itself needs a new rule, leave the doc as close to the guide as possible **and** leave a one-line note in your final response suggesting the addition. Do not edit this file without being asked.
