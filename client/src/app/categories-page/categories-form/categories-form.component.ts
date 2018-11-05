import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from '../../shared/services/categories.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MaterialService } from '../../shared/services/material.service';
import { Category } from '../../shared/interfaces';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css']
})
export class CategoriesFormComponent implements OnInit {
  @ViewChild('input') inputRef: ElementRef;
  form: FormGroup;
  isNew = true;
  image: File;
  imagePreview = '';
  category: Category;

  constructor(private route: ActivatedRoute,
              private categoriesService: CategoriesService,
              private router: Router) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    });

    this.form.disable();

    this.route.params
      .pipe(
        switchMap((params: Params) => {
          if (params['id']) {
            this.isNew = false;
            return this.categoriesService.getById(params['id'])
          }
          return of(null)
        })
      )
      .subscribe((category: Category) => {
          if (category) {
            this.category = category;
            this.form.patchValue({
              name: category.name
            });
            this.imagePreview = category.imageSrc;
            MaterialService.updateTextInputs();
          }
          this.form.enable();
        },
        error => MaterialService.toast(error.error.message))
  }

  triggerClick() {
    this.inputRef.nativeElement.click();
  }

  onFileUpload(event) {
    const file = event.target.files[0];
    this.image = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  deleteCategory() {
    const decision = window.confirm(`Are you sure you want to delete the category "${this.category.name}"`);
    if (decision) {
      this.categoriesService.deleteCategory(this.category._id)
        .subscribe(
          response => MaterialService.toast(response.message),
          error => MaterialService.toast(error.error.message),
          () => this.router.navigate(['/categories'])
        )
    }
  }

  onSubmit() {
    let data;
    this.form.disable();
    if (this.isNew) {
      data = this.categoriesService.createCategory(this.form.value.name, this.image)
    } else {
      data = this.categoriesService.updateCategory(this.category._id, this.form.value.name, this.image)
    }

    data.subscribe(category => {
        this.category = category;
        MaterialService.toast('Change successfull');
        this.form.enable();
      }, error => {
        MaterialService.toast(error.error.message);
        this.form.enable();
      }
    )
  }

}
