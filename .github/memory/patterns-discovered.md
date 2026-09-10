# Patterns Discovered

This is the committed collection of confirmed, reusable code and workflow patterns. Add entries when a pattern has been validated and will help future development. Keep entries concrete and link them to the code that demonstrates them.

## Pattern Template

### [Pattern Name]

**Context:** [Where this pattern applies]

**Problem:** [What can go wrong or become unnecessarily difficult]

**Solution:** [The established approach]

**Example:**

```text
[Small representative code or workflow example]
```

**Related Files:** [Paths to implementations, tests, or documentation]

---

## Service Initialization

**Context:** Initializing in-memory collections owned by backend services.

**Problem:** Initializing a collection as `null` forces every reader and writer to handle an absent collection, which creates avoidable branching and can cause runtime errors.

**Solution:** Initialize the collection as an empty array. An empty array accurately represents a service that has no records yet and supports standard array operations immediately.

**Example:**

```js
class TodoService {
  constructor() {
    this.todos = [];
  }
}
```

**Related Files:** `packages/backend/src/`, `packages/backend/__tests__/`

---