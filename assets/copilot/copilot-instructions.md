# Copilot instructions — documentation authoring

These instructions apply whenever Copilot is asked to create, modify, or review files under `docs/` in this repository.

## Authoring guide is authoritative

When working on documentation, always read `docs/AUTHORING.md` first and follow it strictly. Every rule below is subordinate to that file.

## Documentation structure

- Every component doc follows the template defined in `docs/TEMPLATE.md`.
- Folder structure under `docs/` mirrors the source layer structure.
- Shared enums, codes, and constants live in `docs/Reference/` — not duplicated across component docs.
- One doc per **component**, not per file. Large files get their own doc; small related files share one module-level doc.

## Style

- English.
- Plain technical prose. No marketing, no filler, no emojis, no sign-off.
- Operational section headings ("Startup sequence", "Error handling"), not structural ones ("Public API", "Dependencies").
- Full enumerations when listing states / codes / commands — never "X, Y, etc.".
- ASCII diagrams for architecture, not Mermaid.

## Forbidden sections

Never add any of these headings:

- `Further reading` / `See also` / `Related components`
- `History` / `Migration notes` / `Legacy lineage`
- `Public API` (as a table of signatures)
- `Dependencies` (as a table of injected types)
- `TODO` / `Known issues` / `Limitations`
- `License` / `Contributors`

## Progress tracking

When bootstrapping documentation for existing code, Copilot must honour `docs/.docs-progress.json`:

- Read it at the start of every session.
- Never re-document a component marked `done`.
- Update the file after every completed component, not at the end.
- Respect the `sessionCap` value. When reached, stop and tell the user to run the command again.

## Quality bar

Before finishing any doc, verify the checklist in `docs/AUTHORING.md` section 11. If any item fails, rewrite.
