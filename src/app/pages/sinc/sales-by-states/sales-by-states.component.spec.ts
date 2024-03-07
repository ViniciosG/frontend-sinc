/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SalesByStatesComponent } from './sales-by-states.component';

describe('SalesByStatesComponent', () => {
  let component: SalesByStatesComponent;
  let fixture: ComponentFixture<SalesByStatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesByStatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesByStatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
