"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
require("rxjs/add/operator/debounceTime");
var customer_1 = require("./customer");
function ratingRange(min, max) {
    return function (c) {
        if (c.value !== undefined && (isNaN(c.value) || c.value < min || c.value > max)) {
            return { 'range': true };
        }
        return null;
    };
}
function emailCompare(c) {
    var emailControl = c.get('email');
    var emailConfirm = c.get('confirmEmail');
    if (emailControl.pristine || emailConfirm.pristine)
        return null;
    if (emailControl.value === emailConfirm.value)
        return null;
    return { 'match': true };
}
var CustomerComponent = (function () {
    function CustomerComponent(formBuilder) {
        this.formBuilder = formBuilder;
        this.customer = new customer_1.Customer();
        this.validationMessages = {
            required: 'Please enter your email address',
            email: 'Please enter a valid email address'
        };
    }
    Object.defineProperty(CustomerComponent.prototype, "addressGroup", {
        get: function () {
            return this.customerForm.get('addressGroup');
        },
        enumerable: true,
        configurable: true
    });
    CustomerComponent.prototype.save = function () {
        console.log(this.customerForm);
        console.log('Saved: ' + JSON.stringify(this.customerForm));
    };
    CustomerComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.customerForm = this.formBuilder.group({
            firstName: ['', [forms_1.Validators.required, forms_1.Validators.minLength(3)]],
            lastName: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(50)]],
            emailGroup: this.formBuilder.group({
                email: ['', [forms_1.Validators.required, forms_1.Validators.email]],
                confirmEmail: ['', [forms_1.Validators.required, forms_1.Validators.email]]
            }, { validator: emailCompare }),
            phone: '',
            notification: 'email',
            rating: ['', [ratingRange(1, 5)]],
            sendCatalog: true,
            addressGroup: this.formBuilder.array([this.buildAddressGroup()])
        });
        this.customerForm.get('notification').valueChanges.subscribe(function (value) { return _this.setNotification(value); });
        var emailControl = this.customerForm.get('emailGroup.email');
        emailControl.valueChanges.debounceTime(1500).subscribe(function (value) { return _this.setMessage(emailControl); });
    };
    CustomerComponent.prototype.addAddressGroup = function () {
        this.addressGroup.push(this.buildAddressGroup());
    };
    CustomerComponent.prototype.buildAddressGroup = function () {
        return this.formBuilder.group({
            addressType: 'home',
            street1: '',
            street2: '',
            city: '',
            state: '',
            zip: ''
        });
    };
    CustomerComponent.prototype.setNotification = function (notifyVia) {
        var phoneControl = this.customerForm.get('phone');
        if (notifyVia === 'text') {
            phoneControl.setValidators(forms_1.Validators.required);
        }
        else {
            phoneControl.clearValidators();
        }
        phoneControl.updateValueAndValidity();
    };
    CustomerComponent.prototype.setMessage = function (c) {
        var _this = this;
        this.emailMessage = '';
        if ((c.touched || c.dirty) && c.errors) {
            this.emailMessage = Object.keys(c.errors).map(function (key) {
                return _this.validationMessages[key];
            }).join(' ');
        }
    };
    return CustomerComponent;
}());
CustomerComponent = __decorate([
    core_1.Component({
        selector: 'my-signup',
        templateUrl: './app/customers/customer.component.html'
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder])
], CustomerComponent);
exports.CustomerComponent = CustomerComponent;
//# sourceMappingURL=customer.component.js.map