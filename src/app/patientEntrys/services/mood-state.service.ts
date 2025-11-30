import { Injectable } from '@angular/core';
import { MoodState } from '../models/mood-state.entity';
import { BaseService } from "../../shared/services/base.service";
import {catchError, Observable, retry, switchMap, throwError} from "rxjs";
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MoodStateService extends BaseService<MoodState> {
  constructor(protected override http: HttpClient) {
    super();
    this.resourceEndpoint = '/patients';
  }

  // Method to create a new mood state
  // POST /api/v1/patients/{patientId}/mood-states
  public createMoodState(moodState: MoodState, token: string | null): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    const url = `${this.resourcePath()}/${moodState.idPatient}/mood-states`;
    // Backend expects: {mood: string, date: string}
    const requestBody = {
      mood: moodState.mood.toString(),
      date: new Date().toISOString() // Use current date if not provided
    };
    this.http.post(url, JSON.stringify(requestBody), httpOptions)
      .pipe(
        retry(2),
        catchError(error => {
          alert("Only one mood state for day.");
          return throwError(error);
        })
      )
      .subscribe(() => {
        console.log("Mood state created successfully.");
      });
  }


  // Method to fetch all mood states by patient ID
  public getMoodStatesByPatientId(patientId: number | null, token: string | null): Observable<any> {
    console.log(`Fetching mood states for patientId: ${patientId}...`);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }),
      responseType: 'json' as 'json'
    };
    const url = `${this.resourcePath()}/${patientId}/mood-states`;

    return this.http.get<any>(url, httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

}
