import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { api } from '@/lib/api-client';
import { Todo } from '@shared/types';
import { toast } from 'sonner';
export type FilterType = 'all' | 'active' | 'completed';
type TodoState = {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  filter: FilterType;
};
type TodoActions = {
  fetchTodos: () => Promise<void>;
  addTodo: (text: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  clearCompleted: () => Promise<void>;
  setFilter: (filter: FilterType) => void;
};
export const useTodoStore = create<TodoState & TodoActions>()(
  immer((set, get) => ({
    todos: [],
    loading: true,
    error: null,
    filter: 'all',
    fetchTodos: async () => {
      set({ loading: true, error: null });
      try {
        const todos = await api<Todo[]>('/api/todos');
        set({ todos: todos.sort((a, b) => a.createdAt - b.createdAt), loading: false });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch todos';
        set({ error: errorMessage, loading: false });
        toast.error(errorMessage);
      }
    },
    addTodo: async (text: string) => {
      try {
        const newTodo = await api<Todo>('/api/todos', {
          method: 'POST',
          body: JSON.stringify({ text }),
        });
        set((state) => {
          state.todos.push(newTodo);
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to add todo';
        set({ error: errorMessage });
        toast.error(errorMessage);
      }
    },
    toggleTodo: async (id: string) => {
      const originalTodos = get().todos;
      const todo = originalTodos.find((t) => t.id === id);
      if (!todo) return;
      // Optimistic update
      set((state) => {
        const targetTodo = state.todos.find((t) => t.id === id);
        if (targetTodo) {
          targetTodo.completed = !targetTodo.completed;
        }
      });
      try {
        await api<Todo>(`/api/todos/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({ completed: !todo.completed }),
        });
      } catch (error) {
        // Revert on error
        set({ todos: originalTodos });
        const errorMessage = error instanceof Error ? error.message : 'Failed to update todo';
        toast.error(errorMessage);
      }
    },
    deleteTodo: async (id: string) => {
      const originalTodos = get().todos;
      // Optimistic update
      set((state) => {
        state.todos = state.todos.filter((todo) => todo.id !== id);
      });
      try {
        await api(`/api/todos/${id}`, { method: 'DELETE' });
      } catch (error) {
        // Revert on error
        set({ todos: originalTodos });
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete todo';
        toast.error(errorMessage);
      }
    },
    clearCompleted: async () => {
        const originalTodos = get().todos;
        const completedTodos = originalTodos.filter(todo => todo.completed);
        if (completedTodos.length === 0) return;
        // Optimistic update
        set(state => {
            state.todos = state.todos.filter(todo => !todo.completed);
        });
        try {
            const idsToDelete = completedTodos.map(todo => todo.id);
            await api('/api/todos/bulk-delete', {
                method: 'POST',
                body: JSON.stringify({ ids: idsToDelete }),
            });
        } catch (error) {
            // Revert on error
            set({ todos: originalTodos });
            const errorMessage = error instanceof Error ? error.message : 'Failed to clear completed todos';
            toast.error(errorMessage);
        }
    },
    setFilter: (filter: FilterType) => {
      set({ filter });
    },
  }))
);