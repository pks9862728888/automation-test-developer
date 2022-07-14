import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, Subscription } from 'rxjs';
import { getValidator, KafkaTradeMessageInput, KAFKA_TRADE_INPUT } from '../config/app.constants';
import { NumberValidators } from '../shared/custom-validators/number.validator';
import { ConfirmDialog } from '../shared/dialogs/confirmation-dialog/confirm.dialog';
import { TestEditModifyService } from '../shared/services/test-edit-modify.service';
import { YamlNodeFieldInterface } from '../shared/services/yaml-node-field-interface';
import { SnackBarUtils } from '../shared/utils/snackbar.util';

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
  inputIdentifierIdx = 1;

  // Forms
  featureForm!: FormGroup;
  metaDataForm!: FormGroup;

  constructor(private activatedRoute: ActivatedRoute,
              private fb: FormBuilder,
              private dialog: MatDialog,
              private snackbar: MatSnackBar,
              private testEditModifyService: TestEditModifyService) { }

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

    // ----------------------------- FEATURE FORM -------------------------------
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

    // ----------------------------- META-DATA FORM -------------------------------
    this.metaDataForm = this.fb.group({
      input: this.fb.array([]),
      verification: this.fb.array([this.createNewVerificationNode()])
    });
  }

  get input(): FormArray {
    return <FormArray> this.metaDataForm.get('input');
  }

  addInputNode() {
    let nodeType = KAFKA_TRADE_INPUT;
    let modelClassName = KafkaTradeMessageInput;

    const sub = this.testEditModifyService.getFieldNode(nodeType, modelClassName).subscribe({
      next: (nodeFields: YamlNodeFieldInterface[]) => {
        console.log(nodeFields);
        // let obj: FormGroup = this.fb.group({
        //   type: [{value: 'KAFKA_TRADE_MESSAGE', disabled: true}, [Validators.required]],
        //   identifier: [`${this.inputIdentifierIdx}`, [Validators.required, Validators.min(0), NumberValidators.number]],
        //   identifierToReuseIdFrom: [`${this.inputIdentifierIdx > 1 ? this.inputIdentifierIdx - 1 : ''}`],
        //   tradeId: ['', Validators.required],
        //   sourceSystem: [{value: `${this.sourceSystem}`, disabled: true}, Validators.required],
        //   channel: [{value: 'MANUAL', disabled: true}, Validators.required],
        //   event: ['NEW_TRADE', Validators.required],
        //   leadTimeDelay: [0, [Validators.required, NumberValidators.number, Validators.min(0)]],
        //   xmlData: ['', [Validators.required]],
        //   isXmlDataMasked: [false, [Validators.requiredTrue]]
        // });
        let nodeGroup: FormGroup = this.fb.group({});
        for (let field of nodeFields) {
          let fieldFormControl = new FormControl();

          // Add validators
          field.fieldValidators.split(',').forEach(
            validator => fieldFormControl.addValidators(getValidator(validator))
          );

          // Add form field
          nodeGroup.addControl(field.fieldName, fieldFormControl);
        }

        this.inputIdentifierIdx += 1;
        this.input.push(nodeGroup);
        this.unsubscribe(sub);
      },
      error: err => {
        console.error(err);
        this.unsubscribe(sub);
      }
    });
  }

  createNewVerificationNode(): FormGroup {
    return this.fb.group({});
  }

  getFormControlKeys(node: any): Array<string> {
    let keys: Array<string> = [];

    Object.keys(node.controls).forEach((key: string) => {
      if (isNaN(Number(key))) {
        keys.push(key);
      }
    });

    return keys;
  }

  deleteInputNode(node: AbstractControl<any, any> | null, id: number): void {
    this.dialog.open(ConfirmDialog, {
      data: {
        title: `Delete input node: ${id} having identifier: ${node?.get('identifier')?.value}?`,
        description: `Please confirm`,
        yesButtonName: `Delete`,
        noButtonName: `Cancel`
      },
    }).afterClosed().subscribe(data => {
      if (data) {
        this.input.removeAt(id);
        SnackBarUtils.openSnackBar(`Deleted Input node: ${id} having identifier: ${node?.get('identifier')?.value}!`, 2000, this.snackbar);
      }
    });
  }

  updateTagsList() : void {
    let tags: Array<string> = [];
    this.featureForm.get('tags')?.value.split(",").forEach((tag: string) => tags.push(`@${tag.trim()}`));
    this.tagsList = tags;
  }

  trimXmlData(control: AbstractControl<any, any> | null) : void {
    if (control) {
      control.patchValue(control.value ? control.value.trim() : "");
    }
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

  unsubscribe(sub: Subscription) {
    if (sub) {
      sub.unsubscribe();
    }
  }
}
