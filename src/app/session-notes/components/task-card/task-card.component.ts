import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Task} from "../../model/task.entity";
import {Store} from "@ngrx/store";
import {selectRolId} from "../../../store/auth/auth.selectors";
import {Observable} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TaskService} from "../../services/task.service";
import {TranslateModule} from "@ngx-translate/core";
import {MatCardActions} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatSlideToggle, MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatDialog} from "@angular/material/dialog";
import {TaskEditModalComponent} from "../task-edit-modal/task-edit-modal.component";

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    FormsModule,
    TranslateModule,
    MatCardActions,
    MatButton,
    MatIcon,
    MatSlideToggle,
    MatSlideToggleModule
  ],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent implements OnInit {
  @Input() task!: Task;
  @Output() taskDeleted = new EventEmitter<string>();
  role$!: Observable<string | null>;

  constructor(private store: Store,
    private taskService: TaskService, private dialog: MatDialog

  ) {
  }


  deleteThisCard(taskId: string): void{
    const token = localStorage.getItem('authToken') || '';
    const sessionId = this.task.idSession;
    const taskIdNum = Number(this.task.id);
    
    this.taskService.deleteTask(sessionId, taskIdNum, token).subscribe(
      () => {
        console.log(`Task with id ${taskId} deleted successfully`);
        this.taskDeleted.emit(taskId);
      },
      (error) => {
        console.error('Error deleting task:', error);
      }
    );

  }

  toggleStatus(): void {
    const token = localStorage.getItem('authToken') || '';
    const sessionId = this.task.idSession;
    const taskId = Number(this.task.id);
    
    this.taskService.completeTask(sessionId, taskId, token).subscribe({
      next: () => {
        // Toggle status locally
        this.task.status = this.task.status === 0 ? 1 : 0;
        console.log('Task status updated');
      },
      error: (error) => {
        console.error('Error updating task status:', error);
      }
    });
  }

  ngOnInit() {
    this.role$ = this.store.select(selectRolId);
    this.role$.subscribe(role => {
      console.log("el rol de task card es " + role);
    });
  }

  openEditModal(task: Task): void {
    const dialogRef = this.dialog.open(TaskEditModalComponent, {
      width: '400px',
      data: task
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update the task if needed
        Object.assign(this.task, result);
      }
    });
  }

}
