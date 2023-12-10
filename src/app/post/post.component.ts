// import { Component } from '@angular/core';
import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Router } from '@angular/router';
import { ThemeService } from '../theme.service';
import { AuthService } from '../auth.service';
import { User } from '../user.model';
import { Observable } from 'rxjs'; // import Observable


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  user: User | null = null;
  currentUser: Observable<User | null> = this.authService.currentUser; // explicitly type currentUser as Observable<User | null>
  isDarkMode: boolean = false;
  showButtons: boolean = false;

  constructor(
    private postService: PostService,
    private router: Router,
    private themeService: ThemeService,
    private authService: AuthService,

  ) {
    this.editingCommentIndex = null;
  }

  comment: string = '';
  @Input() index: number = 0;
  @Input() post?: Post;

  ngOnInit(): void {
    console.log(this.post);
    if (!this.post?.comments) {
      this.post!.comments = [];
    }
    this.themeService.isDarkMode.subscribe((darkMode) => {
      this.isDarkMode = darkMode;
    });
    this.authService.currentUser.subscribe((user) => {
      this.user = user;
      console.log('Current User:', user); // Check the logged-in user details
    });
  }
  delete() {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deleteButton(this.index);
    }
  }
  onEdit() {
    if (confirm('Do you really want to make changes inthis post?')) {
      this.router.navigate(['/post-edit', this.index]);
    }
  }

  // REACTIONS
  onClick() {
    this.postService.LikePost(this.index);
  }
  onHAHA() {
    this.postService.HahaPost(this.index);
  }
  onHeart() {
    this.postService.HeartPost(this.index);
  }
  onSad() {
    this.postService.SadPost(this.index);
  }
  onAngry() {
    this.postService.AngryPost(this.index);
  }

  // submitComment() {
  //   if (this.comment) {
  //     this.postService.addComment(this.index, this.comment);
  //     this.comment = '';
  //   }
  // }

  submitComment() {
    if (this.comment !== '') {
      if (this.editingCommentIndex !== null && this.post) {
        // If editing a comment, update the existing comment
        this.post.comments[this.editingCommentIndex] = this.comment;
      } else {
        // If not editing, add a new comment
        this.postService.addComment(this.index, this.comment);
      }
      this.comment = '';
      this.editingCommentIndex = null;
      if (this.post) {
        this.postService.updatePost(this.index, this.post);
        this.postService.saveData();
      }
    } else if (this.editingCommentIndex !== null) {
      // If comment is empty after editing, delete the comment
      this.deleteComment(this.editingCommentIndex);
    }
  }
  editingCommentIndex: number | null = null;
  setEditingComment(index: number): void {
    if (confirm('Do you want to continue editing this comment?')) {
      if (this.post) {
        this.editingCommentIndex = index;
        this.comment = this.post.comments[index];
      }
    }
  }
  updateComment(): void {
    if (this.editingCommentIndex !== null && this.post) {
      if (this.comment !== '') {
        this.post.comments[this.editingCommentIndex] = this.comment;
        this.comment = '';
        this.editingCommentIndex = null;
        this.postService.updatePost(this.index, this.post);
        this.postService.saveData();
      } else {
        // If comment is empty after editing, delete the comment
        this.deleteComment(this.editingCommentIndex);
      }
    }
  }
  deleteComment(index: number): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      if (this.post) {
        this.post.comments.splice(index, 1);
        this.postService.updatePost(this.index, this.post);
      }
    }
  }
}
