export class Post {
  constructor(
    public title: string,
    public imgPatch: string,
    public description: string,
    public author: string,
    public authorId: string,  // Add this line
    public dateCreated: Date,
    public numberOfLikes: number,
    public numberOfUnLike: number,
    // public comments: string[] = [],
    // public comments: { text: string; author: string | null }[] = [],
    public comments: { text: string; author: string | null, dateCreated: Date }[] = [],
    public id: string,
    public sharedBy?: string,
  ) {}
}
