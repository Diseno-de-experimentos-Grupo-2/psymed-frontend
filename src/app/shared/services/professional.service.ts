import { Injectable } from '@angular/core';
import {BaseService} from "./base.service";
import {catchError, Observable, retry} from "rxjs";
import {ProfessionalProfile} from "../model/professional-profile";
import {HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProfessionalService extends BaseService <ProfessionalProfile> {

  constructor() {
    super()
    this.resourceEndpoint = '/professional-profiles';
  }
  public getProfessionalByProfileId(profileId: number, token: string): Observable<ProfessionalProfile> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Include the token for authorization
      })
    };

    return this.http.get<ProfessionalProfile>(`${this.resourcePath()}/${profileId}`, httpOptions)
      .pipe(
        retry(2), // Retry the request up to 2 times in case of transient failures
        catchError(this.handleError) // Handle any errors in the request
      );
  }

  /**
   * Get professional profile by account ID
   * GET /api/v1/professional-profiles/account/{accountId}
   */
  public getProfessionalByAccountId(accountId: number, token: string): Observable<ProfessionalProfile> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.get<ProfessionalProfile>(`${this.resourcePath()}/account/${accountId}`, httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }
}
