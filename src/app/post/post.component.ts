// import { Component } from '@angular/core';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Router } from '@angular/router';
import { ThemeService } from '../theme.service';
import { AuthService } from '../auth.service';
import { User } from '../user.model';
import { Observable, Subscription } from 'rxjs'; // import Observable


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit, OnDestroy {
  
  listOfPosts: Post[] = [];
  listOfPostsChangedSubscription: Subscription | undefined;
  user: User | null = null;
  currentUser: Observable<User | null> = this.authService.currentUser; // explicitly type currentUser as Observable<User | null>
  isDarkMode: boolean = false;
  showButtons: boolean = false;
  showReactions = false;
  

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

  // ngOnInit(): void {
  //   console.log(this.post);
  //   if (!this.post?.comments) {
  //     this.post!.comments = [];
  //   }
  //   this.themeService.isDarkMode.subscribe((darkMode) => {
  //     this.isDarkMode = darkMode;
  //   });
  //   this.authService.currentUser.subscribe((user) => {
  //     this.user = user;
  //     console.log('Current User:', user); // Check the logged-in user details
  //   });
  //   this.postService.listOfPostsChanged.subscribe((posts: Post[]) => {
  //     this.listOfPosts = posts;
  //   });
  //   this.postService.getPostsUpdateListener().subscribe((posts: Post[]) => {
  //     this.listOfPosts = posts;
  //   });
  // }
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
      if (user) {
        this.listOfPosts = this.listOfPosts.filter(post => post.author === user.email);
      }
    });
    this.postService.listOfPostsChanged.subscribe((posts: Post[]) => {
      this.listOfPosts = posts;
      if (this.user) {
        this.listOfPosts = this.listOfPosts.filter(post => post.author === this.user?.email);
      }
    });
    this.postService.getPostsUpdateListener().subscribe((posts: Post[]) => {
      this.listOfPosts = posts;
      if (this.user) {
        this.listOfPosts = this.listOfPosts.filter(post => post.author === this.user?.email);
      }
    });
    this.postService.postAdded.subscribe((newPost: Post) => {
      // Update the listOfPosts array when a new post is added
      this.listOfPosts.push(newPost);
    });
  }
  ngOnDestroy(): void {
    this.listOfPostsChangedSubscription?.unsubscribe();
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
  toggleReactions() {
    this.showReactions = !this.showReactions;
  }
  // onClick() {
  //   this.postService.LikePost(this.index);
  // }

  onClick() {
    this.postService.LikePost(this.index);
  }
  onUnLike(){
    this.postService.UnLikePost(this.index);
  }

  
  editingCommentIndex: number | null = null;
  submitComment() {
    if (this.comment !== '') {
      const newComment = { text: this.comment, author: this.user?.email || null, dateCreated: new Date() };
      if (this.editingCommentIndex !== null && this.post) {
        // If editing a comment, update the existing comment
        this.post.comments[this.editingCommentIndex] = newComment;
      } else {
        // If not editing, add a new comment
        this.postService.addComment(this.index, newComment);
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

  // sharePost(post: Post) {
  //   const newPost: Post = { ...post, id: this.postService.getNewId() };
  //   this.postService.addPost(newPost);
  //   this.listOfPosts.push(newPost); // Add the new post to the list of posts
  //   alert('You shared this post');
  // }

  sharePost(post: Post) {
    const newPost: Post = {
      id: this.postService.getNewId(),
      title: post.title,
      description: post.description,
      author: post.author,
      authorId: post.authorId, // add this line
      dateCreated: post.dateCreated,
      // Initialize other properties as needed
      imgPatch: post.imgPatch,
      numberOfLikes: 0,
      numberOfUnLike: 0,
      comments: [],
    };
    this.postService.addPost(newPost);
    this.listOfPosts.push(newPost); // Add the new post to the list of posts
    alert('You shared this post');
  }

  setEditingComment(index: number): void {
    if (confirm('Do you want to continue editing this comment?')) {
      if (this.post) {
        this.editingCommentIndex = index;
        this.comment = this.post.comments[index].text;
      }
    }
  }
  
  updateComment(): void {
    if (this.editingCommentIndex !== null && this.post) {
      if (this.comment !== '') {
        this.post.comments[this.editingCommentIndex].text = this.comment;
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
