import "./style.css";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";

function App() {
  return (
    <div className="todo">
      <h1 className="todo__title">TODO</h1>
      <TodoForm />
      <div className="todo__lists">
        <TodoList title="할 일" actionType="done" />
        <TodoList title="완료" actionType="delete" />
      </div>
    </div>
  );
}

export default App;
