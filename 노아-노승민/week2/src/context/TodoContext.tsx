import { createContext, useContext, useState, ReactNode } from "react";
import { TodoItem } from "../types/types";

interface TodoContextType {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  todos: TodoItem[];
  addTodo: () => void;
  doneTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState<TodoItem[]>([]);

  const addTodo = () => {
    if (!input.trim()) return;
    const newTodo: TodoItem = {
      id: Date.now(),
      text: input,
      done: false,
    };
    setTodos((prev) => [...prev, newTodo]);
    setInput("");
  };

  const doneTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, done: true } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <TodoContext.Provider
      value={{ input, setInput, todos, addTodo, doneTodo, deleteTodo }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error("useTodo must be used within TodoProvider");
  return ctx;
};
