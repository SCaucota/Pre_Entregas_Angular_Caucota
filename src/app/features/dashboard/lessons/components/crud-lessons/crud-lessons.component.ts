import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Lesson } from '../../models/lesson';
import { LessonsDialogComponent } from '../lessons-dialog/lessons-dialog.component';
import { DeleteDialogComponent } from '../../../../../shared/components/delete-dialog/delete-dialog.component';
import { DetailDialogComponent } from '../../../../../shared/components/detail-dialog/detail-dialog.component';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { filter, Observable, take } from 'rxjs';
import { User } from '../../../users/models/user';
import { Store } from '@ngrx/store';
import { LessonActions } from '../../store/lesson.actions';
import { selectIsLoadingLessons, selectLessons, selectLessonsError, selectSingleLesson } from '../../store/lesson.selectors';

@Component({
  selector: 'app-crud-lessons',
  templateUrl: './crud-lessons.component.html',
  styleUrl: './crud-lessons.component.scss'
})
export class CrudLessonsComponent implements OnInit {

  lessons$: Observable<Lesson[]>;
  singleLesson$: Observable<Lesson>;
  isLoading$: Observable<boolean>;
  error$: Observable<unknown>;
  authUser$: Observable<User | null>

  constructor(
    private matDialog: MatDialog,
    private authService: AuthService,
    private store: Store
  ) {
    this.authUser$ = this.authService.authUser$;
    this.lessons$ = this.store.select(selectLessons);
    this.singleLesson$ = this.store.select(selectSingleLesson);
    this.isLoading$ = this.store.select(selectIsLoadingLessons);
    this.error$ = this.store.select(selectLessonsError);
  }

  displayedColumns: string[] = ['id', 'name', 'date', 'courseTitle', 'status', 'actions'];

  isAdmin: boolean = false;

  ngOnInit(): void {
    this.store.dispatch(LessonActions.loadLessons());

    this.authService.authUser$.subscribe((user: User | null) => {
      this.isAdmin = user?.role === 'ADMIN';
    });
  }

  openDialog(): void {
    const dialogRef = this.matDialog.open(LessonsDialogComponent);

    dialogRef.componentInstance.onSubmitLessonEvent.subscribe((lesson: Lesson) => {
      this.onSubmitLesson(lesson);
    })
  }

  onSubmitLesson(lesson: Lesson): void {
    this.store.dispatch(LessonActions.addLesson({ lesson }));
  }

  deleteLesson(id: string): void {
    this.store.dispatch(LessonActions.lessonById({ id }));

    this.singleLesson$.pipe(
      filter(lesson => !!lesson && lesson.id === id),
      take(1)
    ).subscribe({
      next: (lesson) => {
        const dialogRef = this.matDialog.open(DeleteDialogComponent, {
          data: {
            title: 'Eliminar Clase',
            entityName: 'la clase',
            item: lesson
          }
        })
  
        dialogRef.componentInstance.confirmDeleteEvent.subscribe(() => {
          this.store.dispatch(LessonActions.deleteLesson({ id }))
        })
      },
      error: (err) => console.error('Error al eliminar la clase: ', err)
    })

  }

  editLesson(editingLesson: Lesson): void {
    this.matDialog.open(LessonsDialogComponent, { data: editingLesson }).afterClosed().subscribe({
      next: (value) => {
        if (!!value) {
          this.store.dispatch(LessonActions.editLesson({ id: editingLesson.id, editingLesson: value }))
        }
      },
      error: (err) => console.log("Error al editar la clase: ", err)
    })
  }

  openDetail(id: string): void {

    this.store.dispatch(LessonActions.lessonById({ id }));

    this.singleLesson$.pipe(
      filter(lesson => !!lesson && lesson.id === id),
      take(1)
    ).subscribe({
      next: (lesson) => {
        this.matDialog.open(DetailDialogComponent, {
          data: {
            title: 'Detalles de la Clase',
            item: lesson,
            subitem: []
          }
        });
      },
      error: (err) => console.error('Error al cargar los detalles de la calse: ', err)
    })
  }
}
