import {useContext} from 'react'
import { TodoContext } from "../context/TodoContext";

function TodoForm(){
  const todoCtx = useContext(TodoContext);
  if (!todoCtx) return null; // 혹시 Provider 밖에서 렌더되면 방어

  const { input, setInput, addTodo } = todoCtx;


  return(
      <div className="todo__form">
        <input
          id="todoInput"
          type="text"
          placeholder="할 일 입력"
          className="todo__form-input"
          value={input}
          onChange={(e)=>{setInput(e.target.value)
            console.log(e.target.value)
          }
        }

        />
        <button id="addBtn" className="todo__form-btn todo__form-btn--add"
        onClick={addTodo}>
          할 일 추가
        </button>
      </div>
  )
}

export default TodoForm;