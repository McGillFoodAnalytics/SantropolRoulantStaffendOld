import 'reflect-metadata';
import '../polyfills';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database'
import { AppConfig } from '../environments/environment';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// MATT IMPORTS
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatInputModule, MatButtonModule, MatOptionModule, MatFormFieldModule, MatSelectModule, MatIconModule, MatDatepickerModule, MatNativeDateModule, MatCardModule} from '@angular/material'
import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { NewUserComponent } from './new-user/new-user.component';
import { UserListComponent } from './user-list/user-list.component';
// import { MarkImportantEventComponent } from './mark-important-event/mark-important-event.component';


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, NewUserComponent, UserListComponent],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(AppConfig.firebase),
 	  AngularFirestoreModule,
    AngularFireDatabaseModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    NgbModule,
    MatCheckboxModule,
    MatInputModule,MatOptionModule, MatButtonModule, MatFormFieldModule, MatSelectModule, MatIconModule, MatDatepickerModule, MatNativeDateModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
