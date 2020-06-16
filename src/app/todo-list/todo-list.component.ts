import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { TodoService } from "../todo.service";
import { TodoDialogComponent } from "../todo-dialog/todo-dialog.component";
import { Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";

export interface TODO {
  id: number;
  name: string;
  type: string; // = 'Coding' | 'Reading' | 'Writing';
  description?: string;
  dependencies?: TODO;
}

@Component({
  selector: "app-todo-list",
  templateUrl: "./todo-list.component.html",
  styleUrls: ["./todo-list.component.scss"],
})
export class TodoListComponent implements OnInit {
  todoList: TODO[];

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(public dialog: MatDialog, public todoService: TodoService) {}

  ngOnInit() {
    this.todoService
      .getTodos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((todos) => (this.todoList = todos));
  }

  openTodoDialog(mode: string, todo?: TODO): void {
    // mode = 'create' | 'update'
    const dialogRef = this.dialog.open(TodoDialogComponent, {
      width: "800px",
      data: { mode: mode, todos: todo ? [todo] : [] },
    });
    dialogRef.afterClosed().subscribe((result: TODO[]) => {
      if (result) {
        this.todoService.updateTodoList(result, mode);
      }
    });
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
