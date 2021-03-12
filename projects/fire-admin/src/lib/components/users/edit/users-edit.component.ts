import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserRole, User } from '../../../models/collections/user.model';
import { Subscription } from 'rxjs';
import { UsersService } from '../../../services/collections/users.service';
import { I18nService } from '../../../services/i18n.service';
import { AlertService } from '../../../services/alert.service';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'fa-users-edit',
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.css']
})
export class UsersEditComponent implements OnInit, OnDestroy {

  id: string;
  firstName: string;
  lastName: string;
  contact1:string;
  contact2:string;
  contact3:string;
  contact4:string;
  contact5:string;
  contact6:string;
  contact7:string;
  contact8:string;
  contact9:string;
  contact10:string;
  contact11:string;
  contact12:string;
  contact13:string;
  contact14:string;

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

  password: string;
  birthDate: string;
  role: UserRole;
  allRoles: object|any = {};
  bio: string;
  private avatar: File;
  avatarSrc: string|ArrayBuffer;
  private subscription: Subscription = new Subscription();
  userData: User; // used to keep track of old user data
  businessName: string;

  constructor(
    private users: UsersService,
    private i18n: I18nService,
    private alert: AlertService,
    private route: ActivatedRoute,
    public navigation: NavigationService
  ) { }

  ngOnInit() {
    this.allRoles = this.users.getAllRoles();
    this.subscription.add(
      this.route.params.subscribe((params: { id: string }) => {
        // console.log(params);
        this.users.get(params.id).pipe(take(1)).toPromise().then((user: User) => {
          // console.log(user);
          if (user) {
            this.userData = user;
            this.id = params.id;
            this.firstName = user.firstName;
            this.lastName = user.lastName;
            this.businessName = user.businessName;
            this.email = user.email;
            this.email1 = user.email1;
            this.email2 = user.email2;
            this.email3 = user.email3;
            this.email4 = user.email4;
            this.email5 = user.email5;
            this.email6 = user.email6;
            this.email7 = user.email7;
            this.email8 = user.email8;
            this.email9 = user.email9;
            this.email10 = user.email10;
            this.email11 = user.email11;
            this.email12 = user.email12;
            this.email13 = user.email13;
            this.email14 = user.email14;

            this.contact1 = user.contact1,
            this.contact2 = user.contact2,
            this.contact3 = user.contact3,
            this.contact4 = user.contact4,
            this.contact5 = user.contact5,
            this.contact6 = user.contact6,
            this.contact7 = user.contact7,
            this.contact8 = user.contact8,
            this.contact9 = user.contact9,
            this.contact10 = user.contact10,
            this.contact11= user.contact11,
            this.contact12 = user.contact12,
            this.contact13 = user.contact13,
            this.contact14 = user.contact14,

        //     this.email1 = null;
        //     this.email2 = null;
        //     this.email3 = null;
        //     this.email4 = null;
        //     this.email5 = null;
        //     this.email6 = null;
        //     this.email7 = null;
        //     this.email8 = null;
        //     this.email9= null;
        //     this.email10 = null;
        //     this.email11 = null;
        //     this.email12 = null;
        //     this.email13 = null;
        //     this.email14 = null;
        
        // this.contact1 = null;
        // this.contact2 = null;
        // this.contact3 = null;
        // this.contact4 = null;
        // this.contact4 = null;
        // this.contact5 = null;
        // this.contact6 = null;
        // this.contact7 = null;
        // this.contact8 = null;
        // this.contact9 = null;
        // this.contact10 = null;
        // this.contact11 = null;
        // this.contact12 = null;
        // this.contact13 = null;
        // this.contact14 = null;

            this.password = user.password;
            this.birthDate = user.birthDate ? new Date(user.birthDate).toISOString().slice(0, 10) : null;
            this.role = user.role;
            this.bio = user.bio;
            this.avatar = null;
            this.subscription.add(
              this.users.getAvatarUrl(user.avatar as string).subscribe((imageUrl: string) => {
                this.avatarSrc = imageUrl;
              })
            );
          } else {
            this.navigation.redirectTo('users', 'list');
          }
        });
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onAvatarChange(event: Event) {
    this.avatar = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.avatarSrc = reader.result;
    };
    reader.readAsDataURL(this.avatar);
  }

  updateUser(event: Event, form: HTMLFormElement) {
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
      // Edit user
      const data: User = {
        firstName: this.firstName,
        lastName: this.lastName,
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
        businessName:this.businessName,
        email3: this.email3,
        email4: this.email4,
        email5: this.email5,
        email6: this.email6,
        email7: this.email7,
        email8: this.email8,
        email9: this.email9,
        email10:this.email10,
        email11:this.email11,
        email12:this.email12,
        email13:this.email13,
        email14: this.email14,

        password: this.password,
        birthDate: this.birthDate ? new Date(this.birthDate).getTime() : null,
        role: this.role,
        bio: this.bio
      };
      if (this.avatar) {
        data.avatar = this.avatar;
      }
      this.users.edit(this.id, data, {
        contact1: this.userData.contact1,
        contact2: this.userData.contact2,
        contact3: this.userData.contact3,
        contact4: this.userData.contact4,
        contact5: this.userData.contact5,
        contact6: this.userData.contact6,
        contact7: this.userData.contact7,
        contact8: this.userData.contact8,
        contact9: this.userData.contact9,
        contact10: this.userData.contact10,
        contact11: this.userData.contact11,
        contact12: this.userData.contact12,
        contact13: this.userData.contact13,
        contact14: this.userData.contact14,

        email: this.userData.email,
        email1: this.userData.email1,
        email2: this.userData.email2,
        email3: this.userData.email3,
        email4: this.userData.email4,
        email5: this.userData.email5,
        email6: this.userData.email6,
        email7: this.userData.email7,
        email8: this.userData.email8,
        email9: this.userData.email9,
        email10: this.userData.email10,
        email11: this.userData.email11,
        email12: this.userData.email12,
        email13: this.userData.email13,
        email14: this.userData.email14,
businessName:this.userData.businessName,
        password: this.userData.password
      }).then(() => {
        this.userData = {...this.userData, ...data}; // override old user data
        this.alert.success(this.i18n.get('UserUpdated'), false, 5000);
      }).catch((error: Error) => {
        this.alert.error(error.message);
      }).finally(() => {
        stopLoading();
      });
    }
  }

}
