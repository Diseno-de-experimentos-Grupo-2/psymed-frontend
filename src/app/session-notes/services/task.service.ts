import { Injectable } from '@angular/core';
import { BaseService } from "../../shared/services/base.service";
import { Task } from "../model/task.entity";
import {Observable, retry} from "rxjs";
import { catchError } from "rxjs/operators";
import {HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TaskService extends BaseService<Task> {

  constructor() {
    super();
    // Tasks are nested under sessions, so we don't set a base resource endpoint here
    this.resourceEndpoint = '';
  }

  /**
   * Get all tasks for a specific patient across all sessions
   * GET /api/v1/patients/{patientId}/tasks
   */
  public getTasksByPatientId(patientId: number, token: string): Observable<Task[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    const url = `${this.basePath}/patients/${patientId}/tasks`;
    return this.http.get<Task[]>(url, httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  /**
   * Get all tasks for a specific session
   * GET /api/v1/sessions/{sessionId}/tasks
   */
  public getTaskBySessionId(sessionId: number, token: string): Observable<Task[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    const url = `${this.basePath}/sessions/${sessionId}/tasks`;
    return this.http.get<Task[]>(url, httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  /**
   * Create a new task for a session
   * POST /api/v1/sessions/{sessionId}/tasks
   */
  public createTask(sessionId: number, task: {title: string, description: string}, token: string): Observable<Task> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    const url = `${this.basePath}/sessions/${sessionId}/tasks`;
    return this.http.post<Task>(url, JSON.stringify(task), httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  /**
   * Update a task
   * PUT /api/v1/sessions/{sessionId}/tasks/{taskId}
   */
  public updateTask(sessionId: number, taskId: number, task: {title?: string, description?: string}, token: string): Observable<Task> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    const url = `${this.basePath}/sessions/${sessionId}/tasks/${taskId}`;
    return this.http.put<Task>(url, JSON.stringify(task), httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  /**
   * Delete a task
   * DELETE /api/v1/sessions/{sessionId}/tasks/{taskId}
   */
  public deleteTask(sessionId: number, taskId: number, token: string): Observable<void> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    const url = `${this.basePath}/sessions/${sessionId}/tasks/${taskId}`;
    return this.http.delete<void>(url, httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  /**
   * Mark a task as completed
   * POST /api/v1/sessions/{sessionId}/tasks/{taskId}/complete
   */
  public completeTask(sessionId: number, taskId: number, token: string): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    const url = `${this.basePath}/sessions/${sessionId}/tasks/${taskId}/complete`;
    return this.http.post<string>(url, {}, httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
}
