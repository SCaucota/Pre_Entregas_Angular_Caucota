import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-detail-dialog',
  templateUrl: './detail-dialog.component.html',
  styleUrl: './detail-dialog.component.scss'
})
export class DetailDialogComponent implements OnInit{
  @Output() confirmUnregistrationEvent = new EventEmitter();

  studentsEmpty = false

  constructor(
    private matDialogRef: MatDialogRef<DetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {title: string, entity: string, item: any, subitem: any}
  ){ }

  ngOnInit(): void {
    this.data.subitem.length === 0 ?
      this.studentsEmpty = true : this.studentsEmpty = false
  }

  get title(): string {
    return this.data.title
  }

  get entity(): any {
    return this.data.entity
  }

  get item(): any {
    return this.data.item
  }

  get subitem(): any {
    return this.data.subitem
  }

  handleStudents(item: any){
    return item && item.courses
  }

  handleCourses(item: any){
    return item && item.students
  }

  confirmUnregistration(courseId: string, studentId: string): void {
    this.confirmUnregistrationEvent.emit({courseId, studentId})
    this.matDialogRef.close();
  }
}