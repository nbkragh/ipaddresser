import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IPaddressList } from './ipaddress-list';

describe('IPaddressList', () => {
  let component: IPaddressList;
  let fixture: ComponentFixture<IPaddressList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IPaddressList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IPaddressList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
