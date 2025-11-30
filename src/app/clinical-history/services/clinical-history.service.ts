import { Injectable } from '@angular/core';
import {BaseService} from "../../shared/services/base.service";
import {ClinicalHistory} from "../models/clinical-history.entity";
import {Observable, retry} from "rxjs";
import {catchError} from "rxjs/operators";
import {HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ClinicalHistoryService extends BaseService<ClinicalHistory>{

  constructor() {
    super();
    // Clinical histories are nested under patients, so we don't set a base resource endpoint here
    this.resourceEndpoint = '';
  }

  /**
   * Get clinical history for a specific patient
   * GET /api/v1/patients/{patientId}/clinical-histories
   */
  public getClinicalHistoryByPatientId(patientId: number, token: string): Observable<ClinicalHistory> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    const url = `${this.basePath}/patients/${patientId}/clinical-histories`;
    return this.http.get<ClinicalHistory>(url, httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
}
