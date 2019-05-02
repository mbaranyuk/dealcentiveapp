import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { ApiProvider } from '../api/api';

@Injectable()
export class SearchProvider {
  public searchParamsChangePromise;
  public featuredParamsChangePromise;
  public PARAMS_SEARCH:any = {};
  public PARAMS_FEATURED:any = {};
  public onNeedToRefresh = new EventEmitter<boolean>();
  public updateSearchQuery = new EventEmitter<string>();
  public updateFeaturedQuery = new EventEmitter<string>();
  public updateLocationTrigger = new EventEmitter<boolean>();
  public updateCoordsTrigger = new EventEmitter<any>();

  public reloadResultsPage = new EventEmitter<boolean>();

  public localeState;

  constructor(public http: HttpClient, api: ApiProvider,
    ) {
    this.updateLocationTrigger.subscribe( val => {
      this.localeState = val;
    } );
    this.searchParamsChangePromise = function(params, msg): Promise<any> { 
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          const element = params[key];
          this.PARAMS_SEARCH[key] = element;
        }
      }
      if(this.PARAMS_SEARCH.search_query){
        this.updateSearchQuery.emit(this.PARAMS_SEARCH.search_query);
      }
      return new Promise((resolve, reject)=>{
        resolve(api.invokeMethod("contentlist", this.PARAMS_SEARCH, msg));
        reject();
      })
    }

    this.featuredParamsChangePromise = function(params, msg): Promise<any> { 
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          const element = params[key];
          this.PARAMS_FEATURED[key] = element;
        }
      }
      return new Promise((resolve, reject)=>{
        resolve(api.invokeMethod("contentlist", this.PARAMS_FEATURED, msg));
      })
    }
  }

  deleteSearchParam(name) {
    if (this.PARAMS_SEARCH[name]) delete this.PARAMS_SEARCH[name];
  }
  deleteFeaturedParam(name) {
    if (this.PARAMS_FEATURED[name]) delete this.PARAMS_FEATURED[name];
  }

  clearSearchParams(){
    this.PARAMS_SEARCH = {};
  }
}
