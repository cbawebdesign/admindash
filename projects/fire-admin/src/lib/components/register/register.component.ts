import { Component, OnInit } from '@angular/core';
import { getLogo } from '../../helpers/assets.helper';
import { NavigationService } from '../../services/navigation.service';
import { UsersService } from '../../services/collections/users.service';
import { UserRole } from '../../models/collections/user.model';

@Component({
  selector: 'fa-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  logo: string = getLogo();
  email: string = '';
  email1: string = '';
  email2: string = '';
  email3: string = '';
  email4: string = '';
  email5: string = '';
  email6: string = '';
  email7: string = '';
  email8: string = '';
  email9: string = '';
  email10: string = '';
  email11: string = '';
  email12: string = '';
  email13: string = '';
  email14: string = '';

contact1: string = '';
contact2: string = '';
contact3: string = '';
contact4: string = '';
contact5: string = '';
contact6: string = '';
contact7: string = '';
contact8: string = '';
contact9: string = '';
contact10: string = '';
contact11: string = '';
contact12: string = '';
contact13: string = '';
contact14: string = '';




  password: string = '';
  passwordConfirmation: string = '';
  error: string = null;
  businessName: string;

  constructor(public navigation: NavigationService, private users: UsersService) { }

  ngOnInit() {
  }

  onSubmit(event: Event, submitButton: HTMLButtonElement|any) {
    const form = event.target as any;
    form.isSubmitted = true;
    if (form.checkValidity() && this.password === this.passwordConfirmation) {
      const startLoading = () => {
        submitButton.isDisabled = true;
        submitButton.isLoading = true;
      };
      const stopLoading = () => {
        submitButton.isDisabled = false;
        submitButton.isLoading = false;
      };
      startLoading();
      // Register admin
      this.users.register({
        firstName: 'Super',
        lastName: 'Admin',
        businessName:this.businessName,
contact1: this.contact1,
contact2: this.contact2,
contact3: this.contact3,
contact4: this.contact4,
contact5: this.contact5,
contact6: this.contact6,
contact7: this.contact7,
contact8: this.contact8,
contact9: this.contact9,
contact10: this.contact10,
contact11: this.contact11,
contact12: this.contact12,
contact13: this.contact13,
contact14: this.contact14,

        email: this.email,
        email1: this.email1,
        email2: this.email2,

        email3: this.email3,
        email4: this.email4,
        email5: this.email5,
        email6: this.email6,
        email7: this.email7,
        email8: this.email8,
        email9: this.email9,
        email10:this.email10,
        email11: this.email11,
        email12: this.email12,
        email13: this.email13,
        email14: this.email14,
        password: this.password,
        role: UserRole.Administrator,
        birthDate: null,
        bio: null
      }).then(() => {
        this.navigation.redirectTo(`login?email=${this.email}&password=${this.password}`);
      }).catch((error: Error) => {
        this.error = error.message;
      }).finally(() => {
        stopLoading();
      });
    }
  }

  dismissError(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.error = null;
  }

}
