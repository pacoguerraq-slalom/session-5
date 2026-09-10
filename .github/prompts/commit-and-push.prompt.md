---
description: "Analyze changes, generate commit message, and push to feature branch"
tools: ['read', 'execute', 'todo']
---

# Commit And Push Changes

Branch name: ${input:branch-name:Required feature branch name to create or update, for example feature/agentic-workflow.}

Use the current active agent for this Git workflow. The branch name is required. If it is missing or blank, ask the user for a branch name and do not perform Git operations until one is provided.

1. Determine whether the current step requires UI workflow from the active task context or its exercise issue instructions.
2. If UI workflow is required, verify that `/run-ui-tests` completed successfully in this chat. If that proof is unavailable, run `npm run test:ui` from the repository root before committing. Stop on a failed UI test run.
3. Analyze the pending work with `git status` and `git diff`.
4. Generate one descriptive conventional commit message based on the actual changes, using the project Git Workflow guidance.
5. Never commit to `main` or any branch other than the user-provided branch name.
6. If the provided branch does not exist, create and switch to it with `git checkout -b <branch-name>`. If it exists, switch to it with `git checkout <branch-name>`.
7. Stage all changes with `git add .`, commit with the generated message, and push with `git push origin <branch-name>`.
8. Report the branch, commit message, and push outcome.