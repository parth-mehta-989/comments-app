import { Injectable } from '@angular/core';
import { WebrequestService } from './web-request.service';
import { Comment } from './models/comment.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private httpService:WebrequestService) { }
  
  getAllParentComments(): Observable<Comment[]> {
    return this.httpService.get<Comment[]>('comments');
  }

  createComment(data:string, username:string,parent_id:number|null): Observable<Comment> {
    return this.httpService.post<Comment>('comments', {data, username, parent_id});
  }

  deleteComment(commentId: number) {
    return this.httpService.delete(`comments/${commentId}`)
  }

  updateComment(editedComment: Comment) {
    return this.httpService.patch(`comments/${editedComment.id}`, editedComment)
  }
}
