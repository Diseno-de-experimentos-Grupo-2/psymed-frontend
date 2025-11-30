import { Component, Input, OnInit } from '@angular/core';
import { ClinicalHistoryService } from '../../services/clinical-history.service';
import { ClinicalHistory } from "../../models/clinical-history.entity";
import { ActivatedRoute, Router } from "@angular/router";
import { Patient } from "../../../shared/model/patient.entity";
import { PatientService } from "../../../shared/services/patient.service";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: 'app-clinical-information',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './clinical-information.component.html',
  styleUrls: ['./clinical-information.component.css']
})
export class ClinicalInformationComponent implements OnInit {
  @Input() clinicalHistory!: ClinicalHistory;
  @Input() patient!: Patient;

  constructor(
    private clinicalHistoryService: ClinicalHistoryService,
    private route: ActivatedRoute,
    private patientService: PatientService,
    private router: Router
  ) {}

  loadClinicalHistory() {
    const patientId = this.route.snapshot.params['id'];
    const token = localStorage.getItem('authToken') || '';

    if (!patientId) {
      console.error('No patient ID found in route.');
      return;
    }

    // Fetch patient information
    this.patientService.getById(patientId).subscribe(
      (patient: Patient) => {
        this.patient = patient;
        console.log('Loaded patient:', this.patient);
      },
      (error) => {
        console.error('Error loading patient:', error);
      }
    );

    // Fetch clinical history by patient ID
    this.clinicalHistoryService.getClinicalHistoryByPatientId(Number(patientId), token).subscribe(
      (clinicalHistory: ClinicalHistory) => {
        this.clinicalHistory = clinicalHistory;
        console.log('Loaded clinical history:', this.clinicalHistory);
      },
      (error) => {
        if (error.status === 404) {
          console.log('No clinical history found for this patient');
        } else {
          console.error('Error loading clinical history:', error);
        }
      }
    );
  }

  redirectToAdminEdit() {
    this.router.navigate([`./admin-edit`], { relativeTo: this.route });
  }

  redirectToDiagnostic() {
    this.router.navigate([`./diagnostic`], { relativeTo: this.route });
  }

  ngOnInit() {
    this.loadClinicalHistory();
  }
}
