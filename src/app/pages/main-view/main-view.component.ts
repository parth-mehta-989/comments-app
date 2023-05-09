import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit {

  constructor(private formBuilder: FormBuilder) { }
  commentForm!: FormGroup;

  ngOnInit(): void {
    this.commentForm = this.formBuilder.group({
      user: ['', Validators.required],
      comment: ['', Validators.required]
    });
  }
 
onSubmit() {
  if (this.commentForm.valid) {
    // Do something with the form data
    console.log(this.commentForm.value);
  }
}

}
