import {createContext,useState,ReactNode} from 'react'
import {Todo} from '../types/types'

type TodoContextType = {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  addTodo: () => void;
  doneBtn: (id: number) => void;
  deleteBtn: (id: number) => void;
};

export const TodoContext=createContext<TodoContextType | null>(null)

export const TodoProvider =({ children }:{ children:ReactNode })=>{
  const [input,setInput]=useState('');
  const [todos,setTodos]=useState<Todo[]>([]);

  const addTodo =()=>{
    const newTodo : Todo = {
      id: Date.now(),
      text: input,
      done: false
    }
    setTodos([...todos,newTodo])
    setInput("")
  }

  const doneBtn =(id : number)=>{
    setTodos(todos.map(
      todo=>
        todo.id===id ? 
      {...todo,done:true}:todo))
  }

  const deleteBtn=(id:number)=>{
    setTodos(todos.filter(todo=>todo.id!==id))

  }

  return(
    <TodoContext.Provider value={{input,setInput,todos,setTodos,addTodo,doneBtn,deleteBtn}}>
      {children}
    </TodoContext.Provider>
  )
}