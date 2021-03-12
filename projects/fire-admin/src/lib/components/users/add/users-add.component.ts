import { Component, OnInit } from '@angular/core';
import { getDefaultAvatar } from '../../../helpers/assets.helper';
import { UserRole } from '../../../models/collections/user.model';
import { UsersService } from '../../../services/collections/users.service';
import { AlertService } from '../../../services/alert.service';
import { I18nService } from '../../../services/i18n.service';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'fa-users-add',
  templateUrl: './users-add.component.html',
  styleUrls: ['./users-add.component.css']
})
export class UsersAddComponent implements OnInit {

  firstName: string;
  lastName: string;
  email: string;
  email1: string;
  email2: string;
    email3: string;
    email4: string;
    email5: string;
    email6: string;
    email7: string;
    email8: string;
    email9: string;
    email10: string;
    email11: string;
    email12: string;
    email13: string;
    email14: string;

    businessName: string;
    contact1:string;
    contact2:string;
    contact3:string;
    contact4:string;
    contact5:string;
    contact6:string;
    contact7:string;
    contact8:string;
    contact9:string;
    contact10: string;
    contact11: string;
    contact12: string;
    contact13: string;
    contact14: string;
  password: string;
  birthDate: string;
  role: UserRole;
  allRoles: object|any = {};
  bio: string;
  private avatar: File;
  avatarSrc: string|ArrayBuffer;

  constructor(
    private users: UsersService,
    private alert: AlertService,
    private i18n: I18nService,
    private navigation: NavigationService
  ) { }

  ngOnInit() {
    this.allRoles = this.users.getAllRoles();
    this.role = UserRole.Guest;
    this.avatar = null;
    this.email1 = null;
    this.email2 = null;
    this.email3 = null;
    this.email4 = null;
    this.email5 = null;
    this.email6 = null;
    this.email7 = null;
    this.email8 = null;
    this.email9= null;
    this.email10 = null;
    this.email11 = null;
    this.email12 = null;
    this.email13 = null;
    this.email14 = null;

this.contact1 = null;
this.contact2 = null;
this.contact3 = null;
this.contact4 = null;
this.contact4 = null;
this.contact5 = null;
this.contact6 = null;
this.contact7 = null;
this.contact8 = null;
this.contact9 = null;
this.contact10 = null;
this.contact11 = null;
this.contact12 = null;
this.contact13 = null;
this.contact14 = null;



    this.avatarSrc = getDefaultAvatar();
    this.bio = null;
  }

  onAvatarChange(event: Event) {
    this.avatar = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.avatarSrc = reader.result;
    };
    reader.readAsDataURL(this.avatar);
  }

  addUser(event: Event, form: HTMLFormElement) {
    form.isSubmitted = true;
    if (form.checkValidity()) {
      const target = event.target as any;
      const startLoading = () => {
        target.isDisabled = true;
        target.isLoading = true;
      };
      const stopLoading = () => {
        target.isDisabled = false;
        target.isLoading = false;
      };
      startLoading();
      // Add user
      this.users.add({
        firstName: this.firstName,
        lastName: this.lastName,
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
        businessName: this.businessName,
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


        password: this.password,
        birthDate: this.birthDate ? new Date(this.birthDate).getTime() : null,
        role: this.role,
        bio: this.bio,
        avatar: this.avatar
      }).then(() => {
        this.alert.success(this.i18n.get('UserAdded'), false, 5000, true);
        this.navigation.redirectTo('users', 'list');
      }).catch((error: Error) => {
        this.alert.error(error.message);
      }).finally(() => {
        stopLoading();
      });
    }
  }

}
