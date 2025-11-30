import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Patient } from '../../../shared/model/patient.entity';
import { PatientService } from '../../../shared/services/patient.service';
import { ClinicalHistory } from '../../models/clinical-history.entity';
import { ClinicalHistoryService } from '../../services/clinical-history.service';
import { selectProfileId } from '../../../store/auth/auth.selectors';
import { AuthState } from '../../../store/auth/auth.state';
import { take } from 'rxjs/operators';
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-clinical-information-patient',
  standalone: true,
  imports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './clinical-information-patient.component.html',
  styleUrls: ['./clinical-information-patient.component.css']
})
export class ClinicalInformationPatientComponent implements OnInit {
  clinicalHistory!: ClinicalHistory;

  constructor(
    private clinicalService: ClinicalHistoryService,
    private patientService: PatientService,
    private store: Store<AuthState>
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('authToken') || '';
    
    this.store.select(selectProfileId).pipe(take(1)).subscribe(patientId => {
      if (patientId) {
        // Fetch clinical history directly by patient ID (as per API)
        this.clinicalService.getClinicalHistoryByPatientId(Number(patientId), token).subscribe((clinical: ClinicalHistory) => {
          this.clinicalHistory = clinical;
        }, (error) => {
          if (error.status === 404) {
            console.log('No clinical history found for this patient');
          } else {
            console.error('Error loading clinical history:', error);
          }
        });
      }
    });
  }
}
