// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';

// import { AppComponent } from './app.component';
// import { PostEditComponent } from './post-edit/post-edit.component';
// import { AuthComponent } from './auth/auth.component';
// import { HeaderComponent } from './header/header.component';
// import { PostComponent } from './post/post.component';
// import { PostListComponent } from './post-list/post-list.component';
// import { Routes } from '@angular/router';
// import { RouterModule } from '@angular/router';
// import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { HttpClientModule } from '@angular/common/http';

// const routes: Routes = [
//   // { path: '', redirectTo: 'authentication', pathMatch: 'full' },
//   { path: 'post', component: PostComponent },
//   { path: 'post-list', component: PostListComponent },
//   { path: 'post-edit', component: PostEditComponent },
//   { path: 'auth', component: AuthComponent },
//   { path: 'post-edit/:index', component: PostEditComponent },
// ];

// @NgModule({
//   declarations: [
//     AppComponent,
//     PostEditComponent,
//     AuthComponent,
//     HeaderComponent,
//     PostComponent,
//     PostListComponent,
//   ],
//   imports: [
//     BrowserModule,
//     RouterModule.forRoot(routes),
//     RouterModule,
//     ReactiveFormsModule,
//     FormsModule,
//     HttpClientModule,
//   ],
//   providers: [],
//   bootstrap: [AppComponent],
// })
// export class AppModule {}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { AppComponent } from './app.component';
import { PostEditComponent } from './post-edit/post-edit.component';
import { AuthComponent } from './auth/auth.component';
import { HeaderComponent } from './header/header.component';
import { PostComponent } from './post/post.component';
import { PostListComponent } from './post-list/post-list.component';
import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environment/environment';
import { AuthGuardService } from './auth-guard.service';
import { ProfileComponent } from './profile/profile.component';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';


const routes: Routes = [
  // { path: '', redirectTo: 'authentication', pathMatch: 'full' },
  { path: '', component: LoginComponent },
  { path: 'post', component: PostComponent },
  {
    path: 'post-list', component: PostListComponent, canActivate: [AuthGuardService] },
  { path: 'post-edit', component: PostEditComponent, canActivate: [AuthGuardService] },
  { path: 'auth', component: AuthComponent, canActivate: [AuthGuardService], },
  { path: 'post-edit/:index', component: PostEditComponent, canActivate: [AuthGuardService], },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService] },
];

const firebaseConfig = {
  apiKey: 'AIzaSyDTujx2DU4Y2lQACU4zbhEbOk2M6mhOazQ',
  authDomain: 'practicedb-128d0.firebaseapp.com',
  databaseURL:
    'https://practicedb-128d0-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'practicedb-128d0',
  storageBucket: 'practicedb-128d0.appspot.com',
  messagingSenderId: '479745271063',
  appId: '1:479745271063:web:363027637d9cbd899a8352',
};

@NgModule({
  declarations: [
    AppComponent,
    PostEditComponent,
    AuthComponent,
    HeaderComponent,
    PostComponent,
    PostListComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment),
    provideFirebaseApp(() => initializeApp(environment)),
    provideAuth(() => getAuth()),
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment),
    AngularFireStorageModule,
    AngularFirestoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
