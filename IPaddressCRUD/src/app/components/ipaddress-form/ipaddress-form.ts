import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { AbstractControl,  FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IPaddressService } from '../../services/IPaddress.service';
import { IPaddress } from '../../models/IPaddress.models';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { APIResultInfo } from '../../models/APIResultInfo.models';
import { map, Subscription, take } from 'rxjs';

@Component({
  selector: 'ipaddress-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ipaddress-form.html',
})
export class IPaddressForm {
  IPaddressForm: FormGroup;
  IPaddressID?: number;
  isEdit = false;
  existingIPs: string[] = [];
  
  private sub!: Subscription;
  @Input() 
  ipToEdit?: IPaddress;

  @Output() 
  formSubmitted = new EventEmitter<APIResultInfo>();


  constructor(
    private fb: FormBuilder,
    private IPaddressService: IPaddressService
  ) {
    
    
    this.IPaddressForm = this.fb.group({
      id: [ { value: '', disabled: true }],
      IP: ['', [Validators.required,
        Validators.pattern(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/),
        Validators.minLength(7)
        //uniqueIPValidator(this.existingIPs, this.ipToEdit?.IP)
        ], [this.uniqueIPAsyncValidator()]
      ],
      Description: [''],
      VLAN: ['', [
        Validators.required,
        Validators.pattern(/^\d+$/)]
      ]
    });
  }

  ngOnInit(): void {
    this.sub = this.IPaddressService.ipList.subscribe(list => {
      
      this.existingIPs = list.map(i => i.IP);
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['ipToEdit'] && this.ipToEdit) {
      this.IPaddressForm.patchValue({
        id: this.ipToEdit.id,
        IP: this.ipToEdit.IP,
        Description: this.ipToEdit.Description,
        VLAN: this.ipToEdit.VLAN
      });
      this.IPaddressForm.get('IP')?.disable(); //immutable IP
      this.isEdit = true;
    } else if (!this.ipToEdit) {
    // Re-enable IP if creating a new record
      this.IPaddressForm.get('IP')?.enable();
      this.isEdit = false;
  }
  }
  async onSubmit() {
    if (this.IPaddressForm.invalid) return;

    const IPaddress = this.IPaddressForm.getRawValue() as IPaddress;
    console.log(IPaddress);
    if(this.isEdit){
      try{
        const updateResult = await this.IPaddressService.updateIPaddress( IPaddress)
        this.formSubmitted.emit({success: true, action: 'updated', errormessage: undefined});
      }catch (error){
        this.formSubmitted.emit({success: false, action: 'updated', errormessage: error instanceof HttpErrorResponse ? '\n'+error.message : '\nUnknown error'});
        return;
      }
    } else {
      try{
        const createResult = await this.IPaddressService.createIPaddress(IPaddress);
        this.formSubmitted.emit({success: true, action: 'added' , errormessage: undefined});
      }catch (error){
        this.formSubmitted.emit({success: false, action: 'added' , errormessage: error instanceof HttpErrorResponse ? '\n'+error.message : '\nUnknown error'});
        return;
      }
    }
    this.IPaddressForm.reset();
    
    this.isEdit = false;
  }

  cancelEdit() {
    this.IPaddressForm.reset();
    this.IPaddressForm.get('IP')?.enable();
    this.ipToEdit = undefined;
    this.isEdit = false;
  }

  ngOnDestroy() {
    // Prevent memory leaks
    this.sub.unsubscribe();
  }
  uniqueIPAsyncValidator() {
    return (control: AbstractControl) => 
      this.IPaddressService.ipList.pipe(
        take(1),
        map(addresses => {
          const exists = addresses.some(ip => ip.IP === control.value);
          return exists ? { duplicateIP: true } : null;
        })
      );
  }
}

/* export function uniqueIPValidator(existingIPs: string[], currentIP?: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const ip = control.value;
    console.log('Validating IP:', ip, existingIPs);
    if (!ip) return null; // skip empty

    return existingIPs.includes(ip) ? { ipTaken: true } : null;
  }; 
}*/

