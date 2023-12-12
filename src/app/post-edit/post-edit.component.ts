import { BackEndService } from './../back-end.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { Post } from '../post.model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css'],
})
export class PostEditComponent implements OnInit {
  form!: FormGroup;
  index: number = 0;
  editMode = false;

  constructor(
    private postService: PostService,
    private router: Router,
    private actRoute: ActivatedRoute,
    private backEndService: BackEndService,
    private authService: AuthService
) {}

  ngOnInit(): void {

    let title = '';
    let description = '';
    let imgPath = '';

    this.actRoute.params.subscribe((params: Params) => {
      if (params['index']) {
        console.log(params['index']);
        this.index = params['index'];

    //     const post = this.postService.getSpecPost(this.index);

    //     title = post.title;
    //     description = post.description;
    //     imgPath = post.imgPatch;
    //     this.editMode = true;

    //   }
    // });

    const post = this.postService.getSpecPost(this.index);

    // Check if the current user is the author of the post
    this.authService.currentUser.pipe(take(1)).subscribe(user => {
      if (user?.email !== post.author ) {
        window.alert('You are not the author of this post.');
        this.router.navigate(['post-list']);
      } else {
        title = post.title;
        description = post.description;
        imgPath = post.imgPatch;
        this.editMode = true;
      }
    });
  }
});


    this.form = new FormGroup({
      title: new FormControl(title, [Validators.required]),
      imgPath: new FormControl(imgPath, [Validators.required]),
      description: new FormControl(description, [Validators.required]),
    });
  }
  onSubmit() {
    const title = this.form.value.title;
    const imgPath = this.form.value.imgPath;
    const description = this.form.value.description;
  
    this.authService.currentUser.pipe(take(1)).subscribe(user => {
      if (user?.email) {
        const post: Post = new Post(
          title,
          imgPath,
          description,
          user.email,
          '',
          new Date(),
          0,
          0,
          [],
          'some-id', // Add this line
        );
        
        if(this.editMode == true) {
          this.postService.updatePost(this.index, post);
          this.backEndService.saveData();
        } else {
          this.postService.addPost(post);
          this.backEndService.saveData(); 
        }
  
        this.router.navigate(['post-list']);
      } else {
        window.alert('You need to be logged in to create a post.');
      }
    });
  }
  // onSubmit() {
  //   const title = this.form.value.title;
  //   const imgPath = this.form.value.imgPath;
  //   const description = this.form.value.description;

  //   this.authService.currentUser.subscribe(user => {
  //     const post: Post = new Post(
  //       title,
  //       imgPath,
  //       description,
  //       user?.email || 'Anonymous',
  //       new Date(),
  //       0,
  //       0,
  //       0,
  //       0,
  //       0,
  //       [],
  //       'some-id', // Add this line
  //     );
      
  //     if(this.editMode == true) {
  //       this.postService.updatePost(this.index, post);
  //       this.backEndService.saveData();
  //     } else {
  //       this.postService.addPost(post);
  //       this.backEndService.saveData(); 
  //     }
  //   });
  
  //   this.router.navigate(['post-list']);
  // }

    // const post: Post = new Post(
    //   title,
    //   imgPath,
    //   description,
    //   'George',
    //   new Date(),
    //   0,
    //   0,
    //   0,
    //   0,
    //   0,
    //   [],
    //   'some-id', // Add this line

  //     if(this.editMode == true) {
  //       this.postService.updatePost(this.index, post);
  //       this.backEndService.saveData();
  //     } else {
  //       this.postService.addPost(post);
  //       this.backEndService.saveData(); 
  //     }
  //   this.router.navigate(['post-list']);
  // }

}
