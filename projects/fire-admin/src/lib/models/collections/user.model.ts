import { Observable } from 'rxjs';

export enum UserRole {
  Administrator = 'admin',
  Editor = 'editor',
  // Author = 'author',
  LPFund1 = 'LPFund1',
  LPFund1A = 'LPFund1A',
  // Contributor = 'contributor',
  Guest = 'guest'
}

export interface User {
  id?: string; // document id == firebase user id
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
  contact1:string,
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

  businessName:string;
  password: string;
  birthDate: number; // timestamp
  role: UserRole;
  bio: string;
  avatar?: File|string|Observable<string>|{ path: string|any, url: string|Observable<string> };
  createdAt?: number;
  updatedAt?: number;
  createdBy?: string; // creator id
  creator?: string|Observable<string>; // used to fetch creator name without overriding createdBy field
  updatedBy?: string;
}
