import { useTodo } from "../context/TodoContext";
import TodoItem from "./TodoItem";

interface TodoListProps {
  title: string;
  actionType: "done" | "delete";
}

const TodoList = ({ title, actionType }: TodoListProps) => {
  const { todos, doneTodo, deleteTodo } = useTodo();

  const filtered = actionType === "done"
    ? todos.filter((todo) => !todo.done)
    : todos.filter((todo) => todo.done);

  return (
    <div className={`todo__list todo__list--${actionType}`}>
      <h2 className="todo__list-header">{title}</h2>
      <div className="todo__list-items">
        {filtered.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            actionType={actionType}
            onAction={actionType === "done" ? doneTodo : deleteTodo}
          />
        ))}
      </div>
    </div>
  );
};

export default TodoList;
