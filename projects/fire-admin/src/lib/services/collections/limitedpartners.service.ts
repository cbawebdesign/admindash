import { Injectable } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Limitedpartner } from '../../models/collections/limitedpartner.model';
import { now } from '../../helpers/functions.helper';
import { map } from 'rxjs/operators';

@Injectable()
export class LimitedpartnersService {

  constructor(private db: DatabaseService) { }

  add(data: Limitedpartner) {
    const limitedpartner: Limitedpartner = {
      label: data.label,
      slug: data.slug,
      lang: data.lang,
      createdAt: now(), // timestamp
      updatedAt: null,
      createdBy: this.db.currentUser.id,
      updatedBy: null
    };
    return this.db.addDocument('limitedpartners/', limitedpartner);
  }

  get(id: string) {
    return this.db.getDocument('limitedpartners', id).pipe(map((limitedpartner: Limitedpartner) => {
      limitedpartner.id = id;
      return limitedpartner;
    }));
  }

  getAll() {
    return this.db.getCollection('limitedpartners');
  }

  getWhere(field: string, operator: firebase.firestore.WhereFilterOp, value: string) {
    return this.db.getCollection('limitedpartners', ref => ref.where(field, operator, value));
  }

  edit(id: string, data: Limitedpartner) {
    const limitedpartner: Limitedpartner = {
      label: data.label,
      slug: data.slug,
      lang: data.lang,
      updatedAt: now(),
      updatedBy: this.db.currentUser.id
    };
    return this.db.setDocument('limitedpartners', id, limitedpartner);
  }

  delete(id: string) {
    return this.db.deleteDocument('limitedpartners', id);
  }

}
