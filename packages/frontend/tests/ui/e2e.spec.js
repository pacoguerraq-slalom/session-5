const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./todo-page');

const initialTodos = [
  { id: 1, title: 'Plan the release', completed: false },
];

test.describe('Todo journeys', () => {
  let todos;
  let requests;

  test.beforeEach(async ({ page }) => {
    todos = structuredClone(initialTodos);
    requests = [];

    await page.route('**/api/todos**', async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      const method = request.method();
      const todoId = Number(url.pathname.match(/\/api\/todos\/(\d+)/)?.[1]);
      const body = request.postData() ? request.postDataJSON() : null;
      requests.push({ method, url: url.pathname, body });

      if (method === 'GET') {
        await route.fulfill({ json: todos });
        return;
      }

      if (method === 'POST') {
        const todo = {
          id: 2,
          title: body.title,
          completed: false,
        };
        todos.push(todo);
        await route.fulfill({ status: 201, json: todo });
        return;
      }

      if (method === 'PATCH') {
        const todo = todos.find((candidate) => candidate.id === todoId);
        todo.completed = !todo.completed;
        await route.fulfill({ json: todo });
        return;
      }

      if (method === 'PUT') {
        const todo = todos.find((candidate) => candidate.id === todoId);
        todo.title = body.title;
        await route.fulfill({ json: todo });
        return;
      }

      if (method === 'DELETE') {
        todos = todos.filter((candidate) => candidate.id !== todoId);
        await route.fulfill({ status: 204 });
        return;
      }

      await route.fulfill({ status: 405 });
    });
  });

  test('creates a todo and shows it in the list', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.visit();

    await todoPage.createTodo('Send release notes');

    await expect.poll(() => requests.some(({ method }) => method === 'POST')).toBe(true);
    await todoPage.expectTodo('Send release notes');
  });

  test('edits a todo title', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.visit();

    await todoPage.editTodo('Plan the release');
    const editInput = page.getByRole('textbox', { name: 'Edit todo Plan the release' });
    await expect(editInput).toBeVisible();
    await editInput.fill('Plan the launch');
    await page.getByRole('button', { name: 'Save changes' }).click();

    await expect.poll(() => requests.some(({ method }) => method === 'PUT')).toBe(true);
    await todoPage.expectTodo('Plan the launch');
  });

  test('toggles a todo completion state', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.visit();

    await todoPage.toggleTodo('Plan the release');

    await expect.poll(() => requests.some(({ method }) => method === 'PATCH')).toBe(true);
    await expect(todoPage.todo('Plan the release').getByRole('checkbox')).toBeChecked();
  });

  test('deletes a todo from the list', async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.visit();

    await todoPage.deleteTodo('Plan the release');

    await expect.poll(() => requests.some(({ method }) => method === 'DELETE')).toBe(true);
    await expect(todoPage.todo('Plan the release')).toHaveCount(0);
  });

  test('shows an error when todos cannot be loaded', async ({ page }) => {
    await page.unroute('**/api/todos**');
    await page.route('**/api/todos', (route) => route.fulfill({ status: 503 }));
    const todoPage = new TodoPage(page);

    await todoPage.visit();

    await expect(page.getByRole('alert')).toHaveText(/unable to load todos/i);
  });
});