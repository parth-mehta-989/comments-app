import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentService } from 'src/app/comment.service';
import { Comment  } from 'src/app/models/comment.model';
@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private commentService:CommentService
  ) { }
  commentForm!: FormGroup;
  comments!: Comment[];
  editedComment!: Comment;
  commentBeingRepliedTo!: Comment;
  repliesShownForCommentId: number | undefined;
  ngOnInit(): void {
    this.commentForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      comment: ['', [Validators.required]]
    });

    this.getAllComments()
  }

  toggleReplies(id: number) {
    if (this.repliesShownForCommentId === id) {
      this.repliesShownForCommentId = undefined;
      return 
    }
    this.repliesShownForCommentId = id;
  }
  
  editComment(comment: Comment) {
    this.editedComment = comment;
    this.commentBeingRepliedTo = null as unknown as Comment;
    
    this.commentForm.get('username')?.clearValidators()
    this.commentForm.get('username')?.updateValueAndValidity()
    this.commentForm.get('comment')?.patchValue(this.editedComment.data)
  }
  replyToComment(comment: Comment) {
    this.commentBeingRepliedTo = comment;
    this.editedComment = null as unknown as Comment;

  }
  deleteComment(commentToBeDeleted: Comment) {
    if (confirm(`Are sure you want to delete:\nComment: ${commentToBeDeleted.data.substring(0, 40)}... \nby user: ${commentToBeDeleted.username}`)) {
      this.commentService.deleteComment(commentToBeDeleted.id).subscribe({
        next: (_) => {
          this.getAllComments();
          this.commentForm.reset();
        },
        error: (error) => {
          alert("something went wrong")
          console.log(error)
        }
      })
    }
  }

  onSubmit() {
    this.commentForm.disable()
    let data= this.commentForm.value?.comment
    let username = this.commentForm.value?.username
    
    let shouldCreateParentComment = !(this.editedComment || this.commentBeingRepliedTo)

    if (shouldCreateParentComment) {
      this.createComment(data, username, null)
    } else if (this.commentBeingRepliedTo) {
      let parentId = this.commentBeingRepliedTo.parent_id ? this.commentBeingRepliedTo.parent_id : this.commentBeingRepliedTo.id;
      this.createComment(data, username, parentId)
    } else {
      let editedComment: Comment = { ...this.editedComment }
      editedComment.data = data
      this.saveEditedComment(editedComment)
    }
    
  }

  clearEditionOrReply() {
    this.editedComment = null as unknown as Comment;
    this.commentBeingRepliedTo = null as unknown as Comment;
    this.commentForm.reset()
    this.commentForm.get('username')?.addValidators([Validators.required, Validators.minLength(2), Validators.maxLength(30)])
    this.commentForm.get('username')?.updateValueAndValidity()
    this.commentForm.enable()
    
  }

  createComment(data: string, username: string, parent_id: number | null) {
    data = data.trim()
    this.commentService.createComment(data, username, parent_id).subscribe({
      next: (comment) => {
        if (parent_id) {
          this.commentBeingRepliedTo = null as unknown as Comment;
          this.getAllComments()
        this.commentForm.enable()
        } else {
          this.comments.splice(0, 0, comment)
        }
        this.commentForm.reset();
        this.commentForm.enable()
      },
      error: (error) => {
        alert("something went wrong")
        console.log(error)
        this.commentForm.enable()

      }
    })
  }
  
  saveEditedComment(editedComment: Comment) {
    editedComment.data = editedComment.data.trim()
    if (editedComment.data != this.editedComment.data){
      this.commentService.updateComment(editedComment).subscribe({
        next: (response) => {
          this.getAllComments()
          this.editedComment = null as unknown as Comment;
          this.commentForm.reset();
          this.commentForm.get('username')?.addValidators([Validators.required, Validators.minLength(2), Validators.maxLength(30)])
          this.commentForm.get('username')?.updateValueAndValidity()
          this.commentForm.enable()

        },
        error: (error) => {
          alert("something went wrong")
          console.log(error)
          this.commentForm.enable()
        }
      })
      return
    } 
    alert("previous comment and edited comment can't be same...")
    this.commentForm.enable()
  }

  getAllComments() {
    this.commentService.getAllParentComments().subscribe({
      next: (comments) => {
        this.comments = comments
      },
      error: (error) => {
        alert("something went wrong")
        console.log(error)
      }
    })
  }

}
