import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PatientProfile } from "../../../shared/model/patient-profile.entity";
import { UserManagementService } from "../../services/user-management.service";
import { MatDialog } from "@angular/material/dialog";
import { PatientFormComponent } from "../../components/patient-form/patient-form.component";
import { Router } from "@angular/router";
import {PatientListComponent} from "../../components/patient-list/patient-list.component";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-patient-management',
  standalone: true,
  imports: [
    PatientListComponent,
    AsyncPipe
  ],
  templateUrl: './patient-management.component.html',
  styleUrls: ['./patient-management.component.css']
})
export class PatientManagementComponent implements OnInit {
  private patientsSubject = new BehaviorSubject<PatientProfile[]>([]);
  patients$ = this.patientsSubject.asObservable(); // Expose as Observable

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private patientService: UserManagementService
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  // Load patients and push to BehaviorSubject
  loadPatients(): void {
    const professionalId = localStorage.getItem("profileId");
    const authToken = localStorage.getItem("authToken");

    this.patientService.getPatientsByProfessionalId(professionalId, authToken).subscribe({
      next: (profiles: Array<PatientProfile>) => {
        this.patientsSubject.next(profiles);
        console.log("Fetched patient profiles:", profiles);
      },
      error: (err) => console.error("Error fetching patients:", err)
    });

  }

  // Open form dialog
  openForm(): void {
    const dialogRef = this.dialog.open(PatientFormComponent);

    dialogRef.componentInstance.formClosed.subscribe(() => {
      dialogRef.close();
      this.loadPatients(); // Reload the list after the form is closed
    });
  }

  // Handle selected feature
  onFeatureSelected(feature: { patient: PatientProfile, feature: string }): void {
    const { patient, feature: featureName } = feature;

    switch (featureName) {
      case 'edit':
        this.router.navigate([`/patient/profile/${patient.id}`]).then();
        break;
      case 'medication':
        this.router.navigate([`/patient-management/${patient.id}/medication-management`]).then();
        break;
      case 'statistics':
        this.router.navigate([`/patient-management/${patient.id}/dashboard-analytics`]).then();
        break;
      case 'appointments':
        this.router.navigate([`/patient-management/${patient.id}/patient-appointment-list`]).then();
        break;
      default:
        console.error(`Unhandled feature: ${featureName}`);
    }
  }
}
