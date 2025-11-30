import { Component, Input, OnInit } from '@angular/core';
import { TaskCardComponent } from "../task-card/task-card.component";
import { TaskService } from "../../services/task.service";
import { Task } from "../../model/task.entity";
import { NgForOf } from "@angular/common";
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, PageEvent } from "@angular/material/paginator";

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    TaskCardComponent,
    NgForOf,
    MatPaginator
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  @Input() tasks: Task[] = []; // List of tasks displayed on the current page
  sessionId: number = 0;

  index: number = 0; // Current page index
  pageSize: number = 2; // Maximum tasks per page
  length: number = 0; // Total number of tasks
  oldIndex: number = 0;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Fetch session ID from route and load initial tasks
    const sessionId = Number(this.route.snapshot.paramMap.get('appointmentId'));
    this.sessionId = sessionId;
    const token = localStorage.getItem('authToken') || '';

    this.taskService.getTaskBySessionId(sessionId, token).subscribe((tasks: Task[]) => {
      this.length = tasks.length;
      this.tasks = tasks.slice(0, this.pageSize); // Load only the first page initially
    }, (error) => {
      console.error('Error fetching tasks:', error);
    });
  }

  onTaskCreated(newTask: Task): void {
    // Add the new task to the beginning of the task list
    this.length++; // Update the total task count
    this.tasks.unshift(newTask); // Add to the start of the page
    this.tasks = this.tasks.slice(0, this.pageSize); // Respect the page size limit

    // If the current page is full, reset to the first page
    if (this.length > this.pageSize * (this.index + 1)) {
      this.index = 0;
    }
    this.paginate(this.index); // Refresh the current page
  }

  onPage(event: PageEvent): void {
    // Update the current page index and load the respective tasks
    this.index = event.pageIndex;
    this.paginate(this.index);
  }

  onTaskDeleted(taskId: string): void {
    // Remove the deleted task and update the displayed page if necessary
    this.tasks = this.tasks.filter(task => task.id !== taskId);
    this.length--; // Decrease the total count
    if (this.tasks.length === 0 && this.index > 0) {
      this.index--; // Go back a page if the current page is empty
    }
    this.paginate(this.index);
  }

  private paginate(pageIndex: number) {
    const startIndex = pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const token = localStorage.getItem('authToken') || '';

    this.taskService.getTaskBySessionId(this.sessionId, token).subscribe((tasks: Task[]) => {
      this.tasks = tasks.slice(startIndex, endIndex); // Only fetch tasks for the current page
    }, (error) => {
      console.error('Error fetching tasks:', error);
    });
  }
}
