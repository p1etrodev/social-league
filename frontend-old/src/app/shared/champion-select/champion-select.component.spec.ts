import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChampionSelectComponent } from './champion-select.component';

describe('ChampionSelectComponent', () => {
  let component: ChampionSelectComponent;
  let fixture: ComponentFixture<ChampionSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChampionSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChampionSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
