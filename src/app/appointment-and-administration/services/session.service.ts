import { Injectable } from '@angular/core';
import { BaseService } from "../../shared/services/base.service";
import { Session } from "../model/sesion.entity";
import { catchError, Observable, retry } from "rxjs";
import {environment} from "../../../environments/environment";
import {HttpHeaders} from "@angular/common/http";

/**
 * SessionService to manage API calls related to session entities.
 * This service extends the BaseService to inherit common functionality for resource management.
 */
@Injectable({
  providedIn: 'root'
})
export class SessionService extends BaseService<Session> {

  //#region Constructor

  /**
   * Constructor for the SessionService.
   * Initializes the service by setting the resource endpoint to '/sessions'.
   * This endpoint is used to perform CRUD operations on session data.
   */
  constructor() {
    super();
    // Set the default resource endpoint for session-related API requests
    this.resourceEndpoint = `/sessions`;
  }

  //#endregion

  //#region Methods

  /**
   * Fetch all sessions for a specific professional.
   *
   * @param professionalID - ID of the professional.
   * @param authToken
   * @returns Observable containing an array of sessions.
   */
  public getSessionsByProfessionalID(professionalID: number, authToken: string): Observable<Session[]> {
    const url = `${environment.serverBasePath}/professionals/${professionalID}/sessions`; // Full endpoint for fetching sessions by professional ID

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}` // Include the token for authorization
      })
    };

    console.log('Fetching sessions for professional ID with URL:', url);

    return this.http.get<Session[]>(url, httpOptions).pipe(
      retry(2), // Retry the request in case of transient failures
      catchError(this.handleError) // Handle errors gracefully
    );
  }


  /**
   * Fetch all sessions for a specific patient.
   *
   * @param patientID - ID of the patient.
   * @param token
   * @returns Observable containing an array of sessions.
   */
  public getSessionsByPatientID(patientID: number, token: string): Observable<Session[]> {
    const url = `${environment.serverBasePath}/patients/${patientID}/sessions`; // Full endpoint for fetching sessions by patient ID

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Include the token for authorization
      })
    };

    console.log('Fetching sessions for patient ID with URL:', url);

    return this.http.get<Session[]>(url, httpOptions).pipe(
      retry(2), // Retry the request in case of transient failures
      catchError(this.handleError) // Handle errors gracefully
    );
  }


  /**
   * Make a reservation for a patient with a specific professional.
   *
   * @param professionalID - ID of the professional.
   * @param patientID - ID of the patient.
   * @param sessionData - The session object containing details of the reservation.
   * @param token
   * @returns Observable containing the created session object.
   */
  public makeReservation(professionalID: number, patientID: number, sessionData: Session, token: string): Observable<Session> {
    const url = `${environment.serverBasePath}/professionals/${professionalID}/patients/${patientID}/sessions`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Include the token for authorization
      })
    };

    // Backend expects: {appointmentDate: string, sessionTime: number}
    // Map from Session entity to backend format
    const requestBody = {
      appointmentDate: sessionData.appointmentDate,
      sessionTime: sessionData.sessionTime
    };

    console.log('Making reservation with URL:', url, 'and data:', requestBody);

    return this.http.post<Session>(url, JSON.stringify(requestBody), httpOptions).pipe(
      retry(2), // Retry on failure
      catchError(this.handleError) // Handle errors gracefully
    );
  }

  //#endregion
}
