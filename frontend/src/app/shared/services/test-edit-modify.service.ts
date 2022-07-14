import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { YamlNodeFieldInterface } from './yaml-node-field-interface';
import { getNodeFieldsUrl } from '../../config/app.constants';

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

  getFieldNode(nodeType: string, modelClassName: string): Observable<YamlNodeFieldInterface[]> {
    return this.http.get<YamlNodeFieldInterface[]>(
      getNodeFieldsUrl(nodeType, modelClassName),
      { headers: this.getApplicationJsonHeader() }
    );
  }
}
