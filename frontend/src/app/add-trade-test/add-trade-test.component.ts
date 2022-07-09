import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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

  steps: Array<string> = [];
  testName!: string;
  testNameWithEventName!: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.jurisdiction = this.activatedRoute.snapshot.paramMap.get("jurisdiction") || "";
    this.sourceSystem = this.activatedRoute.snapshot.paramMap.get("sourceSystem") || "";
    this.assetClass = this.activatedRoute.snapshot.paramMap.get("assetClass") || "";
    this.upi = this.activatedRoute.snapshot.paramMap.get("upi") || "";

    // Predicted Test Name
    this.testName = `${this.jurisdiction}_${this.sourceSystem}_${this.formatUpi(this.upi)}`;
    this.testNameWithEventName = this.testName;

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
    this.steps.push(`| ${this.testNameWithEventName} |`);
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
