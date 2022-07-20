import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { catchError, debounceTime, EMPTY, lastValueFrom, tap } from 'rxjs';
import { getValidator, IDENTIFIER, IDENTIFIER_TO_REUSE_ID_FROM, INSERTION_FILE_NAME, KafkaTradeMessageInput, KAFKA_TRADE_INPUT, LEAD_TIME_DELAY, MODEL_CLASS_NAME, SOURCE_SYSTEM, TRADE_EVENT_ENUM, TYPE } from '../config/app.constants';
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

  // Enum values
  enumValuesMap = new Map();
  nodeModelClassNameNodeFieldValueDataTypeMap = new Map();  // Map <K1, Map<K2, V2> where K1 = modelClassName, K2 = fieldName, V2 = DataType

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

    // Get all node fields
    let nodeFields$ = this.testEditModifyService.getNodeFields(nodeType, modelClassName)
      .pipe(
        tap(fields => {
          // Set the model class name and field data type in map
          if (!this.nodeModelClassNameNodeFieldValueDataTypeMap.has(modelClassName)) {
            let nodeFieldTypeMap = new Map();
            fields.forEach(field => nodeFieldTypeMap.set(field.fieldName, field.fieldType));
            this.nodeModelClassNameNodeFieldValueDataTypeMap.set(modelClassName, nodeFieldTypeMap);
          }
        }),
        catchError(err => {
          console.log(err);
          return EMPTY;
        })
      );

    let nodeGroup: FormGroup = this.fb.group({});
    nodeFields$.forEach(fields => {
      fields.forEach(async field => {
        // Create form field with default value
        let fieldFormControl = new FormControl();
        this.getInputNodeFieldDefaultValue(field).then(fieldValue => {
          if (field.fieldType === TRADE_EVENT_ENUM) {
            console.log("GOT TRADE EVENT VALUE: " + fieldValue);
          }
          fieldFormControl.setValue(fieldValue);
  
          // Add validators
          field.fieldValidators.split(',').forEach(
            validator => fieldFormControl.addValidators(getValidator(validator))
          );
  
          // Add form field
          nodeGroup.addControl(field.fieldName === INSERTION_FILE_NAME ? 'xmlData': field.fieldName,
            fieldFormControl);
        });
      });

      // Add hidden form control to indicate whether xml data was masked
      if (modelClassName === KafkaTradeMessageInput) {
        let fc = new FormControl(false);
        fc.setValidators(Validators.requiredTrue);
        nodeGroup.addControl('isXmlDataMasked', fc);
      }

      this.inputIdentifierIdx += 1;
      this.input.push(nodeGroup);
      console.log("PUSHED");
    });
  }


  async getInputNodeFieldDefaultValue(field: YamlNodeFieldInterface): Promise<any> {
    if (field.fieldName === TYPE) {
      return field.nodeType;
    } else if (field.fieldName === IDENTIFIER) {
      return this.inputIdentifierIdx;
    } else if (field.fieldName === IDENTIFIER_TO_REUSE_ID_FROM) {
      return this.input.value.length > 0 ? this.inputIdentifierIdx - 1 : 0;
    } else if (field.fieldName === SOURCE_SYSTEM) {
      return this.sourceSystem;
    } else if (field.fieldName === LEAD_TIME_DELAY) {
      return 0;
    } else if (field.fieldType.includes('Enum')) {
      if (this.enumValuesMap.has(field.fieldType) ) {
        return this.enumValuesMap.get(field.fieldType)[0];
      } else {
        if (field.fieldType === TRADE_EVENT_ENUM) {
          // Get trade events
          if (this.enumValuesMap.has(field.fieldType)) {
            return this.enumValuesMap.get(field.fieldName)[0];
          } else {
            let tradeEventEnumValues$ = this.testEditModifyService.getTradeEventEnumValues(this.sourceSystem).pipe(
              catchError(err => {
                console.error(err);
                return EMPTY;
              })
            );

            let tradeEvents: string[] = await lastValueFrom(tradeEventEnumValues$);
            this.enumValuesMap.set(TRADE_EVENT_ENUM, tradeEvents);
            console.log("expected trade event: " + tradeEvents[0]);
            return tradeEvents[0];
          }
        } else {
          // Get other enum values
          if (this.enumValuesMap.has(field.fieldType)) {
            return this.enumValuesMap.get(field.fieldName)[0];
          } else {
            let enumValues$ = this.testEditModifyService.getEnumValues(field.fieldType)
              .pipe(
                catchError(err => {
                  console.error(err);
                  return EMPTY;
                })
              );
            
            let enumValues: string[] = await lastValueFrom(enumValues$);
            this.enumValuesMap.set(field.fieldType, enumValues);
            return enumValues[0];
          }
        }
      }
    }
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

  isFieldTypeEnum(modelClassName: string, fieldName: string) {
    if (this.nodeModelClassNameNodeFieldValueDataTypeMap.get(modelClassName)?.get(fieldName)?.includes("Enum")) {
      return true;
    }
    return false;
  }
}
