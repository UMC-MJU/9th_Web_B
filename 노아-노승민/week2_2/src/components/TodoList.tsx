// src/components/TodoList.tsx
import { useContext } from "react";
import { TodoContext } from "../context/TodoContext";
import TodoItem from "./TodoItem";

interface TodoListProps {
  title: string;               // 리스트 제목 ("할 일" / "완료")
  variant: "todo" | "done";    // todo → 미완료, done → 완료
}

function TodoList({ title, variant }: TodoListProps) {
  const todoCtx = useContext(TodoContext);
  if (!todoCtx) return null;

  const { todos } = todoCtx;

  const filteredTodos = todos.filter((todo) =>
    variant === "done" ? todo.done : !todo.done
  );

  return (
    <div className={`todo__list todo__list--${variant}`}>
      <h2 className="todo__list-header">{title}</h2>
      <div className="todo__list-items">
        {filteredTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  );
}

export default TodoList;
