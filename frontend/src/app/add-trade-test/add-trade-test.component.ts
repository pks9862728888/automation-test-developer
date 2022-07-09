import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-add-trade-test',
  templateUrl: './add-trade-test.component.html',
  styleUrls: ['./add-trade-test.component.css']
})
export class AddTradeTestComponent implements OnInit {

  // Route params
  jurisdiction!: string;
  sourceSystem!: string;
  assetClass!: string;
  upi!: string;

  // Feature file data
  tagsList: Array<string> = [];
  steps: Array<string> = [];
  testName!: string;

  // Forms
  featureForm!: FormGroup;

  constructor(private activatedRoute: ActivatedRoute,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.jurisdiction = this.activatedRoute.snapshot.paramMap.get("jurisdiction") || "";
    this.sourceSystem = this.activatedRoute.snapshot.paramMap.get("sourceSystem") || "";
    this.assetClass = this.activatedRoute.snapshot.paramMap.get("assetClass") || "";
    this.upi = this.activatedRoute.snapshot.paramMap.get("upi") || "";

    // Predicted Test Name
    this.testName = `${this.jurisdiction}_${this.sourceSystem}_${this.formatUpi(this.upi)}`.toUpperCase();

    // Steps
    this.steps.push(`Feature: e2e test`);
    this.steps.push(`Background: Test resources folders are initialized.`);
    this.steps.push(`Given Test meta-data is loaded from meta-data folder=/${this.jurisdiction}/${this.sourceSystem}/${this.assetClass}/${this.formatUpi(this.upi)}/ and resourcesFolder=/${this.sourceSystem}/${this.assetClass}/${this.formatUpi(this.upi)}/ where baseFolder=src/test/resources`);
    this.steps.push(`Scenario Context: <Test Name>`);
    this.steps.push(`Given Input is parsed from meta-data file`);
    this.steps.push(`And Trade is supposed to be published to DEST1`);
    this.steps.push(`When Trade inputs are processed/published`);
    this.steps.push(`Then Trade should be reportable to jurisdiction ${this.jurisdiction}`);
    this.steps.push(`| Test Name |`);
    this.steps.push(`${this.addTestName(this.testName)}`);

    // Feature form
    this.featureForm = this.fb.group({
        event: ['', Validators.required],
        testName: [this.testName, Validators.required],
        tags: [this.getDefaultTags(), Validators.required]
    });

    this.featureForm.get("event")?.valueChanges.subscribe(newValue => {
      // Update test name in form when event name changes
      this.featureForm.get("testName")?.patchValue(`${this.testName}_${newValue}`.toUpperCase());
    });

    this.featureForm.get("testName")?.valueChanges.subscribe(newValue => {
      newValue = newValue.toUpperCase();

      // Update test name in feature file step definition
      this.steps = this.steps.filter(t => !t.includes(this.testName));
      this.steps.push(this.addTestName(newValue));

      // Patch form value
      this.featureForm.get("testName")?.patchValue(newValue);
    });

    this.featureForm.get("tags")?.valueChanges.pipe(
        debounceTime(1000)
    ).subscribe(() => this.updateTagsList());

    // Tags
    this.updateTagsList();
  }

  updateTagsList() {
    let tags: Array<string> = [];
    this.featureForm.get('tags')?.value.split(",").forEach((tag: string) => tags.push(`@${tag.trim()}`));
    this.tagsList = tags;
  }

  getDefaultTags(): string {
    return `E2E,${this.jurisdiction},${this.sourceSystem},${this.assetClass},${this.formatUpi(this.upi)}`;
  }

  addTestName(testName: string): string {
    return `| ${testName} |`;
  }

  formatUpi(upi: string): string {
    if (upi) {
      while (upi.includes(':')) {
        upi = upi.replace(':', '_');
      }
    }
    return upi;
  }

}
