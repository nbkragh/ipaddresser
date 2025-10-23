import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IPaddressForm } from './ipaddress-form';

describe('IPaddressForm', () => {
  let component: IPaddressForm;
  let fixture: ComponentFixture<IPaddressForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IPaddressForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IPaddressForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
