<!--
Component documentation template.

Fill in every {placeholder}. Delete comments and optional sections that do not apply.
Follow docs/AUTHORING.md for the full authoring rules.

Pick headings from the allowed set:
- "What the {component} does" — user-visible behaviour
- "Why this module exists"  — pure infrastructure
- "Purpose"                  — short fallback
-->

# {Layer} / {Component}

{One or two sentences describing what this component is and what role it plays. Prose, not bullets.}

- **Namespace / Package / Module:** `{namespace.or.package.name}`
- **Files:** [{File1}]({relative/path/to/file1}), [{File2}]({relative/path/to/file2})
- **Layer:** {Domain | Services | Infrastructure | ComInterop | Common | ...}
- **Lifetime:** {Singleton | Scoped | Transient | One per X | Module-level}

<!-- Optional callout for very large files:
> {File} is ~{N} lines. This document is a behavioural reference, not a
> line-by-line walkthrough. The **Source map** at the bottom points each topic
> to its exact location in the code.
-->

---

## {What the component does | Why this module exists | Purpose}

{Prose. 2–5 short paragraphs. Explain what this component is and why it exists in plain language. This section is the most likely candidate for reuse in customer-facing documentation — make it good.}

---

## Architecture context

```
{ASCII box-and-arrow diagram. The component in the middle, immediate collaborators
around it. Use │ ├ ▼ ◄ ─ └ ┌ ┐ ┘ or plain | +- -> <-. Lines under 90 columns.}
```

- **Called by:** {who invokes this component}
- **Calls into:** {what this component depends on}
- **Publishes to / Subscribes on:** {only when there are external events / attributes}

---

## {Behaviour section — use an operational heading}

{Prose. Describe what the component does under one scenario: startup, a specific operation, an error path, a state transition. One section per scenario. Avoid headings like "Methods" or "Properties".}

## {Behaviour section — next scenario}

{...}

<!-- Add as many behaviour sections as the component has distinct operational scenarios. -->

---

<!-- Optional: enumerations table. Use only when values are fully enumerated here.
     If the enum lives in a reference doc, link to it instead and list only the
     values this component raises or consumes. -->

## {Enumeration or code set name}

| Value | Name | Meaning |
| --- | --- | --- |
| {1} | {Name} | {description} |
| {2} | {Name} | {description} |

---

<!-- Required for any component with a source file over 1000 lines.
     Remove this section otherwise. -->

## Source map

| Line | Section |
| --- | --- |
| {N} | {Section marker / region name from the source} |
| {N} | {...} |
