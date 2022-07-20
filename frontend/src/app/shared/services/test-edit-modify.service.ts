import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { YamlNodeFieldInterface } from './yaml-node-field-interface';
import { getEnumValues, getNodeFieldsUrl, getTradeEventEnumValues } from '../../config/app.constants';

@Injectable({
  providedIn: 'root'
})
export class TestEditModifyService {

  constructor(private http: HttpClient) { }

  getApplicationJsonHeader() {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  getNodeFields(nodeType: string, modelClassName: string): Observable<YamlNodeFieldInterface[]> {
    return this.http.get<YamlNodeFieldInterface[]>(
      getNodeFieldsUrl(nodeType, modelClassName),
      { headers: this.getApplicationJsonHeader() }
    );
  }

  getEnumValues(enumName: string): Observable<string[]> {
    return this.http.get<string[]>(
      getEnumValues(enumName),
      { headers: this.getApplicationJsonHeader() }
    );
  }

  getTradeEventEnumValues(sourceSystemEnumName: string): Observable<string[]> {
    return this.http.get<string[]>(
      getTradeEventEnumValues(sourceSystemEnumName),
      { headers: this.getApplicationJsonHeader() }
    );
  }
}
