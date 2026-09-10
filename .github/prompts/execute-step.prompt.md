---
description: "Execute instructions from the current GitHub Issue step"
agent: tdd-developer
tools: ['search', 'read', 'edit', 'execute', 'web', 'todo']
---

# Execute Current Exercise Step

Issue number: ${input:issue-number:Optional GitHub exercise issue number. Leave blank to locate the open Exercise issue.}

Execute the latest applicable step from the exercise issue systematically.

1. If an issue number was provided, use it. Otherwise, use the GitHub CLI workflow utilities in the project instructions to locate the open issue whose title starts with `Exercise:`.
2. Retrieve the selected issue and its comments using `gh issue view <issue-number> --comments`.
3. Parse the latest applicable step instructions from the issue content and comments. Identify every `:keyboard: Activity:` section belonging to that step.
4. Execute each activity in order, following the project's TDD workflow and testing scope constraints.
5. Do not create or run Playwright UI tests in this prompt. Hand off all Playwright work to `/create-ui-tests` and `/run-ui-tests`, which use the `test-engineer` agent.
6. Do not commit or push changes. `/commit-and-push` owns that workflow.
7. Stop after completing the step activities and summarize completed work, validation, and any blockers.

End by providing only the relevant next command sequence for the completed step:

- When the current step requires UI workflow: `/create-ui-tests` -> `/run-ui-tests` -> `/validate-step {step-number}`.
- When UI workflow is not required: `/validate-step {step-number}`.

Never recommend `/validate-step` before required UI prompts. Replace `{step-number}` with the actual step number found in the issue.