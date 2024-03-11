/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SubGroupsSoldComponent } from './sub-groups-sold.component';

describe('SubGroupsSoldComponent', () => {
  let component: SubGroupsSoldComponent;
  let fixture: ComponentFixture<SubGroupsSoldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubGroupsSoldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubGroupsSoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
