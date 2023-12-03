import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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

const routes: Routes = [
  // { path: '', redirectTo: 'authentication', pathMatch: 'full' },
  { path: 'post', component: PostComponent },
  { path: 'post-list', component: PostListComponent },
  { path: 'post-edit', component: PostEditComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'post-edit/:index', component: PostEditComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    PostEditComponent,
    AuthComponent,
    HeaderComponent,
    PostComponent,
    PostListComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
