import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { initTextEditor } from '../../../helpers/posts.helper';
import { I18nService } from '../../../services/i18n.service';
import { SettingsService } from '../../../services/settings.service';
import { slugify } from '../../../helpers/functions.helper';
import { Language } from '../../../models/language.model';
import { CategoriesService } from '../../../services/collections/categories.service';
import { LimitedpartnersService } from '../../../services/collections/limitedpartners.service';

import { Category } from '../../../models/collections/category.model';
import { Limitedpartner } from '../../../models/collections/limitedpartner.model';

import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { AlertService } from '../../../services/alert.service';
import { PostsService } from '../../../services/collections/posts.service';
import { NavigationService } from '../../../services/navigation.service';
import { PostStatus } from '../../../models/collections/post.model';
import { getEmptyImage } from '../../../helpers/assets.helper';
import { UsersService } from '../../../services/collections/users.service';
import { User } from '../../../models/collections/user.model';

@Component({
  selector: 'fa-posts-add',
  templateUrl: './posts-add.component.html',
  styleUrls: ['./posts-add.component.css']
})
export class PostsAddComponent implements OnInit, AfterViewInit, OnDestroy {
  title: string;
  editor: any;
  private status: PostStatus;
  language: string;
  languages: Language[];
  slug: string;
  date: string;
  private image: File;
  pdfSrc: string|ArrayBuffer;
  // pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  private checkedCategories: string[] = [];
  private checkedLimitedpartners: string[] = [];
  private checkedUsers: string[] = [];

  allUsers: Observable<User[]>;
  categoriesObservable: Observable<Category[]>;
  limitedpartnersObservable: Observable<Limitedpartner[]>;
  newLimitedpartner: string;
  newUser: string;
  usersObservable: Observable<User[]>;

  newCategory: string;
  isSubmitButtonsDisabled: boolean = false;
  private languageChange: Subject<void> = new Subject<void>();
  imageSrc: string;

  constructor(
    private i18n: I18nService,
    private settings: SettingsService,
    private categories: CategoriesService,
    private limitedpartners: LimitedpartnersService,
    private alert: AlertService,
    private posts: PostsService,
    private navigation: NavigationService,
    private users: UsersService

  ) { }

  ngOnInit() {
    this.status = PostStatus.Draft;
    this.languages = this.settings.getActiveSupportedLanguages();
    this.language = this.languages[0].key;
    this.date = new Date().toISOString().slice(0, 10);
    this.image = this.image;
    this.pdfSrc = getEmptyImage();
    // this.imageSrc = getEmptyImage();
    this.setCategoriesObservable();
    this.setUsersObservable();

    this.setLimitedpartnersObservable();
    this.allUsers = this.users.getAll();
    // this.pdfSrc = this.imageSrc;

  }

  ngAfterViewInit() {
    this.editor = initTextEditor('#editor-container', this.i18n.get('PostContent'));
  }

  ngOnDestroy() {
    this.languageChange.next();
  }

  private setCategoriesObservable() {
    this.categoriesObservable = this.categories.getWhere('lang', '==', this.language).pipe(
      map((categories: Category[]) => {
        return categories.sort((a: Category, b: Category) => b.createdAt - a.createdAt);
      }),
      takeUntil(this.languageChange)
    );
  }
  private setLimitedpartnersObservable() {
    this.limitedpartnersObservable = this.limitedpartners.getWhere('lang', '==', this.language).pipe(
      map((limitedpartners: Limitedpartner[]) => {
        return limitedpartners.sort((a: Limitedpartner, b: Limitedpartner) => b.createdAt - a.createdAt);
      }),
      takeUntil(this.languageChange)
    );
  }

  private setUsersObservable() {
    this.usersObservable = this.users.getWhere('lang', '==', this.language).pipe(
      map((users: User[]) => {
        return users.sort((a: User, b: User) => b.createdAt - a.createdAt);
      }),
      takeUntil(this.languageChange)
    );
  }

  onTitleInput() {
    this.slug = slugify(this.title).substr(0, 50);
  }

  onLanguageChange() {
    this.languageChange.next();
    this.checkedCategories = [];
    this.setCategoriesObservable();
  }

  addLimitedpartner(event: Event) {
    const target = event.target as any;
    target.disabled = true;
    this.limitedpartners.add({
      label: this.newLimitedpartner,
      slug: slugify(this.newLimitedpartner),
      lang: this.language
    }).catch((error: Error) => {
      this.alert.error(error.message);
    }).finally(() => {
      this.newLimitedpartner = '';
    });
  }


  onLimitedpartnerCheck(limitedpartner: Limitedpartner, event: Event|any) {
    if (event.target.checked) {
      this.checkedLimitedpartners.push(limitedpartner.label);
    } else {
      const index = this.checkedLimitedpartners.indexOf(limitedpartner.label);
      if (index !== -1) {
        this.checkedLimitedpartners.splice(index, 1);
      }
    }
  }

  addCategory(event: Event) {
    const target = event.target as any;
    target.disabled = true;
    this.categories.add({
      label: this.newCategory,
      slug: slugify(this.newCategory),
      lang: this.language
    }).catch((error: Error) => {
      this.alert.error(error.message);
    }).finally(() => {
      this.newCategory = '';
    });
  }

  onCategoryCheck(category: Category, event: Event|any) {
    if (event.target.checked) {
      this.checkedCategories.push(category.label);
    } else {
      const index = this.checkedCategories.indexOf(category.label);
      if (index !== -1) {
        this.checkedCategories.splice(index, 1);
      }
    }
  }
  onUserCheck(user: User, event: Event|any) {
    if (event.target.checked) {
      this.checkedUsers.push(user.email);
    } else {
      const index = this.checkedUsers.indexOf(user.email);
      if (index !== -1) {
        this.checkedUsers.splice(index, 1);
      }
    }
  }

  onImageChange(event: Event) {
    this.image = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.pdfSrc = reader.result;
    };
    reader.readAsDataURL(this.image);
  }

  addPost(event: Event, status?: PostStatus) {
    const target = event.target as any;
    const startLoading = () => {
      target.isLoading = true;
      this.isSubmitButtonsDisabled = true;
    };
    const stopLoading = () => {
      target.isLoading = false;
      this.isSubmitButtonsDisabled = false;
    };
    startLoading();
    // Check if post slug is duplicated
    // this.posts.isSlugDuplicated(this.slug, this.language).then((duplicated: boolean) => {
      // if (duplicated) {
        // Warn user about post slug
        // this.alert.warning(this.i18n.get('PostSlugAlreadyExists'), false, 5000);
        // stopLoading();
      // } else {
        // Add post
        if (status) {
          this.status = status;
        }
        this.posts.add({
          lang: this.language,
          limitedpartners: this.checkedLimitedpartners,
          title: null,
          slug: this.slug,
          date: new Date(this.date).getTime(),
          content: this.editor.root.innerHTML,
          image: this.image,
          status: this.status,
          categories: this.checkedCategories,
          users: this.checkedUsers
      
        }).then(() => {
          this.alert.success(this.i18n.get('PostAdded'), false, 5000, true);
          this.navigation.redirectTo('posts', 'list');
        }).catch((error: Error) => {
          this.alert.error(error.message);
        }).finally(() => {
          stopLoading();
        });
      }
    // }).catch((error: Error) => {
    //   this.alert.error(error.message);
    //   stopLoading();
    // });
  
  publishPost(event: Event) {
    this.addPost(event, PostStatus.Published);
  }

}
