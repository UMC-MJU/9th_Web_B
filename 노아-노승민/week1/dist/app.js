"use strict";
const inputEl = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const todoListEl = document.getElementById("todoList");
const doneListEl = document.getElementById("doneList");
let todos = [];
let dones = [];
let idCounter = 0;
function addTodo() {
    const text = inputEl.value.trim();
    if (!text)
        return;
    const newTodo = { id: idCounter++, text };
    todos.push(newTodo);
    inputEl.value = "";
    render();
}
function completeTodo(id) {
    const idx = todos.findIndex((t) => t.id === id);
    if (idx === -1)
        return;
    const [done] = todos.splice(idx, 1);
    if (done) {
        dones.push(done);
    }
    render();
}
function deleteTodo(id) {
    dones = dones.filter((d) => d.id !== id);
    render();
}
function render() {
    todoListEl.innerHTML = "";
    todos.forEach((todo) => {
        const item = document.createElement("div");
        item.className = "todo__item";
        item.innerHTML = `
      <span class="todo__item-text">${todo.text}</span>
      <button class="todo__btn todo__btn--done">완료</button>
    `;
        const btn = item.querySelector("button");
        btn.addEventListener("click", () => completeTodo(todo.id));
        todoListEl.appendChild(item);
    });
    doneListEl.innerHTML = "";
    dones.forEach((todo) => {
        const item = document.createElement("div");
        item.className = "todo__item";
        item.innerHTML = `
      <span class="todo__item-text">${todo.text}</span>
      <button class="todo__btn todo__btn--delete">삭제</button>
    `;
        const btn = item.querySelector("button");
        btn.addEventListener("click", () => deleteTodo(todo.id));
        doneListEl.appendChild(item);
    });
}
addBtn.addEventListener("click", addTodo);
inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter")
        addTodo();
});
