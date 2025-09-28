import { useTodo } from "../context/TodoContext";

const TodoForm = () => {
  const { input, setInput, addTodo } = useTodo();

  return (
    <div className="todo__form">
      <input
        id="todoInput"
        type="text"
        placeholder="할 일 입력"
        className="todo__form-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        id="addBtn"
        className="todo__form-btn todo__form-btn--add"
        onClick={addTodo}
      >
        할 일 추가
      </button>
    </div>
  );
};

export default TodoForm;
