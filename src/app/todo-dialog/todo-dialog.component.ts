import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { TODO } from "../todo.model";
import { TodoService } from "../todo.service";
import { Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

export interface TodoDialogData {
  todos?: TODO[];
  mode: string; // 'create' | 'update'
}

@Component({
  selector: "app-todo-dialog",
  templateUrl: "./todo-dialog.component.html",
  styleUrls: ["./todo-dialog.component.scss"],
})
export class TodoDialogComponent implements OnInit {
  todosForm: FormGroup;
  name: string;
  type: string;
  dependencies: TODO;
  description: string;

  types: string[] = [];
  todoList: TODO[] = [];
  filteredTodoList: TODO[] = [];
  mode: string = "create"; // 'create' | 'update'

  destroy$: Subject<boolean> = new Subject<boolean>();
  typeChangesUnsubscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public todoService: TodoService,
    public dialogRef: MatDialogRef<TodoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TodoDialogData
  ) {}

  get todosFormArray(): FormArray {
    return this.todosForm.get("todos") as FormArray;
  }

  ngOnInit() {
    this.mode = this.data.mode;
    console.log("qqqq", this.data);
    this.todoService
      .getTodos()
      .pipe(takeUntil(this.destroy$))
      .subscribe((todos) => {
        this.todoList = todos;
        this.filteredTodoList = this.todoList;
      });
    this.todoService
      .getTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((types) => (this.types = types));

    const index = 0;
    const formGroup = this.createTodoForm(this.data.todos[0], index);
    this.todosForm = this.formBuilder.group({
      todos: new FormArray([formGroup]),
    });
  }

  addTodo() {
    const index = this.todosFormArray.controls.length;
    const formGroup = this.createTodoForm(null, index);
    this.todosFormArray.push(formGroup);
  }

  createTodoForm(todo: TODO, index: number): FormGroup {
    const formGroup = this.formBuilder.group({
      index: [index],
      id: [todo?.id],
      name: [todo?.name, [Validators.required]],
      type: [todo?.type, [Validators.required]],
      dependencies: [todo?.dependencies, []],
      description: [todo?.description, []],
    });
    formGroup.valueChanges.subscribe((value) => {
      console.log("form " + index + ": value changed");
    });
    this.typeChangesUnsubscriptions[index] = formGroup
      .get("type")
      .valueChanges.subscribe((selectedType) => {
        this.filteredTodoList = this.filterTodoListPerType(selectedType);
      });
    return formGroup;
  }

  filterTodoListPerType(type: string): TODO[] {
    return this.todoList.filter((todo) => {
      if (type === "Writing") {
        return true;
      } else {
        return todo.type !== "Writing";
      }
    });
  }
  deleteTodoForm(index: number) {
    this.todosFormArray.removeAt(index);
  }
  save(): void {
    this.dialogRef.close(this.todosForm.value.todos);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.typeChangesUnsubscriptions.forEach((value) => value.unsubscribe());
  }
}
