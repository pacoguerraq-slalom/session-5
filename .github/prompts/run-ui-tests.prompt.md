---
description: "Run UI tests and summarize failures"
agent: test-engineer
tools: ['read', 'execute', 'todo']
---

# Run UI Tests

Run the project's Playwright UI tests and provide an evidence-based outcome summary.

1. Before any UI test command, run `npm run test:ui:install --workspace=frontend`. Repeat this install step after a container rebuild.
2. In Ubuntu/Linux, this install step is mandatory and must run `playwright install --with-deps chromium`. The project install script includes bounded remediation for the common Yarn key/repository issue and retries once.
3. Do not perform ad-hoc package hunting or broad OS troubleshooting. If the dependency install still fails, stop immediately, report an environment blocker with the failed command and key error lines, and do not run Playwright tests.
4. Ensure backend and frontend services are running before executing the UI suite. From the repository root, start `npm start` when the services are not already available.
5. Run the project UI test command: `npm run test:ui`.
6. Summarize passed, failed, skipped, or blocked outcomes clearly.
7. For every failure, classify the likely root cause as application code, test code, or environment, with the supporting evidence and next diagnostic step.