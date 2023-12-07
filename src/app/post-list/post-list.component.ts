import { BackEndService } from './../back-end.service';
import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent {
  listChangeEvent = new EventEmitter<Post[]>();
  listOfPosts: Post[] = [];
  filteredPosts: Post[] = [];
  comments: { [postId: string]: string[] } = {}; // New comments object
  searchTerm: string = '';

  trackByPosts(index: number, post: Post): string {
    return post.id;
  }

  filterPosts(query: string): Post[] {
    return this.listOfPosts.filter(
      (post) => post.title.includes(query) || post.id.includes(query)
    );
  }

  constructor(
    private postService: PostService,
    private backEndService: BackEndService
  ) {}

  ngOnInit(): void {
    this.listOfPosts = this.postService.getPost();
    this.postService.listChangeEvent.subscribe((post: Post[]) => {
      this.listOfPosts = post;
      this.updateFilteredPosts();
    });
    this.updateFilteredPosts();
  }

  updateFilteredPosts(): void {
    this.filteredPosts = this.listOfPosts.filter((post) =>
      post.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  logSearchTerm() {
    console.log(this.searchTerm);
    this.updateFilteredPosts();
  }

  addCommentToPost(postId: string, comment: string): void {
    if (!this.comments[postId]) {
      this.comments[postId] = [];
    }
    this.comments[postId].push(comment);
  }
}

// ngOnInit(): void {
//   this.listOfPosts = this.postService.getPost();
//   this.postService.listChangeEvent.subscribe((post: Post[]) => {
//     this.listOfPosts = post;
//   });
// }
// get filteredPosts(): Post[] {
//   const filteredPosts = this.listOfPosts.filter((post) =>
//     post.title.toLowerCase().includes(this.searchTerm.toLowerCase())
//   );
//   console.log(filteredPosts);
//   return filteredPosts;
// }
