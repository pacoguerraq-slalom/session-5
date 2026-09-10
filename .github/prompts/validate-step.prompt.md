---
description: "Validate that all success criteria for the current step are met"
agent: code-reviewer
tools: ['search', 'read', 'execute', 'web', 'todo']
---

# Validate Exercise Step

Step number: ${input:step-number:Required step number, for example 5-0 or 5-1.}

The step number is required. If it is missing or blank, ask the user for it before validating.

1. Use the GitHub CLI workflow utilities in the project instructions to locate the main open `Exercise:` issue.
2. Retrieve the issue and all comments with `gh issue view <issue-number> --comments`.
3. Find `# Step {step-number}:` in the issue content or comments and extract that step's `Success Criteria` section.
4. Check every success criterion against the current workspace state using focused inspection or validation commands.
5. Report each criterion as complete or incomplete, with specific evidence.
6. For incomplete items, provide concrete guidance on the smallest next action required to satisfy the criterion.

Do not infer completion from intent or unverified files. Replace `{step-number}` with the supplied step number throughout the validation.