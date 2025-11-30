import { Injectable } from '@angular/core';
import { BaseService } from "../../shared/services/base.service";
import { SessionNote } from "../model/session-note.entity";
import { Observable, retry } from "rxjs";
import { catchError } from "rxjs/operators";
import {HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class NoteService extends BaseService<SessionNote> {

  constructor() {
    super();
    // Notes are nested under sessions, so we don't set a base resource endpoint here
    this.resourceEndpoint = '';
  }

  /**
   * Get note for a specific session
   * GET /api/v1/sessions/{sessionId}/notes
   * Note: According to the API, a session can only have one note
   */
  public findSessionNotesBySessionId(sessionId: number, token: string): Observable<SessionNote> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    const url = `${this.basePath}/sessions/${sessionId}/notes`;
    return this.http.get<SessionNote>(url, httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  /**
   * Create a note for a session
   * POST /api/v1/sessions/{sessionId}/notes
   */
  public createNote(sessionId: number, note: {title: string, description: string}, token: string): Observable<SessionNote> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    const url = `${this.basePath}/sessions/${sessionId}/notes`;
    return this.http.post<SessionNote>(url, JSON.stringify(note), httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
}
