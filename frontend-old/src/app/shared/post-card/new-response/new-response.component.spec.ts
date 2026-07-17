import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewResponseComponent } from './new-response.component';

describe('NewCommentComponent', () => {
  let component: NewResponseComponent;
  let fixture: ComponentFixture<NewResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewResponseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
