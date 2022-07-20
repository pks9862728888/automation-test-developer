import { ValidatorFn, Validators } from "@angular/forms";
import { environment } from "src/environments/environment";
import { NumberValidators } from "../shared/custom-validators/number.validator";

// Test form bootstrap field names
export const TYPE = "type";
export const MODEL_CLASS_NAME = "modelClassName";
export const IDENTIFIER = 'identifier';
export const IDENTIFIER_TO_REUSE_ID_FROM = 'identifierToReuseIdFrom';
export const LEAD_TIME_DELAY = 'leadTimeDelay';
export const INSERTION_FILE_NAME = 'insertionFileName';
export const SOURCE_SYSTEM = 'sourceSystem';
export const KAFKA_TRADE_INPUT = 'KAFKA_TRADE_INPUT';
export const KafkaTradeMessageInput = 'KafkaTradeMessageInput';
export const TRADE_EVENT_ENUM = 'TradeEventEnum';

// Urls
export const BACKEND_BASE_URL = (environment.production)? '' : 'http://localhost:9001/';
export const BACKEND_V1_TEST_BASE_URL = `${BACKEND_BASE_URL}app/v1/test/`;

export function getNodeFieldsUrl(nodeType: string, modelClassName: string): string {
    return `${BACKEND_V1_TEST_BASE_URL}getNodeFields/${nodeType}/${modelClassName}`;
}

export function getEnumValues(enumName: string): string {
    return `${BACKEND_V1_TEST_BASE_URL}getEnumValues/${enumName}`;
}

export function getTradeEventEnumValues(sourceSystemEnumName: string): string {
    return `${BACKEND_V1_TEST_BASE_URL}getTradeEventEnumValues/${sourceSystemEnumName}`;
}

export function getValidator(name: string): ValidatorFn {
    if (name === 'REQUIRED') {
        return Validators.required;
    } else if (name === 'NUMBER') {
        return NumberValidators.number;
    } else {
        return Validators.min(0);
    }
}