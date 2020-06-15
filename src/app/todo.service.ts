import { Injectable } from "@angular/core";
import { TODO } from "./todo.model";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TodoService {
  todoList: TODO[];
  types: string[];

  constructor() {}

  getTodos(): Observable<TODO[]> {
    this.todoList = TODOS;
    return of(this.todoList);
  }

  getTypes(): Observable<string[]> {
    this.types = TYPES;
    return of(this.types);
  }

  updateTodoList(todos: TODO[], mode: string) {
    console.log('ryt', todos)
    // if the todo-dialog is opened with 'update' mode, it will contain only 1 TODO
    if (mode === 'update') {
      this.todoList[todos[0].id - 1] = todos[0];
    }

    if (mode === 'create') {
      todos.forEach(todo => {
        todo.id = this.todoList.length + 1;
        this.todoList.push(todo);
      });
    }
  }

  deleteTodo(id: number) {
    this.todoList.splice(id - 1, 1);

    this.todoList.forEach((todo, index) => {
      if (todo.dependencies?.id === id) {
        todo.dependencies = null;
      }
      todo.id = index + 1;
    });
  }
}

export const TYPES: string[] = ["Coding", "Reading", "Writing"];

export const TODOS: TODO[] = [
  {
    name: "Read tutorial",
    id: 1,
    type: "Reading",
    description: "A great phone with one of the best cameras",
  },
  {
    name: "Write article",
    id: 2,
    type: "Writing",
    description: "Angular 9 app with memory leaks",
  },
  {
    name: "Implement app",
    id: 3,
    type: "Coding",
    description: "Angular 9 app with memory leaks",
  },
];
