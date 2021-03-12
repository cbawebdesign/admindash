import { Injectable } from '@angular/core';
import { DatabaseService } from '../database.service';
import { now, isFile, guid } from '../../helpers/functions.helper';
import { User, UserRole } from '../../models/collections/user.model';
import { StorageService } from '../storage.service';
import { FirebaseUserService } from '../firebase-user.service';
import { getDefaultAvatar, getLoadingImage } from '../../helpers/assets.helper';
import { of, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { QueryFn } from '@angular/fire/firestore';

@Injectable()
export class UsersService {

  private allRoles: object = {};
  private imagesCache: object = {};
  private fullNameCache: object = {};

  constructor(
    private db: DatabaseService,
    private storage: StorageService,
    private firebaseUser: FirebaseUserService
  ) {
    Object.keys(UserRole).forEach((key: string) => {
      this.allRoles[UserRole[key]] = key;
    });
  }

  getAllRoles() {
    return this.allRoles;
  }

  add(data: User) {
    const user: User = {
      firstName: data.firstName,
      lastName: data.lastName,
      contact1: data.contact1,
      contact2: data.contact2,
      contact3: data.contact3,
      contact4: data.contact4,
      contact5: data.contact5,
      contact6: data.contact6,
      contact7: data.contact7,
      contact8: data.contact8,
      contact9: data.contact9,
      contact10: data.contact10,
      contact11: data.contact11,
      contact12: data.contact12,
      contact13: data.contact13,
      contact14: data.contact14,
      email: data.email,
      email2: data.email2,
      email3: data.email3,
      email4: data.email4,
      email5: data.email5,
      email6: data.email6,
      email7: data.email7,
      email8: data.email8,
      email9: data.email9,
      email10: data.email10,
      email11: data.email11,
      email12: data.email12,
      email13: data.email13,
      email14: data.email14,

      // email9: data.email9,
      // email10: data.email10,
      email1: data.email1,
      businessName: data.businessName,

      password: data.password, // ToDo: add encryption for password (do not use hashing, since we need plain password on update/delete @see FirebaseUserService)
      birthDate: data.birthDate,
      role: data.role,
      bio: data.bio,
      avatar: null,
      createdAt: now(), // timestamp
      updatedAt: null,
      createdBy: this.db.currentUser.id,
      updatedBy: null
    };
    return new Promise((resolve, reject) => {
      this.firebaseUser.create(data.email, data.password).then((uid: string) => {
        this.uploadImageAfter(this.db.addDocument('users', user, uid), user, data).then(() => {
          resolve();
        }).catch((error: Error) => {
          reject(error);
        });
      }).catch((error: Error) => {
        reject(error);
      });
    });
  }

  register(data: User) {
    const user: User = {
      firstName: data.firstName,
      lastName: data.lastName,
      businessName: data.businessName,
      contact1: data.contact1,
      contact2: data.contact2,
      contact3: data.contact3,
      contact4: data.contact4,
      contact5: data.contact5,
      contact6: data.contact6,
      contact7: data.contact7,
      contact8: data.contact8,
      contact9: data.contact9,
      contact10: data.contact10,
      contact11: data.contact11,
      contact12: data.contact12,
      contact13: data.contact13,
      contact14: data.contact14,

      email: data.email,
      email1: data.email1,
      email2: data.email2,
      email3: data.email3,
      email4: data.email4,
      email5: data.email5,
      email6: data.email6,
      email7: data.email7,
      email8: data.email8,
      email9: data.email9,
      email10: data.email10,
      email11: data.email11,
      email12: data.email12,
      email13: data.email13,
      email14: data.email14,


      password: data.password, // ToDo: add encryption for password (do not use hashing, since we need plain password on update/delete @see FirebaseUserService)
      birthDate: data.birthDate,
      role: data.role,
      bio: data.bio,
      avatar: null,
      createdAt: now(), // timestamp
      updatedAt: null,
      createdBy: null,
      updatedBy: null
    };
    return new Promise((resolve, reject) => {
      this.firebaseUser.register(user).then(() => {
        resolve();
      }).catch((error: Error) => {
        reject(error);
      });
    });
  }

  private uploadImageAfter(promise: Promise<any>, user: User, data: User) {
    return new Promise((resolve, reject) => {
      promise.then((doc: any) => {
        if (data.avatar && isFile(data.avatar)) {
          const id = doc ? doc.id : data.id;
          const imageFile = (data.avatar as File);
          const imageName = guid() + '.' + imageFile.name.split('.').pop();
          const imagePath = `users/${id}/${imageName}`;
          this.storage.upload(imagePath, imageFile).then(() => {
            user.avatar = imagePath;
            const savePromise: Promise<any> = doc ? doc.set(user) : this.db.setDocument('users', id, user);
            savePromise.finally(() => {
              resolve();
            });
          }).catch((error: Error) => {
            reject(error);
          });
        } else {
          resolve();
        }
      }).catch((error: Error) => {
        reject(error);
      });
    });
  }

  get(id: string) {
    return this.db.getDocument('users', id).pipe(map((user: User) => {
      user.id = id;
      return user;
    }));
  }

  getFullName(id: string) {
    if (this.fullNameCache[id]) {
      return of(this.fullNameCache[id]);
    } else {
      return this.get(id).pipe(map((user: User) => {
        const fullName = `${user.firstName} ${user.lastName}`;
        this.fullNameCache[id] = fullName;
        return fullName;
      }));
    }
  }

  getAll() {
    return this.db.getCollection('users');
  }

  getWhere(field: string, operator: firebase.firestore.WhereFilterOp, value: string) {
    return this.getWhereFn(ref => ref.where(field, operator, value));
  }

  getWhereFn(queryFn: QueryFn) {
    return this.db.getCollection('users', queryFn);
  }

  getAvatarUrl(imagePath: string) {
    if (imagePath) {
      if (this.imagesCache[imagePath]) {
        return of(this.imagesCache[imagePath]);
      } else {
        return merge(of(getLoadingImage()), this.storage.get(imagePath).getDownloadURL().pipe(map((imageUrl: string) => {
          this.imagesCache[imagePath] = imageUrl;
          return imageUrl;
        })));
      }
    } else {
      return of(getDefaultAvatar());
    }
  }

  private updateEmail(email: string, password: string, newEmail: string) {
    return new Promise((resolve, reject) => {
      if (newEmail !== email) {
        this.firebaseUser.updateEmail(email, password, newEmail).then(() => {
          resolve();
        }).catch((error: Error) => {
          reject(error);
        });
      } else {
        resolve();
      }
    });
  }

  private updatePassword(email: string, password: string, newPassword: string) {
    return new Promise((resolve, reject) => {
      if (newPassword !== password) {
        this.firebaseUser.updatePassword(email, password, newPassword).then(() => {
          resolve();
        }).catch((error: Error) => {
          reject(error);
        });
      } else {
        resolve();
      }
    });
  }

  edit(id: string, data: User, oldData: { email: string, password: string, email1: string, email2: string,
    businessName: string,
    contact1:string,
    contact2:string,
    contact3:string,
    contact4:string,
    contact5:string,
    contact6:string,
    contact7:string,
    contact8:string,
    contact9:string,
    contact10: string,
    contact11: string,
    contact12: string,
    contact13: string,
    contact14: string,
    email3: string,
    email4: string,
    email5: string,
    email6: string,
    email7: string,
    email8: string,
    email9: string,
    email10: string,
    email11: string,
    email12: string,
    email13: string,
    email14: string
    // email9: string,
    // email10: string
  }) {
    const user: User = {
      firstName: data.firstName,
      lastName: data.lastName,
      contact1: data.contact1,
      contact2: data.contact2,
      contact3: data.contact3,
      contact4: data.contact4,
      contact5: data.contact5,
      contact6: data.contact6,
      contact7: data.contact7,
      contact8: data.contact8,
      contact9: data.contact9,
      contact10: data.contact10,
      contact11: data.contact11,
      contact12: data.contact12,
      contact13: data.contact13,
      contact14: data.contact14,

      


      email: data.email,
      email2: data.email2,
      email3: data.email3,
      email4: data.email4,
      email5: data.email5,
      email6: data.email6,
      email7: data.email7,
      email8: data.email8,
      email9: data.email9,
      email10: data.email10,
      email11: data.email11,
      email12: data.email12,
      email13: data.email13,
      email14: data.email14,


      // email9: data.email9,
      // email10: data.email10,
      email1: data.email1,
      password: data.password,
      birthDate: data.birthDate,
      businessName: data.businessName,

      role: data.role,
      bio: data.bio,
      updatedAt: now(),
      updatedBy: this.db.currentUser.id
    };
    if (/*data.avatar !== undefined && */data.avatar === null) {
      user.avatar = null;
    }
    return new Promise((resolve, reject) => {
      this.updateEmail(oldData.email, oldData.password, data.email).then(() => {
        this.updatePassword(data.email, oldData.password, data.password).then(() => {
          this.uploadImageAfter(this.db.setDocument('users', id, user), user, {...data, id: id}).then(() => {
            resolve();
          }).catch((error: Error) => {
            reject(error);
          });
        }).catch((error: Error) => {
          reject(error);
        });
      }).catch((error: Error) => {
        reject(error);
      });
    });
  }

  private deleteImage(imagePath: string) {
    return new Promise((resolve, reject) => {
      if (imagePath) {
        this.storage.delete(imagePath).toPromise().then(() => {
          resolve();
        }).catch((error: Error) => {
          reject(error);
        });
      } else {
        resolve();
      }
    });
  }

  delete(id: string, data: { email: string, password: string, avatar: string }) {
    return new Promise((resolve, reject) => {
      this.firebaseUser.delete(data.email, data.password).then(() => {
        this.db.deleteDocument('users', id).then(() => {
          this.deleteImage(data.avatar).then(() => {
            resolve();
          }).catch((error: Error) => {
            reject(error);
          });
        }).catch((error: Error) => {
          reject(error);
        });
      }).catch((error: Error) => {
        reject(error);
      });
    });
  }

  countAll() {
    return this.db.getDocumentsCount('users');
  }

  countWhereFn(queryFn: QueryFn) {
    return this.db.getDocumentsCount('users', queryFn);
  }

  countWhere(field: string, operator: firebase.firestore.WhereFilterOp, value: string) {
    return this.countWhereFn(ref => ref.where(field, operator, value));
  }

}
