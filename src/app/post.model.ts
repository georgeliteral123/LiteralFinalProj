export class Post {
  constructor(
    public title: string,
    public imgPatch: string,
    public description: string,
    public author: string,
    public dateCreated: Date,
    public numberOfLikes: number,
    public comments: string[] = [],
    public id: string,
  ) {}
}
