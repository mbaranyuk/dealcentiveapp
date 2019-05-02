import { Injectable } from '@angular/core';
import { ApiProvider } from '../../providers/api/api';

interface IOptions {
  error_code?: string,
  data?: object,
  error_message?: string
}

@Injectable()
export class HelptextsProvider {
  private texts: object = {};

  constructor(private api: ApiProvider) {
  
  }

  init() {
    var promise = new Promise((resolve, reject) => {
      this.api.invokeMethod('helptexts').subscribe((res: IOptions) => {
        if (res && res.error_code) {
          console.log('>>>e', res.error_message);
          resolve();
        } else {
          this.texts = res.data;
          resolve();
        }
      });
    });
    return promise;
  }

  getText(field: string) {
    return this.texts[field];
  }

  getTexts() {
    return this.texts;
  }

}
