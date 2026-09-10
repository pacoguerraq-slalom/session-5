const { expect } = require('@playwright/test');

class TodoPage {
  constructor(page) {
    this.page = page;
    this.newTodoInput = page.getByPlaceholder('What needs to be done?');
    this.addButton = page.getByRole('button', { name: 'Add' });
  }

  async visit() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
  }

  todo(title) {
    return this.page.getByRole('listitem').filter({ hasText: title });
  }

  async createTodo(title) {
    await this.newTodoInput.fill(title);
    await this.addButton.click();
  }

  async toggleTodo(title) {
    await this.todo(title).getByRole('checkbox').click();
  }

  async editTodo(title) {
    await this.todo(title)
      .locator('button')
      .first()
      .click();
  }

  async deleteTodo(title) {
    await this.todo(title)
      .locator('button')
      .last()
      .click();
  }

  async expectTodo(title) {
    await expect(this.todo(title)).toBeVisible();
  }
}

module.exports = { TodoPage };