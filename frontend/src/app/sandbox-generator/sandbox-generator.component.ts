import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sandbox-generator',
  templateUrl: './sandbox-generator.component.html',
  styleUrls: ['./sandbox-generator.component.css']
})
export class SandboxGeneratorComponent implements OnInit {

  branchForm!: FormGroup;
  generatingSandbox: boolean = false;
  errorMessage!: string;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.branchForm = this.fb.group({
      branch_name: ['', [Validators.required]]
    });
  }

  refactorBranchName() {
    this.branchForm.patchValue({
      branch_name: this.branchForm.get('branch_name')?.value.toLocaleLowerCase()
                                                            .replaceAll(' ', '-')
    });
  }

  generateSandbox() {
    this.generatingSandbox = true;
    console.log("Generate sandbox called");
  }

}
