import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { TaskService } from "../../services/task.service";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import { Task } from "../../model/task.entity";
import { MatError, MatFormField, MatLabel } from "@angular/material/form-field";
import { NgIf } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { MatInput } from "@angular/material/input";
import { MatButton } from "@angular/material/button";

@Component({
  selector: 'app-task-edit-modal',
  standalone: true,
  imports: [
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    NgIf,
    TranslateModule,
    MatLabel,
    MatError,
    MatInput,
    MatDialogActions,
    MatButton,
    MatDialogTitle
  ],
  templateUrl: './task-edit-modal.component.html',
  styleUrl: './task-edit-modal.component.css'
})
export class TaskEditModalComponent implements OnInit {
  taskForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private dialogRef: MatDialogRef<TaskEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task
  ) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: [this.data.title, Validators.required],
      description: [this.data.description, Validators.required]

    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const token = localStorage.getItem('authToken') || '';
      const sessionId = this.data.idSession;
      const taskId = Number(this.data.id);
      
      // Use the new updateTask method
      this.taskService.updateTask(sessionId, taskId, {
        title: this.taskForm.value.title,
        description: this.taskForm.value.description
      }, token).subscribe({
        next: (response) => {
          console.log('Task updated:', response);
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Error updating task:', error);
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
