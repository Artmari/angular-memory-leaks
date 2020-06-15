import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { TODO } from "../todo.model";
import { TodoService } from "../todo.service";

import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

export interface TodoDialogData {
  todo?: TODO;
  mode: string; // 'create' | 'update'
}

@Component({
  selector: "app-todo-dialog",
  templateUrl: "./todo-dialog.component.html",
  styleUrls: ["./todo-dialog.component.scss"],
})
export class TodoDialogComponent implements OnInit {
  todoForm: FormGroup;
  name: string;
  type: string;
  dependencies: TODO;
  description: string;
  types: string[] = [];
  todoList: TODO[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public todoService: TodoService,
    public dialogRef: MatDialogRef<TodoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TodoDialogData
  ) {}

  ngOnInit() {
    this.todoService.getTodos().subscribe((todos) => (this.todoList = todos));
    this.todoService.getTypes().subscribe((types) => (this.types = types));

    this.todoForm = this.formBuilder.group({
      id: [this.data.todo?.id],
      name: [this.data.todo?.name, [Validators.required]], // new FormControl(this.event.title),
      type: [this.data.todo?.type, [Validators.required]],
      dependencies: [this.data.todo?.dependencies, []],
      description: [this.data.todo?.description, []],
    });
  }
  save(): void {
    this.todoService.updateTodoList(this.todoForm.value, this.data.mode);
    this.dialogRef.close(this.todoForm.value);
  }
}
