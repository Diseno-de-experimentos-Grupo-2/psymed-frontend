import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Task } from "../../model/task.entity";
import { TaskService } from "../../services/task.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {MatButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {NgIf} from "@angular/common";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  standalone: true,
  imports: [
    TranslateModule,
    MatButton,
    MatError,
    NgIf,
    MatLabel,
    MatFormField,
    MatInput,
    ReactiveFormsModule
  ],
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  id!: number;
  appointmentId!: number;
  @Output() taskCreated = new EventEmitter<Task>();

  constructor(private fb: FormBuilder,
              private taskService: TaskService,
              private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.appointmentId = +this.route.snapshot.paramMap.get('appointmentId')!;

    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
    console.log("Patient ID for task creation:", this.id);
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const formValues = this.taskForm.value;
      const token = localStorage.getItem('authToken') || '';
      
      // Use the new createTask method
      this.taskService.createTask(this.appointmentId, {
        title: formValues.title,
        description: formValues.description
      }, token).subscribe((response: any) => {
        console.log('Task created successfully', response);
        // Map response to Task entity format for compatibility
        // Backend returns taskId, but Task entity uses id
        const taskId = (response as any).taskId || response.id;
        const newTask = new Task({
          id: taskId?.toString() || '',
          idPatient: this.id,
          idSession: this.appointmentId,
          title: response.title,
          description: response.description,
          status: response.status || 0,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        this.taskCreated.emit(newTask);
      }, error => {
        console.error('Error creating task:', error);
      });
    }
  }
}
