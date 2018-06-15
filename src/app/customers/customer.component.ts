import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';

import 'rxjs/add/operator/debounceTime';

import { Customer } from './customer';

function ratingRange(min: number, max: number): ValidatorFn {
    return (c: AbstractControl): {[key: string]: boolean} | null => {
        if (c.value !== undefined && (isNaN(c.value) || c.value < min || c.value > max) ) return {'range' : true};
        return null;
    }
}

function emailCompare(c: AbstractControl): {[key: string]: boolean} | null {
    let emailControl = c.get('email');
    let emailConfirm = c.get('confirmEmail');
    if (emailControl.pristine || emailConfirm.pristine) return null;
    if (emailControl.value === emailConfirm.value) return null;
    return {'match': true};
}


@Component({
    selector: 'my-signup',
    templateUrl: './app/customers/customer.component.html'
})
export class CustomerComponent implements OnInit  {
    customerForm: FormGroup;
    addressForm: FormGroup;
    customer: Customer= new Customer();
    emailMessage: string;

    get addressGroup(): FormArray {
        return <FormArray>this.customerForm.get('addressGroup');
    }

    private validationMessages = {
        required: 'Please enter your email address',
        email: 'Please enter a valid email address'
    };

    constructor(private formBuilder: FormBuilder) {}

    save() {
        console.log(this.customerForm);
        console.log('Saved: ' + JSON.stringify(this.customerForm));
    }

    ngOnInit(): void {
        this.customerForm = this.formBuilder.group({
            firstName: ['', [Validators.required, Validators.minLength(3)] ],
            lastName: ['', [Validators.required, Validators.maxLength(50)] ],
            emailGroup: this.formBuilder.group({
                email: ['', [Validators.required, Validators.email] ],
                confirmEmail: ['', [Validators.required, Validators.email] ]
            }, {validator: emailCompare} ),
            phone: '',
            notification: 'email',
            rating: ['', [ratingRange(1, 5)] ],
            sendCatalog: true,
            addressGroup: this.formBuilder.array( [this.buildAddressGroup()] )
        });

        this.customerForm.get('notification').valueChanges.subscribe( value => this.setNotification(value) );
        const emailControl = this.customerForm.get('emailGroup.email');
        emailControl.valueChanges.debounceTime(1500).subscribe( value => this.setMessage(emailControl) );
    }

    addAddressGroup() {
        this.addressGroup.push(this.buildAddressGroup());
    }

    buildAddressGroup(): FormGroup {
        return  this.formBuilder.group({
            addressType: 'home',
            street1: '',
            street2: '',
            city: '',
            state: '',
            zip: ''
        });
    }

    setNotification(notifyVia: string) {
        const phoneControl = this.customerForm.get('phone');
        if (notifyVia === 'text') {
            phoneControl.setValidators(Validators.required);
        } else {
            phoneControl.clearValidators();
        }
        phoneControl.updateValueAndValidity();
    }

    setMessage(c: AbstractControl) {
        this.emailMessage = '';
        if ( (c.touched || c.dirty) && c.errors ) {
            this.emailMessage = Object.keys(c.errors).map( key =>
                this.validationMessages[key]).join(' ');
        }
    }
 }
