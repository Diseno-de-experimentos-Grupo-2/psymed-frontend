import { Component, OnInit, OnDestroy } from '@angular/core';
import { MoodState } from '../../models/mood-state.entity';
import { MoodStateService } from '../../services/mood-state.service';
import { Store } from '@ngrx/store';
import { AuthState } from '../../../store/auth/auth.state';
import { Observable, Subject } from 'rxjs';
import { selectProfileId } from '../../../store/auth/auth.selectors';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-mood-form',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './mood-form.component.html',
  styleUrls: ['./mood-form.component.css']
})
export class MoodFormComponent implements OnInit, OnDestroy {
  patientId!: number | null;
  currentDate: string = this.formatDate(new Date());
  patientId$!: Observable<number | null>;

  /**
   * Flag to check if today's mood has already been recorded
   */
  private isMoodRecordedToday = false;

  /**
   * Subject to handle unsubscription
   */
  private destroy$ = new Subject<void>();

  constructor(
    private translateService: TranslateService,
    private moodStateService: MoodStateService,
    private store: Store<AuthState>
  ) {}

  ngOnInit(): void {
    this.patientId$ = this.store.select(selectProfileId);
    this.patientId$
      .pipe(takeUntil(this.destroy$))
      .subscribe(patientId => {
        this.patientId = patientId;
        console.log('Patient Id for mood statement:', this.patientId);
      });
  }

  // Function to format date as "yyyy-MM-dd"
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  selectMood(mood: number) {
    const profileId = localStorage.getItem("profileId");
    const token = localStorage.getItem("authToken");
    const parsedProfileId = profileId ? Number(profileId) : null;
    console.log("profile id en mood form : ", parsedProfileId);
    console.log("mood value into mood form : ", mood);
    const moodState = new MoodState(0, parsedProfileId, mood);
    this.moodStateService.createMoodState(moodState, token);
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // Trigger unsubscribe for all subscriptions
    this.destroy$.complete(); // Complete the destroy$ subject
  }
}
