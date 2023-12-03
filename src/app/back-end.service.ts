import { Injectable } from '@angular/core';
import { PostService } from './post.service';
import { Post } from './post.model';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BackEndService {
  constructor(private postService: PostService, private http: HttpClient) {
    this.fetchData();
  }

  saveData() {
    const NewListOfPost: Post[] = this.postService.getPost();
    this.http
      .put(
        'https://practicedb-128d0-default-rtdb.asia-southeast1.firebasedatabase.app/post.json',
        NewListOfPost
      )
      .subscribe((res) => {
        console.log(res);
      });
  }

  fetchData() {
    this.http
      .get<Post[]>(
        'https://practicedb-128d0-default-rtdb.asia-southeast1.firebasedatabase.app/post.json'
      )
      .pipe(
        tap((NewListOfPost: Post[]) => {
          console.log(NewListOfPost);
          this.postService.setPost(NewListOfPost);
        })
      )
      .subscribe();
  }
}

// fetchData(){
//   this.http.get<Post[]>('https://practicedb-128d0-default-rtdb.asia-southeast1.firebasedatabase.app/post.json')
//   .pipe(tap((NewListOfPost: Post[])=>{
//     console.log(NewListOfPost)
//     this.postService.setPost(NewListOfPost);
//        }));
//   }
// }

//   fetchData() {
//     return this.http.get<Post[]>('https://practicedb-128d0-default-rtdb.asia-southeast1.firebasedatabase.app/post.json')
//       .pipe(
//         catchError(error => {
//           console.error('Error while fetching data:', error);
//           return throwError(error);
//         }),
//         tap((NewListOfPost: Post[]) => {
//           console.log(NewListOfPost);
//           this.postService.setPost(NewListOfPost);
//         })
//       );
//   }
// }
