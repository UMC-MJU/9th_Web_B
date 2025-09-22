// 인터페이스 정의
interface TodoItem {
  id: number;
  text: string;
}

// 돔요소 가져오기
const inputEl = document.getElementById("todoInput") as HTMLInputElement;
const addBtn = document.getElementById("addBtn") as HTMLButtonElement;
const todoListEl = document.getElementById("todoList") as HTMLDivElement;
const doneListEl = document.getElementById("doneList") as HTMLDivElement;

//할일,한일 나누어서 배열에 저장
let todos: TodoItem[] = [];
let dones: TodoItem[] = [];
let idCounter = 0;

// 할 일 추가
function addTodo(): void {
  const text = inputEl.value.trim(); //입력값 공백제거 ,빈문자열이면 동작x
  if (!text) return;

  const newTodo: TodoItem = { id: idCounter++, text };
  todos.push(newTodo);

  inputEl.value = "";
  render();
}

// 완료 처리
function completeTodo(id: number): void {
  const idx = todos.findIndex((t) => t.id === id);
  if (idx === -1) return;

  const [done] = todos.splice(idx, 1);
  if (done) {
    dones.push(done);
  }

  render();
}

// 삭제 처리
function deleteTodo(id: number): void {
  dones = dones.filter((d) => d.id !== id);
  render();
}

function render(): void {
  // 할일 리스트 렌더링
  todoListEl.innerHTML = "";
  todos.forEach((todo) => {
    const item = document.createElement("div");
    item.className = "todo__item";
    item.innerHTML = `
      <span class="todo__item-text">${todo.text}</span>
      <button class="todo__btn todo__btn--done">완료</button>
    `;

    const btn = item.querySelector("button") as HTMLButtonElement;
    btn.addEventListener("click", () => completeTodo(todo.id));

    todoListEl.appendChild(item);
  });

  // 완료 리스트 렌더링
  doneListEl.innerHTML = "";
  dones.forEach((todo) => {
    const item = document.createElement("div");
    item.className = "todo__item";
    item.innerHTML = `
      <span class="todo__item-text">${todo.text}</span>
      <button class="todo__btn todo__btn--delete">삭제</button>
    `;

    const btn = item.querySelector("button") as HTMLButtonElement;
    btn.addEventListener("click", () => deleteTodo(todo.id));

    doneListEl.appendChild(item);
  });
}

// 이벤트 등록
addBtn.addEventListener("click", addTodo);
inputEl.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === "Enter") addTodo();
});
