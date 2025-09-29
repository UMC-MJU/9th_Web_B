import { TodoItem as Todo } from "../types/types";

interface TodoItemProps {
  todo: Todo;
  onAction: (id: number) => void;
  actionType: "done" | "delete";
}

const TodoItem = ({ todo, onAction, actionType }: TodoItemProps) => {
  return (
    <div className="todo__item">
      <span>{todo.text}</span>
      <button
        className={`todo__btn todo__btn--${actionType}`}
        onClick={() => onAction(todo.id)}
      >
        {actionType === "done" ? "완료" : "삭제"}
      </button>
    </div>
  );
};

export default TodoItem;
