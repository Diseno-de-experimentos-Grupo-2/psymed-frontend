import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MedicationService } from '../../services/medication.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Medication } from '../../models/medication.entity';

@Component({
  selector: 'app-medication-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    TranslateModule
  ],
  templateUrl: './medication-form.component.html',
  styleUrls: ['./medication-form.component.css']
})
export class MedicationFormComponent implements OnInit {
  medicationForm!: FormGroup;
  patientId!: number;
  constructor(private fb: FormBuilder, private medicationService: MedicationService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.patientId = +this.route.snapshot.paramMap.get('id')!;
    this.medicationForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      interval: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit(): void {
    if (this.medicationForm.valid) {
      const formValues = this.medicationForm.value;
      const newMedication = new Medication({
        name: formValues.name,
        description: formValues.description,
        interval: formValues.interval,
        quantity: formValues.quantity,
        patientId: this.patientId
        // Los demás campos se asignan por defecto en el constructor
      });
      this.medicationService.createMedication(newMedication, localStorage.getItem('authToken'));
    } else {
      console.error('Form is invalid');
    }
  }
}
