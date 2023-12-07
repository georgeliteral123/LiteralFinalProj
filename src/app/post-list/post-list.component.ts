import { BackEndService } from './../back-end.service';
import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent {
  listOfPosts: Post[] = [];
  searchTerm: string = '';

  constructor(
    private postService: PostService,
    private backEndService: BackEndService
  ) {}

  ngOnInit(): void {
    this.listOfPosts = this.postService.getPost();
    this.postService.listChangeEvent.subscribe((post: Post[]) => {
      this.listOfPosts = post;
    });
  }
  get filteredPosts(): Post[] {
    const filteredPosts = this.listOfPosts.filter((post) =>
      post.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    console.log(filteredPosts);
    return filteredPosts;
  }
  logSearchTerm() {
    console.log(this.searchTerm);
  }
}
