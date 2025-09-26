import React, { useEffect, useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { useTodoStore, FilterType } from '@/stores/todo-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { useShallow } from 'zustand/react/shallow';
import { Todo } from '@shared/types';
const TodoItem = ({ todo }: { todo: Todo }) => {
  const { toggleTodo, deleteTodo } = useTodoStore.getState();
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group flex items-center gap-4 rounded-md px-4 py-4 transition-colors duration-200 ease-in-out hover:bg-slate-100 dark:hover:bg-gray-800/50"
    >
      <Checkbox
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onCheckedChange={() => toggleTodo(todo.id)}
        className="h-6 w-6 rounded-full transition-all duration-300 ease-in-out data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 dark:data-[state=checked]:bg-blue-500 dark:data-[state=checked]:border-blue-500"
      />
      <label
        htmlFor={`todo-${todo.id}`}
        className={cn(
          'flex-grow cursor-pointer text-lg text-slate-800 transition-all duration-300 ease-in-out dark:text-slate-200',
          todo.completed && 'text-slate-400 line-through dark:text-gray-500'
        )}
      >
        {todo.text}
      </label>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => deleteTodo(todo.id)}
        className="h-9 w-9 rounded-full text-slate-400 opacity-0 transition-all duration-200 ease-in-out group-hover:opacity-100 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/50 dark:hover:text-red-500"
        aria-label="Delete task"
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </motion.li>
  );
};
const FilterButtons = () => {
  const { filter, setFilter } = useTodoStore(useShallow(state => ({ filter: state.filter, setFilter: state.setFilter })));
  const filters: FilterType[] = ['all', 'active', 'completed'];
  return (
    <div className="flex items-center justify-center space-x-2 rounded-full bg-slate-100 p-1 dark:bg-gray-800">
      {filters.map((f) => (
        <Button
          key={f}
          variant="ghost"
          onClick={() => setFilter(f)}
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-medium capitalize text-slate-500 transition-all duration-200 ease-in-out hover:bg-white hover:text-slate-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100',
            filter === f && 'bg-white text-slate-900 shadow-sm dark:bg-gray-700 dark:text-gray-100'
          )}
        >
          {f}
        </Button>
      ))}
    </div>
  );
};
const TodoList = () => {
  const { todos, filter } = useTodoStore(useShallow(state => ({ todos: state.todos, filter: state.filter })));
  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    });
  }, [todos, filter]);
  if (filteredTodos.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-500 dark:text-gray-400">
          {todos.length === 0 ? "You're all clear! Add a task to get started." : "No tasks match your filter."}
        </p>
      </div>
    );
  }
  return (
    <ul className="divide-y divide-slate-200 dark:divide-gray-700/50">
      <AnimatePresence>
        {filteredTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </AnimatePresence>
    </ul>
  );
};
const SkeletonLoader = () => (
  <div className="space-y-2">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 px-4 py-4">
        <div className="h-6 w-6 animate-pulse rounded-full bg-slate-200 dark:bg-gray-700" />
        <div className="h-6 flex-grow animate-pulse rounded bg-slate-200 dark:bg-gray-700" />
      </div>
    ))}
  </div>
);
export function HomePage() {
  const [newTodoText, setNewTodoText] = useState('');
  const { fetchTodos, addTodo, clearCompleted, todos, loading } = useTodoStore(useShallow(state => ({
    fetchTodos: state.fetchTodos,
    addTodo: state.addTodo,
    clearCompleted: state.clearCompleted,
    todos: state.todos,
    loading: state.loading,
  })));
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      addTodo(newTodoText.trim());
      setNewTodoText('');
    }
  };
  const activeTasksCount = useMemo(() => todos.filter(t => !t.completed).length, [todos]);
  const hasCompletedTasks = useMemo(() => todos.some(t => t.completed), [todos]);
  return (
    <>
      <main className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased dark:bg-gray-900 dark:text-gray-100">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8 lg:py-32 md:py-24">
          <div className="space-y-8">
            <header className="text-center">
              <h1 className="font-display text-5xl font-bold tracking-tighter text-slate-900 dark:text-white">
                Clarity
              </h1>
            </header>
            <section>
              <form onSubmit={handleAddTodo} className="relative">
                <Input
                  type="text"
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  placeholder="What needs to be done?"
                  aria-label="Add a new task"
                  className="h-14 rounded-lg bg-white px-6 pr-16 text-lg shadow-sm transition-shadow focus:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-800 dark:focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-2.5 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-blue-600 text-white shadow-md transition-all duration-200 ease-in-out hover:bg-blue-700 active:scale-95"
                  aria-label="Add task"
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </form>
            </section>
            <div className="rounded-lg bg-white shadow-sm dark:bg-gray-800/50">
              {loading ? <SkeletonLoader /> : <TodoList />}
            </div>
            <footer className="mt-8 flex items-center justify-between text-sm text-slate-500 dark:text-gray-400">
              <span>{activeTasksCount} {activeTasksCount === 1 ? 'task' : 'tasks'} left</span>
              <FilterButtons />
              <Button
                variant="ghost"
                onClick={clearCompleted}
                className={cn(
                  "transition-opacity hover:text-slate-800 dark:hover:text-slate-200",
                  hasCompletedTasks ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
              >
                Clear completed
              </Button>
            </footer>
          </div>
        </div>
      </main>
      <Toaster richColors position="bottom-right" />
    </>
  );
}