import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ApiProvider } from "../../providers/api/api";
import { SearchProvider } from '../../providers/search/search';
import { HelptextsProvider } from '../../providers/helptexts/helptexts';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  chosenCategory:number;
  allDealsTitle: string = '';
  selectCategoryTitle: string = '';

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public api: ApiProvider,
    private searchProvider: SearchProvider,
    private helptexts: HelptextsProvider
  ) {
    this.helptexts.init().then( () => {
      this.allDealsTitle = this.helptexts.getText('search_select_all');
      this.selectCategoryTitle = this.helptexts.getText('search_select_category');
    } )
  }

  occuredErrorMessage:string = "";
  loadingEnd = true;
  
  ionViewDidLoad(){
    this.loadCategories();
  }

  ionViewDidEnter(){
    if (this.navCtrl.parent.rootParams && this.navCtrl.parent.rootParams.showAll){
      this.navCtrl.parent.rootParams.showAll = false;
      this.searchProvider.deleteSearchParam("category");
      this.searchProvider.deleteSearchParam("location_lat");
      this.searchProvider.deleteSearchParam("location_lng");
      if(this.navCtrl.canGoBack) {
        this.navCtrl.popToRoot();
      }
      this.navCtrl.push("SearchResultsPage", {animate: false});
    } 
  }

  // ionViewDidLeave(){
  //   if (this.navCtrl.parent.rootParams && this.navCtrl.parent.rootParams.showAll){
  //     this.navCtrl.parent.rootParams.showAll = false;
  //   }
  // }

  loadCategories() {
    this.api.invokeMethod("contentcategories", {}).subscribe(categories => {
      this.loadingEnd = false;
      if (categories.data) {
        this.suggestions = categories.data.list.filter(cat => cat.is_featured);
        this.local = categories.data.list;
      }
      this.loadingEnd = true;
    },
    error => {
      console.error(">> [DEALCENTIVE] Search Page failed to load initial categories: ", error);
      this.occuredErrorMessage = error.statusText;
    })
  } 

  suggestions = [];
  local = [];

  chooseCategory(category) {
    if (this.chosenCategory !== category.id) {
      if (category.id >= 0) {
        this.chosenCategory = category.id || this.searchProvider.PARAMS_SEARCH["category"];
        this.searchProvider.searchParamsChangePromise({ category:category.id });
        this.navCtrl.push("SearchResultsPage");
      }
      else {
        this.chosenCategory = null;
        this.searchProvider.deleteSearchParam("category");
        this.navCtrl.push("SearchResultsPage");
      }
    }
    else {
      this.chosenCategory = null;
      this.searchProvider.deleteSearchParam("category");
      this.navCtrl.push("SearchResultsPage");
    }
  }
}
