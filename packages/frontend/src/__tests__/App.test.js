import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

// Mock fetch for tests
const fetchResponse = (data, ok = true) => ({
  ok,
  json: () => Promise.resolve(data),
});

global.fetch = jest.fn(() => Promise.resolve(fetchResponse([])));

const renderApp = () => {
  const testQueryClient = createTestQueryClient();

  render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );
};

test('renders TODO App heading', async () => {
  renderApp();

  const headingElement = await screen.findByText(/TODO App/i);
  expect(headingElement).toBeInTheDocument();
});

test('shows an empty state when there are no todos', async () => {
  renderApp();

  expect(await screen.findByText('No todos yet')).toBeInTheDocument();
});

test('calculates incomplete and completed todo stats', async () => {
  fetch.mockResolvedValueOnce(
    fetchResponse([
      { id: 1, title: 'Write tests', completed: false },
      { id: 2, title: 'Run tests', completed: true },
      { id: 3, title: 'Review results', completed: false },
    ])
  );

  renderApp();

  expect(await screen.findByText('2 items left')).toBeInTheDocument();
  expect(screen.getByText('1 completed')).toBeInTheDocument();
});

test('deletes a todo', async () => {
  const user = userEvent.setup();
  fetch.mockResolvedValueOnce(fetchResponse([{ id: 1, title: 'Remove me', completed: false }]));
  fetch.mockResolvedValueOnce(fetchResponse({}));
  fetch.mockResolvedValueOnce(fetchResponse([]));

  renderApp();

  await user.click(await screen.findByRole('button', { name: 'Delete todo Remove me' }));

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith('/api/todos/1', { method: 'DELETE' });
  });
  expect(await screen.findByText('No todos yet')).toBeInTheDocument();
});

test('edits a todo', async () => {
  const user = userEvent.setup();
  fetch.mockResolvedValueOnce(fetchResponse([{ id: 1, title: 'Old title', completed: false }]));
  fetch.mockResolvedValueOnce(fetchResponse({}));
  fetch.mockResolvedValueOnce(fetchResponse([{ id: 1, title: 'New title', completed: false }]));

  renderApp();

  await user.click(await screen.findByRole('button', { name: 'Edit todo Old title' }));
  const input = screen.getByRole('textbox', { name: 'Edit todo Old title' });
  await user.clear(input);
  await user.type(input, 'New title');
  await user.click(screen.getByRole('button', { name: 'Save changes' }));

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith('/api/todos/1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New title' }),
    });
  });
  expect(await screen.findByText('New title')).toBeInTheDocument();
});

test('shows an error when loading todos fails', async () => {
  fetch.mockResolvedValueOnce(fetchResponse({}, false));

  renderApp();

  expect(await screen.findByRole('alert')).toHaveTextContent('Unable to load todos');
});

afterEach(() => {
  jest.clearAllMocks();
});
