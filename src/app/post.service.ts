import { BackEndService } from './back-end.service';
import { EventEmitter, Injectable } from '@angular/core';
import { Post } from './post.model';
import { Observable, Subject, retry } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PostService {
  listChangeEvent: EventEmitter<Post[]> = new EventEmitter();
  listOfPostsChanged = new Subject<Post[]>();
  private postsUpdated = new Subject<Post[]>();
  getNewId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
  postAdded = new Subject<Post>();
  
  

  listOfPosts: Post[] = [
    // new Post(
    //   'My Website 1.0',
    //   'https://t3.ftcdn.net/jpg/00/92/53/56/360_F_92535664_IvFsQeHjBzfE6sD4VHdO8u5OHUSc6yHF.jpg',
    //   'Similarly, if you run a business and want to provide resources and recommendations to customers, the best way to do it is often to add a blog to your website. Best of all, your blog content gets indexed by Google—unlike almost all social media posts—so you can drive potential customers to your business through content marketing (and without having to pay for ads). Look at the blog youre reading right now: Zapier blog posts get millions of views per month and are one of the most valuable ways of getting new customers at Zapier.',
    //   'George',
    //   new Date(),
    //   1,
    //   [],
    // )
  ];
  constructor(private http: HttpClient) {}

  saveData() {
    // Save the entire list of posts to Firebase.
    this.http
      .put(
        'https://practicedb-128d0-default-rtdb.asia-southeast1.firebasedatabase.app/post.json',
        this.listOfPosts
      )
      .subscribe(() => {
        console.log('Data saved to Firebase');
      });
  }

  getPost() {
    return this.listOfPosts;
  }
  getPostsUpdateListener() {
    return this.postsUpdated.asObservable();
  }
  // addPost(post: Post) {
  //   this.listOfPosts.push(post);
  //   this.listOfPostsChanged.next(this.listOfPosts); // Notify subscribers of the change
  //   this.postsUpdated.next([...this.listOfPosts]);
  //   this.saveData();
  // }
  
  addPost(post: Post) {
    this.listOfPosts.push(post);
    this.listOfPostsChanged.next(this.listOfPosts); // Notify subscribers of the change
    this.postsUpdated.next([...this.listOfPosts]);
    this.postAdded.next(post); // Emit the new post
    this.saveData();
  }
  updatePost(index: number, post: Post) {
    this.listOfPosts[index] = post;
    this.saveData();
  }
  getSpecPost(index: number) {
    return this.listOfPosts[index];
  }
  LikePost(index: number) {
    this.listOfPosts[index].numberOfLikes++;
    this.saveData();
  }
  
  UnLikePost(index: number) {
    this.listOfPosts[index].numberOfUnLike++;
    this.saveData();
  }


  // addComment(index: number, comment: { text: string; author: string | null }) {
  //   this.listOfPosts[index].comments.push(comment);
  //   this.saveData();
  // }
  addComment(index: number, comment: { text: string; author: string | null, dateCreated: Date }) {
    this.listOfPosts[index].comments.push(comment);
    this.saveData();
  }

  setPost(NewListOfPost: Post[]): void {
    const copyOfList = [...NewListOfPost];

    this.listOfPosts = copyOfList;
    this.listChangeEvent.emit(copyOfList);
    this.saveData();
  }

  deleteButton(index: number) {
    const postToDelete = this.listOfPosts[index];
    const postId = postToDelete.id;

    // Send an HTTP DELETE request to Firebase to delete the post.
    this.http
      .delete(
        `https://practicedb-128d0-default-rtdb.asia-southeast1.firebasedatabase.app/post/${postId}.json`
      )
      .subscribe(() => {
        this.listOfPosts.splice(index, 1);
        this.listChangeEvent.emit(this.listOfPosts);
        this.saveData(); // Save the updated data after deletion.
      });
  }
}
