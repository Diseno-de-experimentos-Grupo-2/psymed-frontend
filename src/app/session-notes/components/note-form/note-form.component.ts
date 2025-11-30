import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { NoteService } from "../../services/note.service";
import { SessionNote } from "../../model/session-note.entity";
import { TranslateModule } from "@ngx-translate/core";
import { MatError, MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-note-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    NgIf
  ],
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.css']
})
export class NoteFormComponent {
  @Input() patientId!: string;
  @Input() sessionId!: string;

  @Output() noteAdded = new EventEmitter<SessionNote>();

  noteForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  })

  constructor(private noteService: NoteService) {}

  //#region Utility Methods
  private constructSessionNoteObject(noteId: string): SessionNote {
    console.log('ID data:', this.patientId, this.sessionId);
    const title = this.noteForm.value.title?.toString() ?? '';
    const description = this.noteForm.value.description?.toString() ?? '';
    const actualDate = new Date().toISOString();
    return new SessionNote(this.patientId, this.sessionId, title, description, actualDate, noteId);
  }

  //#endregion
  //#region Service Method

  createNote(): void {
    const token = localStorage.getItem('authToken') || '';
    const sessionId = Number(this.sessionId);
    
    // Use the new createNote method
    this.noteService.createNote(sessionId, {
      title: this.noteForm.value.title || '',
      description: this.noteForm.value.description || ''
    }, token).subscribe((createdNote: SessionNote) => {
      // Map response to SessionNote entity format for compatibility
      const note = new SessionNote(
        this.patientId,
        this.sessionId,
        createdNote.title || this.noteForm.value.title || '',
        createdNote.description || this.noteForm.value.description || '',
        new Date().toISOString(),
        createdNote.id?.toString() || ''
      );
      this.noteAdded.emit(note);
      console.log('Note created successfully');
    }, error => {
      console.error('Error creating note:', error);
    });
  }

  //#endregion

  //#region Event Handler

  onSubmit() {
    if (this.noteForm.valid) {
      this.createNote();
    } else {
      console.error('Form is invalid');
    }
  }

  //#endregion
}
