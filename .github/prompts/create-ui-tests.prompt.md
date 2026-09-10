---
description: "Create UI tests for required critical user journeys"
agent: test-engineer
tools: ['search', 'read', 'edit', 'execute', 'todo']
---

# Create Critical UI Tests

Journeys: ${input:journeys:Optional comma-separated journeys to cover. Leave blank for create, edit, toggle, delete, and core error-state handling.}

Create or update Playwright UI coverage using the project's UI test framework.

1. If journeys were supplied, use them. Otherwise, consider create, edit, toggle, delete, and core error-state handling as the candidate journeys.
2. Select the highest-risk scenarios when more than five candidates exist, and list deferred scenarios rather than creating extra tests.
3. Author a maximum of five Playwright test cases for this run, targeting three to five total. Include at least one error-path test within that total.
4. Use stable, accessibility-first selectors and state-based waits. Do not use arbitrary delays or brittle CSS selectors.
5. Apply Page Object Model practices: put reusable interactions and selectors in page object classes or helpers, keep specs focused on scenario intent and assertions, and avoid duplicating selectors or interaction flows.
6. Keep tests deterministic, isolated, readable, and independent of shared state or execution order.
7. Before finishing, count created or updated `test(...)` and `it(...)` cases. Reduce the authored count to five or fewer if it exceeds the limit.
8. Report files changed, test-case count, scenarios covered, and any deferred scenarios. Do not describe the scope as small when the final authored count exceeds five.