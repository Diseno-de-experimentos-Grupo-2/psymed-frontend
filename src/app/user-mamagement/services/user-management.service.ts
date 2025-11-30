import { Injectable } from '@angular/core';
import {BaseService} from "../../shared/services/base.service";
import {PatientProfile} from "../../shared/model/patient-profile.entity";
import {catchError, Observable, retry} from "rxjs";
import {HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserManagementService extends BaseService<PatientProfile>{

  constructor() {
    super();
    this.resourceEndpoint = "/patient-profiles"

  }

  public createPatientProfile(patientProfile: PatientProfile, token: string): Observable<PatientProfile> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.post<PatientProfile>(this.resourcePath(), JSON.stringify(patientProfile), httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  public getPatientsByProfessionalId(professionalId: string | null, token: string | null): Observable<PatientProfile[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.get<PatientProfile[]>(`${this.resourcePath()}/professional/${professionalId}`, httpOptions);
  }

  /**
   * Retrieves the details of a specific patient by their ID.
   * @param profileId - The ID of the patient to fetch details for.
   * @param token - The authorization token.
   * @returns Observable containing the patient's profile.
   */
  public getPatientById(profileId: number, token: string): Observable<PatientProfile> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.get<PatientProfile>(`${this.resourcePath()}/${profileId}`, httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  /**
   * Get patient profile by account ID
   * GET /api/v1/patient-profiles/account/{accountId}
   */
  public getPatientByAccountId(accountId: number, token: string): Observable<PatientProfile> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.get<PatientProfile>(`${this.resourcePath()}/account/${accountId}`, httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  /**
   * Update patient profile
   * PUT /api/v1/patient-profiles/{profileId}
   * All fields are optional - only sent fields will be updated
   */
  public updatePatientProfile(profileId: number, updateData: {
    firstName?: string,
    lastName?: string,
    street?: string,
    city?: string,
    country?: string,
    email?: string
  }, token: string): Observable<PatientProfile> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.put<PatientProfile>(`${this.resourcePath()}/${profileId}`, JSON.stringify(updateData), httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  /**
   * Delete patient profile
   * DELETE /api/v1/patient-profiles/{profileId}
   */
  public deletePatientProfile(profileId: number, token: string): Observable<void> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.delete<void>(`${this.resourcePath()}/${profileId}`, httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
}
