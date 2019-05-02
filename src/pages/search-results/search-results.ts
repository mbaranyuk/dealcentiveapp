import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { SearchProvider } from '../../providers/search/search';
import { NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-search-result',
  templateUrl: 'search-results.html',
})
export class SearchResultsPage {
  loadingEnd = false;
  constructor(
    private searchProvider: SearchProvider,
    public navCtrl: NavController, 
    public navParams: NavParams
  ) { }

  featuredCards: Array<Object> = [];
  lastCardId:number = 0;
  noMoreFeaturedCardsToLoad:boolean = false;
  occuredErrorMessage:string = "";

  // ionViewDidLeave() {
  //   this.leaveToSearch();
  // }

  // leaveToSearch(){
  //   this.searchProvider.clearSearchParams();
  //   this.searchProvider.searchParamsChangePromise({ }, false);
  //   let active = this.navCtrl.isTransitioning();
  //   if(!active) this.navCtrl.goToRoot({animate: false});
  // }

  ionViewDidEnter() {
    if(!this.featuredCards.length){
      this.loadingEnd = false;
      this.searchProvider.searchParamsChangePromise({ }, false).then(
        result => { 
          result.subscribe(response => {
            if(response.data) {
              this.featuredCards = response.data.list;
              this.loadingEnd = true;
              if(response.data.list.length < response.data.limit) this.noMoreFeaturedCardsToLoad = true;
            }
            else if (response.success === false) console.error(">> [DEALCENTIVE] Search API Error: ", response.error_message); 
          },
          error => {
            this.loadingEnd = true;
            this.occuredErrorMessage = error.statusText;
          })
        });
    }
    this.searchProvider.reloadResultsPage.subscribe( () => {
      if (this.searchProvider.PARAMS_SEARCH.offset) this.searchProvider.deleteSearchParam("offset"); 
      this.searchProvider.searchParamsChangePromise({ }, false).then(
        result => { 
          result.subscribe(response => {
            if(response.data) {
              this.featuredCards = response.data.list;
              this.loadingEnd = true;
              if(response.data.list.length < response.data.limit) this.noMoreFeaturedCardsToLoad = true;
            }
            else if (response.success === false) console.error(">> [DEALCENTIVE] Search API Error: ", response.error_message); 
          },
          error => {
            this.loadingEnd = true;
            this.occuredErrorMessage = error.statusText;
          })
        });
    } )
  }

  doRefresh(refresher?) {
    console.log('do refresh');
    if (this.searchProvider.PARAMS_SEARCH.offset) this.searchProvider.deleteSearchParam("offset");
    this.searchProvider.searchParamsChangePromise({ }, false).then(
      result => { 
        result.subscribe(response => {
          if(response.data) {
            this.featuredCards = response.data.list;
            if(refresher) refresher.complete();
            this.loadingEnd = true;
          }
          else if (response.success === false) { 
            if(refresher) refresher.complete();
            this.loadingEnd = true;
          }
        },
        error => {
          if(refresher) refresher.complete();
          this.loadingEnd = true;
          this.occuredErrorMessage = error.statusText;
          console.error(">> [DEALCENTIVE] Search Promise Error: ", error);
        })
      });
  }

  doInfinite(infiniteScroll) {
    console.log('do infinite');
    if(!this.noMoreFeaturedCardsToLoad) {
      this.lastCardId += this.featuredCards.length;
      let _params = { offset: this.lastCardId };
      if (this.searchProvider.PARAMS_SEARCH) _params = {..._params, ...this.searchProvider.PARAMS_SEARCH};
      this.searchProvider.searchParamsChangePromise(_params).then(
        result => { 
          result.subscribe(response => {
            if(response.data) {
              if (response.data.list.length === 0) {
                this.noMoreFeaturedCardsToLoad = true;
              }
              else {
                this.featuredCards = [...this.featuredCards, ...response.data.list]; 
                if(response.data.list.length < response.data.limit) this.noMoreFeaturedCardsToLoad = true;
              }
            }
            else if (response.success === false) console.error(">> [DEALCENTIVE] Search API Error During Infinite Scroll: ", response.error_message); 
            infiniteScroll.complete();
          })
        }).catch(reason => console.error(">> [DEALCENTIVE] Search Promise Error During Infinite Scroll: ", reason));
    }
    else if (infiniteScroll && this.noMoreFeaturedCardsToLoad) infiniteScroll.complete();       
  }
}
