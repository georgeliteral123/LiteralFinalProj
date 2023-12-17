import { Component, OnInit } from '@angular/core';
import { User } from '../user.model';
import { EMPTY, Observable, of } from 'rxjs';
import { AuthService } from '../auth.service';
import { PostService } from '../post.service';
import { Post } from '../post.model';
import { Router } from '@angular/router';
import { ThemeService } from '../theme.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { finalize, switchMap, map } from 'rxjs/operators';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  selectedFile: File | null = null;
  profileImageUrl: string = '';
  profileImageUrl$: Observable<string | undefined> = EMPTY; // Declare profileImageUrl$ here

  user: User | null = null;
  currentUser: Observable<User | null> = this.authService.currentUser; 
  userPosts: Post[] = [];
  isDarkMode: boolean = false;
  showButtons: boolean = false;
  showReactions: boolean = false;
  comment: string = '';
  index: number = 0;
  post?: Post;
  editingCommentIndex: number | null = null;

  constructor(private authService: AuthService, private postService: PostService, private router: Router, private themeService: ThemeService,private storage: AngularFireStorage, private firestore: AngularFirestore) { }

  // ngOnInit() {
  //   this.authService.currentUser.subscribe((user) => {
  //     this.user = user;
  //     if (user) {
  //       this.userPosts = this.postService.getPost().filter(post => post && post.author && post.author === user.email);
  //     }
  //   });
  //   this.postService.listOfPostsChanged.subscribe((posts: Post[]) => {
  //     if (this.user) {
  //       this.userPosts = posts.filter(post => post && post.author && post.author === this.user?.email);
  //     }
  //   });
  //   this.themeService.isDarkMode.subscribe((darkMode) => {
  //     this.isDarkMode = darkMode;
  //   });
  //   this.authService.currentUser.subscribe((user: User | null) => { // Add User | null type to user
  //     if (user) {
  //       this.user = user;
  //       this.userPosts = this.postService.getPost().filter(post => post && post.author && post.author === user.email);
    
  //       // Create a new profileImageUrl$ observable for this user
  //       user.profileImageUrl$ = this.firestore.collection('users').doc(user.uid).valueChanges().pipe(
  //         map((user: any) => user.profileImageUrl)
  //       );
  //     }
  //   });
  //   this.postService.listOfPostsChanged.subscribe((posts: Post[]) => {
  //     if (this.user) {
  //       this.userPosts = posts.filter(post => post && post.author && post.author === this.user?.email);
  //     }
  //   });
  //   this.themeService.isDarkMode.subscribe((darkMode) => {
  //     this.isDarkMode = darkMode;
  //   });
  // }
  ngOnInit() {
    this.authService.currentUser.subscribe((user) => {
      this.user = user;
      if (user) {
        this.userPosts = this.postService.getPost().filter(post => post && (post.author === user.email || post.sharedBy === user.email));
      }
    });
    this.postService.listOfPostsChanged.subscribe((posts: Post[]) => {
      if (this.user) {
        this.userPosts = posts.filter(post => post && (post.author === this.user?.email || post.sharedBy === this.user?.email));
      }
    });
    this.themeService.isDarkMode.subscribe((darkMode) => {
      this.isDarkMode = darkMode;
    });
    this.authService.currentUser.subscribe((user: User | null) => { // Add User | null type to user
      if (user) {
        this.user = user;
        this.userPosts = this.postService.getPost().filter(post => post && (post.author === user.email || post.sharedBy === user.email));
    
        // Create a new profileImageUrl$ observable for this user
        user.profileImageUrl$ = this.firestore.collection('users').doc(user.uid).valueChanges().pipe(
          map((user: any) => user.profileImageUrl)
        );
      }
    });
    this.postService.listOfPostsChanged.subscribe((posts: Post[]) => {
      if (this.user) {
        this.userPosts = posts.filter(post => post && (post.author === this.user?.email || post.sharedBy === this.user?.email));
      }
    });
    this.themeService.isDarkMode.subscribe((darkMode) => {
      this.isDarkMode = darkMode;
    });
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    this.selectedFile = (target.files as FileList)[0];
  }

  onUpload() {
    let userId: string;
    this.authService.currentUser.subscribe((user: User | null) => { 
      if (user) {
        userId = user.uid;
        if (this.selectedFile) {
          const filePath = `profileImages/${userId}/${this.selectedFile.name}`;
          const fileRef = this.storage.ref(filePath);
          const task = this.storage.upload(filePath, this.selectedFile);
  
          // observe percentage changes
          task.percentageChanges().subscribe((percentage) => {
            console.log(percentage);
          });
  
          // get notified when the download URL is available
          task.snapshotChanges().pipe(
            finalize(() => {
              fileRef.getDownloadURL().subscribe((url) => {
                console.log(url);
                this.profileImageUrl = url;
  
                // Update profile picture in Firestore
                this.firestore.collection('users').doc(userId).set({
                  profileImageUrl: url
                }, { merge: true });
  
                // Update profile picture in application state
                
                if (this.user) {
                  this.user.profileImageUrl = url;
                }
              });
            })
          ).subscribe();
        }
      }
    });
  }

  toggleReactions() {
    this.showReactions = !this.showReactions;
  }

  delete(postId: string) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(postId, this.user?.email || '');
    }
  }
  onEdit() {
    if (confirm('Do you really want to make changes inthis post?')) {
      this.router.navigate(['/post-edit', this.index]);
    }
  }

  onClick() {
    this.postService.LikePost(this.index);
  }

  onUnLike(){
    this.postService.UnLikePost(this.index);
  }

  submitComment(index: number) {
    if (this.comment !== '') {
      const newComment = { text: this.comment, author: this.user?.email || null, dateCreated: new Date() };
      if (this.editingCommentIndex !== null && this.userPosts[index]) {
        // If editing a comment, update the existing comment
        this.userPosts[index].comments[this.editingCommentIndex] = newComment;
      } else {
        // If not editing, add a new comment
        this.postService.addComment(index, newComment);
      }
      this.comment = '';
      this.editingCommentIndex = null;
      if (this.userPosts[index]) {
        this.postService.updatePost(index, this.userPosts[index]);
        this.postService.saveData();
      }
    } else if (this.editingCommentIndex !== null) {
      // If comment is empty after editing, delete the comment
      this.deleteComment(this.editingCommentIndex);
    }
  }
  sharePost(post: Post) {
    const newPost: Post = { ...post, id: this.postService.getNewId(),
      title: post.title,
      description: post.description,
      author: post.author,
      authorId: post.authorId, // add this line
      dateCreated: post.dateCreated,
      // Initialize other properties as needed
      imgPatch: post.imgPatch,
      numberOfLikes: 0,
      numberOfUnLike: 0,
      comments: [],};
    this.postService.addPost(newPost);
    alert('You shared this post');
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

  setEditingComment(index: number): void {
    if (confirm('Do you want to continue editing this comment?')) {
      if (this.post) {
        this.editingCommentIndex = index;
        this.comment = this.post.comments[index].text;
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