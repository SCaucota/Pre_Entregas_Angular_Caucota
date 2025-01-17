import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudStudentsComponent } from './crud-students.component';

describe('CrudStudentsComponent', () => {
  let component: CrudStudentsComponent;
  let fixture: ComponentFixture<CrudStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrudStudentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
