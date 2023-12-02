import { BackEndService } from './back-end.service';
import { EventEmitter, Injectable } from '@angular/core';
import { Post } from './post.model';
import { Observable, Subject, retry } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class PostService {
  listChangeEvent: EventEmitter<Post[]> = new EventEmitter;

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
  constructor (private http: HttpClient) { }

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
  // deleteButton(index: number) {
  //   this.listOfPosts.splice(index, 1);
  // }
  addPost(post: Post) {
    this.listOfPosts.push(post);
    this.saveData();
  }
  updatePost(index: number, post: Post) {
    this.listOfPosts[index] = post;
    this.saveData();
  }
  getSpecPost(index: number){
    return this.listOfPosts[index];
  }
  LikePost(index:number){
    this.listOfPosts[index].numberOfLikes ++;
    this.saveData();
  }
  HahaPost(index: number) {
    this.listOfPosts[index].numberOfHaha++;
    this.saveData();
  }
  HeartPost(index: number) {
    this.listOfPosts[index].numberOfHeart++;
    this.saveData();
  }
  SadPost(index: number) {
    this.listOfPosts[index].numberOfSad++;
    this.saveData();
  }
  AngryPost(index: number) {
    this.listOfPosts[index].numberOfAngry++;
  }

  addComment(index: number, comment: string) {
    this.listOfPosts[index].comments.push(comment);
    this.saveData();
  }
  setPost(NewListOfPost: Post[]) {
    this.listOfPosts = NewListOfPost;
    this.listChangeEvent.emit(NewListOfPost);
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
