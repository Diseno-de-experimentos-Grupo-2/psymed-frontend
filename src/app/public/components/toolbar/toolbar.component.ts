import { Component, OnInit, OnDestroy } from '@angular/core';
import { SessionService } from "../../../appointment-and-administration/services/session.service";
import { Store } from '@ngrx/store';
import { AuthState } from "../../../store/auth/auth.state";
import {selectJwtToken, selectProfileId, selectRolId} from "../../../store/auth/auth.selectors";
import { combineLatest, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router, RouterLink } from "@angular/router";
import { reset } from "../../../store/auth/auth.actions";
import { MatToolbar } from "@angular/material/toolbar";
import { NgForOf, NgOptimizedImage } from "@angular/common";
import { LanguageSwitcherComponent } from "../language-switcher/language-switcher.component";
import { MatAnchor } from "@angular/material/button";
import { TranslateModule } from "@ngx-translate/core";
import {AuthenticationService} from "../../../iam/services/authentication.service";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  standalone: true,
  imports: [
    MatToolbar,
    NgOptimizedImage,
    LanguageSwitcherComponent,
    NgForOf,
    MatAnchor,
    RouterLink,
    TranslateModule
  ],
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, OnDestroy {
  //#region Attributes

  /**
   * @property {Observable<string | null>} rolId$ - Observable for the role ID of the user.
   */
  role$!: Observable<string | null>;

  /**
   * @property {Observable<number | null>} patientId$ - Observable for the patient ID of the logged-in user.
   */
  accountId$!: Observable<number | null>;

  /**
   * @property {Observable<string | null>} professionalId$ - Observable for the professional ID of the logged-in user (for role 1).
   */
  jwtToken$!: Observable<string | null>;

  /**
   * @property {Array<{path: string, name: string}>} options - Stores navigation options based on role ID.
   */
  options: Array<{ path: string, name: string }> = [];

  /**
   * @property {Subject<boolean>} destroy$ - Subject to handle unsubscription and prevent memory leaks.
   * Emits a value on logout or destroy, allowing for automatic unsubscription from observables.
   */
  private destroy$: Subject<boolean> = new Subject<boolean>();

  /**
   * @property {Router} router - Angular Router service for navigation control.
   * Used to navigate to the login page before logging out and resetting the application state.
   */
  constructor(
    private appointmentService: SessionService,
    private store: Store<AuthState>,
    private router: Router, // Inject Router service here
    private authService: AuthenticationService // Inject AuthenticationService
  ) {}


  //#endregion

  //#region Lifecycle Hooks

  /**
   * ngOnInit lifecycle hook - Initializes observables and sets up options based on role ID.
   * Combines rolId, professionalId, and patientId observables to set navigation options dynamically.
   */
  ngOnInit(): void {
    console.log("Initializing ToolbarComponent");

    this.role$ = this.store.select(selectRolId);
    this.accountId$ = this.store.select(selectProfileId);
    this.jwtToken$ = this.store.select(selectJwtToken);

    combineLatest([this.role$, this.accountId$, this.jwtToken$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([role, accountId, jwtToken]) => {
        console.log("Role:", role, "Profile ID:", accountId, "JWT Token:", jwtToken);

        if (role === 'ROLE_PROFESSIONAL' && accountId) {
          this.options = [
            { path: '/patient-management', name: 'patient-management' },
            { path: '/login', name: 'logout' }
          ];
        } else if (role === 'ROLE_PATIENT' && accountId) {
          this.options = [
            { path: '/mood-state', name: 'mood-state' },
            { path: '/biological-functions', name: 'biological-functions' },
            { path: `/patient/prescription/${accountId}`, name: 'prescription' },
            { path: `/patient/appointment-list`, name: 'appointments' },
            { path: '/login', name: 'logout' }
          ];
        } else {
          this.options = [
            { path: '/home', name: 'home' },
            { path: '/login', name: 'login' }
          ];
        }
      });
  }

  //#endregion

  //#region Event Handlers

  /**
   * onLogout - Handles the logout event by navigating to the login page and resetting the store.
   * Ensures all active subscriptions are unsubscribed to prevent multiple alerts.
   */
  protected onLogout(): void {
    console.log("Logging out...");

    // Call the logout method in AuthenticationService
    this.authService.signOut();

    // Navigate to the login page
    this.router.navigate(['/home']).catch((error) => {
      console.error('Navigation to login failed:', error);
    });
  }

  /**
   * ngOnDestroy lifecycle hook - Cleans up subscriptions to prevent memory leaks.
   * Ensures destroy$ is unsubscribed and completes any active subscriptions.
   */
  ngOnDestroy(): void {
    this.destroy$.next(true); // Emit destroy signal
    this.destroy$.unsubscribe(); // Unsubscribe from observables
  }

  //#endregion

  //#region Commented Out Code

  // Commented out notification variables
  // newAppointmentsCount: number = 0;
  // appointments: any[] = [];

  // Commented out method for viewing notifications
  /*
  viewNotifications(): void {
    this.notificationService.resetCounter();
    this.fetchAppointments();
  }
  */

  // Commented out method to fetch appointments
  /*
  fetchAppointments() {
    this.appointmentService.getAll().subscribe({
      next: (appointments: any[]) => {
        this.appointments = appointments;
      },
      error: (error) => {
        console.error('Error fetching appointments:', error);
      }
    });
  }
  */

  //#endregion
}
