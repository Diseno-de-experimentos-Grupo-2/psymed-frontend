import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Medication } from "../models/medication.entity";
import { BaseService } from '../../shared/services/base.service';
import { catchError, retry, tap } from "rxjs/operators";
import {HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MedicationService extends BaseService<Medication> {
  private medicationsSubject = new BehaviorSubject<Medication[]>([]);
  public medications$ = this.medicationsSubject.asObservable();

  constructor() {
    super();
    this.resourceEndpoint = '/pills';
  }

  public createMedication(medication: Medication, token: string | null): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    this.http.post<Medication>(`${this.resourcePath()}`, JSON.stringify(medication), httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
      .subscribe();
  }

  public getMedicationsByPatientId(patientId: number, token: string | null): Observable<Medication[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.get<Medication[]>(`${this.resourcePath()}/patient/${patientId}`, httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * Get all medications
   * GET /api/v1/pills
   */
  public getAllMedications(token: string | null): Observable<Medication[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.get<Medication[]>(this.resourcePath(), httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  /**
   * Delete medication
   * DELETE /api/v1/pills/{pillId}
   */
  public deleteMedication(pillId: number, token: string | null): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.delete<string>(`${this.resourcePath()}/${pillId}`, httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }
}
