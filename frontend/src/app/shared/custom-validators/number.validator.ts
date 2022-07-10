import { AbstractControl } from "@angular/forms";

export class NumberValidators {

    static number(c: AbstractControl): { [key: string]: boolean } | null {
        if (c.value !== null && isNaN(c.value)) {
            return { 'number': true};
        }
        return null;
    }
}