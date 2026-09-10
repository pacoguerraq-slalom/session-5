# Development Memory System

This directory records useful development discoveries so future work can start with the project's established context instead of rediscovering it. Capture patterns, decisions, validated fixes, and lessons that would help another development session make a better or faster choice.

## Memory Types

The project has two complementary memory types:

- **Persistent memory:** [.github/copilot-instructions.md](../copilot-instructions.md) contains foundational project principles, workflows, test expectations, and agent responsibilities. It is the stable guidance that applies to all work.
- **Working memory:** This `.github/memory/` directory contains observations gathered while working in the project. It turns session-specific discoveries into durable, searchable project knowledge.

Persistent memory establishes how the project should be developed. Working memory records what development has taught us about this particular codebase.

## Directory Structure

```text
.github/memory/
├── README.md
├── session-notes.md
├── patterns-discovered.md
└── scratch/
    ├── .gitignore
    └── working-notes.md
```

| Location | Purpose | Git status |
| --- | --- | --- |
| `session-notes.md` | Completed-session summaries, outcomes, and decisions worth retaining. | Committed |
| `patterns-discovered.md` | Accumulated, reusable code and workflow patterns. | Committed |
| `scratch/working-notes.md` | Active-session observations, hypotheses, commands, and next steps. | Not committed |

## How To Use It

### During TDD

Before changing code, record the current task and expected behavior in `scratch/working-notes.md`. As the Red-Green-Refactor cycle proceeds, capture the failing test's signal, the smallest successful implementation choice, and any behavior that future tests should preserve. When a recurring testing or implementation technique emerges, add a concise pattern to `patterns-discovered.md`.

At the end of a completed task or session, turn the durable parts of those notes into a summary in `session-notes.md`: what changed, why it changed, which tests passed, and any follow-up work. Do not copy transient command output or unresolved speculation into the historical record.

### During Linting And Code Quality Work

Use `scratch/working-notes.md` to group lint failures by cause and record the validation command being used. Document a recurring rule interpretation, local style convention, or reliable remediation in `patterns-discovered.md` only after it has been confirmed. Summarize material outcomes, such as a corrected project convention or a significant remaining limitation, in `session-notes.md`.

### During Debugging

Write the symptom, current hypothesis, evidence, and the next discriminating check in `scratch/working-notes.md`. This keeps the investigation coherent while preserving room for hypotheses to be wrong. Once resolved, add the confirmed root cause and fix to `session-notes.md`. Promote only broadly reusable diagnosis or prevention techniques to `patterns-discovered.md`.

## Reading And Applying Memory

When providing context-aware suggestions or starting related work, AI should read the persistent instructions first, then check the relevant historical notes and discovered patterns. It should use confirmed patterns to choose conventions, tests, and implementation approaches that fit the repository. It should treat scratch notes as active context only: useful for continuing current work, but not as durable truth until findings are validated and summarized.

Memory is evidence, not an override for the code. When a remembered pattern conflicts with current code, tests, or explicit instructions, verify the current behavior and update the memory if the older entry is stale.

## Session Closeout

`session-notes.md` is a committed historical record of completed sessions. It should contain short, factual summaries that remain useful after the original working context has faded.

`scratch/working-notes.md` is for active work and is intentionally not committed. Before a session ends, extract the confirmed findings, decisions, and outcomes into `session-notes.md`, then leave or replace the scratch notes as needed for the next active task. This preserves project learning without committing temporary investigation details.