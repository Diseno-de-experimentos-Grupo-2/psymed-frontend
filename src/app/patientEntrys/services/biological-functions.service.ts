import { Injectable } from '@angular/core';
import { BiologicalFunctions } from "../models/biological-functions.entity";
import { BaseService } from "../../shared/services/base.service";
import {catchError, map, Observable, of, switchMap, throwError} from "rxjs";
import { retry } from "rxjs/operators";
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BiologicalFunctionsService extends BaseService<BiologicalFunctions> {

  constructor(override http: HttpClient) {
    super();
    this.resourceEndpoint = '/patients';
  }



  /**
   * Create a biological function record
   * POST /api/v1/patients/{patientId}/biological-functions
   * Backend expects: {functionType: string, value: string, date: string}
   * Note: Each function type (hunger, hydration, sleep, energy) should be sent separately
   */
  public createBiologicalFunction(patientId: number, functionType: string, value: string, date: string, token: string | null): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    const url = `${this.resourcePath()}/${patientId}/biological-functions`;
    const requestBody = {
      functionType: functionType,
      value: value,
      date: date || new Date().toISOString()
    };

    return this.http.post(url, JSON.stringify(requestBody), httpOptions)
      .pipe(
        retry(2),
        catchError(error => {
          alert("Only one biological report by Day.");
          return throwError(error);
        })
      );
  }

  /**
   * Legacy method - creates all biological functions separately
   * This method sends 4 separate requests (one for each function type)
   */
  public createBiologicalFunctions(biologicalFunctions: BiologicalFunctions, token: string | null): void {
    const patientId = biologicalFunctions.idPatient;
    const date = new Date().toISOString();
    
    // Create separate requests for each function type
    const functions = [
      { type: 'hunger', value: biologicalFunctions.hunger.toString() },
      { type: 'hydration', value: biologicalFunctions.hydration.toString() },
      { type: 'sleep', value: biologicalFunctions.sleep.toString() },
      { type: 'energy', value: biologicalFunctions.energy.toString() }
    ];

    functions.forEach(func => {
      this.createBiologicalFunction(patientId, func.type, func.value, date, token).subscribe({
        next: () => console.log(`${func.type} recorded successfully`),
        error: (error) => console.error(`Error recording ${func.type}:`, error)
      });
    });
  }


  // Fetch biological functions for a specific patient
  public getBiologicalFunctionsByPatientId(patientId: number, token: string | null): Observable<any[]> {
    console.log(`Fetching biological functions for patientId: ${patientId}...`);
    const url = `${this.resourcePath()}/${patientId}/biological-functions`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.get<any[]>(url, httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
}
