import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingProvider } from '../../providers/loading/loading';

import 'rxjs/Rx';

interface IParameters {
  app_key: string,
  action: string,
  access_token?: string
}

@Injectable()
export class ApiProvider {
  constructor(public http: HttpClient, private loading: LoadingProvider) {
  }

  APP_KEY = {
    android:  "710c7bae7c52de96b69462f9295afcd6",
    ios:      "8f662f5a5c5fef95db05a1a76961a081",
    web:      '9183645923876504135761983476245'
  };

  parameters: IParameters = {
    app_key: this.APP_KEY.web,
    action: "getconfirmationcode" 
  };
  
  invokeMethod(method: string, customParams?: object, processMsg:any = false) {
    let params:any = this.parameters;
    params.action = method;

    if (localStorage.getItem('access_token')) {
      params.access_token = localStorage.getItem('access_token');
    }
    else params.access_token = undefined;

    if (customParams) {
      params = {...params, ...customParams};
    }
    if (method === 'getaccesstoken') {
      if (typeof(processMsg) === "string" && processMsg.length >= 0) this.loading.showLoading(processMsg);
      let request = this.http.get("https://api.dealcentive.com/index.php?m=api", { 
        observe: 'response',
        params: {request: JSON.stringify(params)}
      }).map((data:any) => {
        if (data.body && !data.body.error_message) {
          localStorage.setItem('access_token', data.body.data.access_token);
        }
        return data.body;
      });
      if (this.loading.loading) this.loading.hideLoading(this.loading.loading);
      return request;
    } 
    else {
      if (typeof(processMsg) === "string" && processMsg.length >= 0) this.loading.showLoading(processMsg);
      let request = this.http.get("https://api.dealcentive.com/index.php?m=api", { 
        observe: 'response',
        params: {request: JSON.stringify(params)}
      }).map(data => {
        return data.body;
      });
      if (this.loading.loading) this.loading.hideLoading(this.loading.loading);
      return request;
    }
  } 
}
