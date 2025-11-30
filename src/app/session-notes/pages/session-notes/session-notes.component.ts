import {Component, OnInit, ViewChild} from '@angular/core';
import {NoteListComponent} from "../../components/note-list/note-list.component";
import {SessionNote} from "../../model/session-note.entity";
import {ActivatedRoute} from "@angular/router";
import {NoteService} from "../../services/note.service";
import {NoteFormComponent} from "../../components/note-form/note-form.component";
import {MatPaginator, PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-session-notes',
  standalone: true,
  imports: [
    NoteListComponent,
    NoteFormComponent,
    MatPaginator
  ],
  templateUrl: './session-notes.component.html',
  styleUrl: './session-notes.component.css'
})
export class SessionNotesComponent implements OnInit {
  //#region Attributes
  protected sessionNotes: Array<SessionNote> = [];
  protected tempSessionNotes: Array<SessionNote> = [];

  protected sessionId!: string;
  protected patientId!: string;

  @ViewChild(NoteFormComponent) formComponent!: NoteFormComponent

  index : number = 0;
  pageSize : number = 2;
  length: number = 0;

  oldIndex = 0;

  constructor(private activatedRouter: ActivatedRoute,
              private noteService: NoteService) {}
  //#endregion

  //#region Service Methods
  private getSessionNotes(): void{
    this.sessionId = this.activatedRouter.snapshot.paramMap.get('appointmentId')!;
    this.patientId = this.activatedRouter.snapshot.paramMap.get('id')!;
    const token = localStorage.getItem('authToken') || '';

    // Note: According to the API, a session can only have one note
    this.noteService.findSessionNotesBySessionId(Number(this.sessionId), token).subscribe((response: SessionNote) => {
      if (response) {
        this.tempSessionNotes = [response]; // Convert single note to array for compatibility
        this.sessionNotes = [response];
        this.length = 1;
      } else {
        this.tempSessionNotes = [];
        this.sessionNotes = [];
        this.length = 0;
      }
      console.log(response);
      console.log('session notes array', this.tempSessionNotes);
    }, (error) => {
      // If no note exists (404), initialize empty arrays
      if (error.status === 404) {
        this.tempSessionNotes = [];
        this.sessionNotes = [];
        this.length = 0;
      } else {
        console.error('Error fetching session note:', error);
      }
    })
  }

  protected deleteSessionNoteById(sessionNote: SessionNote): void {
    const noteId = sessionNote.id;
    this.noteService.delete(noteId).subscribe(() => {
      // Filter out the deleted note from the sessionNotes array
      this.sessionNotes = this.sessionNotes.filter(note => note.id !== noteId);
      this.length--; // Update the total length of notes

      console.log('Note deleted and list updated');

      // If the current page is now empty and not the first page, go to the previous page
      if (this.sessionNotes.length === 0 && this.index > 0) {
        this.index--; // Move to the previous page
        this.paginate(this.index); // Fetch notes for the previous page
      }
    }, error => {
      console.error('Error deleting note:', error);
    });
  }

  //#endregion

  //#region Lifecycle Hooks
  ngOnInit(): void {
    this.getSessionNotes();

  }
  //#endregion

  //#region Event Handlers

  protected onNoteAdded(note: SessionNote): void {
    this.length++; // Increase the total length of notes

    // Add the new note to the temporary list of all session notes
    this.tempSessionNotes.push(note);

    // If the current page has space for an additional note
    if (this.sessionNotes.length < this.pageSize) {
      this.sessionNotes.push(note); // Add the note to the visible session notes on the current page
    } else {
      // If the current page is full, do nothing; the new note will appear on the next page
      console.log('Note added; it will appear on the next page due to pagination limits.');
    }
  }

  //#endregion

  onPage(event: PageEvent): void {
    this.index = event.pageIndex; // Update the current page index
    this.sessionNotes = []; // Clear the current page notes
    this.paginate(this.index); // Load notes for the selected page
  }


  private paginate(index : number) {
    const token = localStorage.getItem('authToken') || '';
    
    // Note: According to the API, a session can only have one note
    this.noteService.findSessionNotesBySessionId(Number(this.sessionId), token).subscribe((response: SessionNote) => {
      console.log("La sesion de tarea es" + this.sessionId);

      if (response) {
        this.tempSessionNotes = [response];
        this.sessionNotes = [response];
      } else {
        this.tempSessionNotes = [];
        this.sessionNotes = [];
      }

      console.log(response)
    }, (error) => {
      if (error.status === 404) {
        this.tempSessionNotes = [];
        this.sessionNotes = [];
      } else {
        console.error('Error fetching note:', error);
      }
    });
  }

}
