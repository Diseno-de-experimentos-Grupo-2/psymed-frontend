import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Store } from "@ngrx/store";
import { ActivatedRoute } from "@angular/router";
import { SignInRequest } from "../models/sign-in.request";
import { SignInResponse } from "../models/sign-in.response";
import { SignUpRequest } from "../models/sign-up.request";
import { SignUpResponse } from "../models/sign-up.response";
import { setJwtToken, setProfileId, setRole } from "../../store/auth/auth.actions";
import { tap } from "rxjs/operators";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  basePath: string = `${environment.serverBasePath}`;
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  constructor(
    private store: Store,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  signIn(signInRequest: SignInRequest) {
    // Send as plain object to ensure proper JSON serialization
    const requestBody = {
      username: signInRequest.username,
      password: signInRequest.password
    };
    
    console.log('Sign-in request:', requestBody);
    console.log('Sign-in endpoint:', `${this.basePath}/authentication/sign-in`);
    
    return this.http.post<SignInResponse>(`${this.basePath}/authentication/sign-in`, requestBody, this.httpOptions).pipe(
      tap((response: SignInResponse) => {
        console.log("Sign-in response:", response);
        console.log("Token for sign-in:", response.token);
        // Store session data - role will be fetched from account
        this.storeSessionData(response);
      })
    );
  }

  signUp(signUpRequest: SignUpRequest, role: string) {
    // Use the authentication sign-up endpoint as documented in the API
    const endpoint = `${this.basePath}/authentication/sign-up`;
    
    // The backend expects: {username, password, role}
    const signUpPayload = {
      username: signUpRequest.username,
      password: signUpRequest.password,
      role: role
    };

    return this.http.post<SignUpResponse>(endpoint, signUpPayload, this.httpOptions).pipe(
      tap((response: SignUpResponse) => {
        localStorage.setItem('role', response.role);
        localStorage.setItem('profileId', response.id.toString());

        // Dispatch to store
        this.store.dispatch(setRole({ rolId: response.role }));
        this.store.dispatch(setProfileId({ profileId: response.id }));
      })
    );
  }

  getProfileId(accountId: number, authToken: string, role: string): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      })
    };

    const endpoint =
      role === 'ROLE_PROFESSIONAL'
        ? `${this.basePath}/professional-profiles/account/${accountId}`
        : `${this.basePath}/patient-profiles/account/${accountId}`;

    return this.http.get<{ id: number }>(endpoint, httpOptions).pipe(
      map(response => response.id.toString())
    );
  }

  storeSessionData(response: SignInResponse): void {
    localStorage.setItem('authToken', response.token);
    this.store.dispatch(setJwtToken({ jwtToken: response.token }));

    // First, get the account to retrieve the role
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${response.token}`
      })
    };

    // Fetch account to get role
    this.http.get<{ id: number, username: string, role: string }>(`${this.basePath}/accounts/${response.id}`, httpOptions).subscribe(
      (account) => {
        const role = account.role;
        console.log("Role from account:", role);

        // Now get the profile ID using the role
        this.getProfileId(response.id, response.token, role).subscribe(
          (profileId) => {
            localStorage.setItem('role', role);
            localStorage.setItem('profileId', profileId);

            this.store.dispatch(setRole({ rolId: role }));
            this.store.dispatch(setProfileId({ profileId: Number(profileId) }));
          },
          (error) => {
            console.error('Error fetching profile ID:', error);
            // Still store the role even if profile fetch fails
            localStorage.setItem('role', role);
            this.store.dispatch(setRole({ rolId: role }));
          }
        );
      },
      (error) => {
        console.error('Error fetching account:', error);
        // Fallback: try to use role from query params or stored role
        const fallbackRole = this.route.snapshot.queryParamMap.get('role') || localStorage.getItem('role');
        if (fallbackRole) {
          this.getProfileId(response.id, response.token, fallbackRole).subscribe(
            (profileId) => {
              localStorage.setItem('role', fallbackRole);
              localStorage.setItem('profileId', profileId);
              this.store.dispatch(setRole({ rolId: fallbackRole }));
              this.store.dispatch(setProfileId({ profileId: Number(profileId) }));
            }
          );
        }
      }
    );
  }

  signOut(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    localStorage.removeItem('profileId');
    this.store.dispatch(setJwtToken({ jwtToken: null }));
    this.store.dispatch(setRole({ rolId: null }));
    this.store.dispatch(setProfileId({ profileId: null }));
  }

  resetPassword(account: string, newPassword: string) {
    return this.http.post(`${this.basePath}/api/reset-password`, { account, newPassword });
  }
}
