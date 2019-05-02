import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { SearchProvider } from '../../providers/search/search';
import { NavController, NavParams } from 'ionic-angular';
import { PushProvider } from '../../providers/push/push';

@IonicPage()
@Component({
  selector: 'page-featured',
  templateUrl: 'featured.html',
})
export class FeaturedPage {
  loadingEnd = false;
  constructor(
    private searchProvider: SearchProvider,
    public navCtrl: NavController, 
    public navParams: NavParams,
    private pushProvider: PushProvider
  ) {

  }

  featuredCards: Array<Object> = [];
  lastCardId:number = 0;
  noMoreFeaturedCardsToLoad:boolean = false;
  occuredErrorMessage:string = "";

  ionViewDidEnter() {
    if (this.navCtrl.parent.rootParams && this.navCtrl.parent.rootParams.is_featured) this.searchProvider.PARAMS_FEATURED.featured_categories = true;
    else if (this.searchProvider.PARAMS_FEATURED.featured_categories) this.searchProvider.deleteFeaturedParam('featured_categories');
    this.searchProvider.onNeedToRefresh.emit(true);
    this.doRefresh();
    this.refreshData();
    if( !localStorage.subscribed_to_notify ){
    console.log('>>> did enter');
      localStorage.setItem( 'subscribed_to_notify', '1' );
      this.pushProvider.pushProductEmitter.subscribe( card => {
        this.navCtrl.parent.slideTo(0);
        this.navCtrl.push( "ProductPage", { card: card });
      } );
    }

  }

  redrawDashboard($event) {
    this.featuredCards = $event;
  }

  doRefresh(refresher?) {
    if (this.searchProvider.PARAMS_FEATURED.offset) this.searchProvider.deleteFeaturedParam("offset");
    this.searchProvider.featuredParamsChangePromise({ featured_categories: true }, false).then(
      result => { 
        result.subscribe(response => {
          if(response.data) {
            this.featuredCards = response.data.list;
            if(refresher) refresher.complete();
          }
          else if (response.success === false) { 
            if(refresher) refresher.complete();
          }
        },
        error => {
          if(refresher) refresher.complete();
          this.occuredErrorMessage = error.statusText;
        })
      });
  }

  doInfinite(infiniteScroll) {
    if(!this.noMoreFeaturedCardsToLoad) {
      this.lastCardId += this.featuredCards.length;
      let _params = { offset: this.lastCardId };
      if (this.searchProvider.PARAMS_FEATURED) _params = {..._params, ...this.searchProvider.PARAMS_FEATURED};
      this.searchProvider.featuredParamsChangePromise(_params).then(
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

  refreshData(){
    if(!this.featuredCards.length){
      this.loadingEnd = false;
      this.searchProvider.featuredParamsChangePromise({ }, false).then(
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
  }
}
