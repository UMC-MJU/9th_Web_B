import "./style.css";
import { TodoProvider } from "./context/TodoContext";
import { ThemeProvider, ThemeContext } from "./context/ThemeContext";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import ThemeToggle from "./components/ThemeToggle";
import { useContext } from "react";

function AppContent() {
  const themeCtx = useContext(ThemeContext);
  if (!themeCtx) return null;

  const { theme } = themeCtx;

  return (
    <div className={`todo ${theme}`}>
      <ThemeToggle />
      <h1 className="todo__title">TODO</h1>
      <TodoForm />
      <div className="todo__lists">
        <TodoList title="할일" variant="todo" />
        <TodoList title="완료" variant="done" />
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <TodoProvider>
        <AppContent />
      </TodoProvider>
    </ThemeProvider>
  );
}

export default App;
