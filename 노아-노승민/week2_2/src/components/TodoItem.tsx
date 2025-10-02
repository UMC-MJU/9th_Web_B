import { useContext } from "react";
import { Todo } from "../types/types";
import { TodoContext } from "../context/TodoContext";

interface TodoItemProps {
  todo: Todo;
}

function TodoItem({ todo }: TodoItemProps) {
  const todoCtx = useContext(TodoContext);
  if (!todoCtx) return null;

  const { doneBtn, deleteBtn } = todoCtx;

  return (
    <div className="todo__item">
      <span>{todo.text}</span>
      {todo.done ? (
        <button
          className="todo__btn todo__btn--delete"
          onClick={() => deleteBtn(todo.id)}   
        >
          삭제
        </button>
      ) : (
        <button
          className="todo__btn todo__btn--done"
          onClick={() => doneBtn(todo.id)}    
        >
          완료
        </button>
      )}
    </div>
  );
}

export default TodoItem;
