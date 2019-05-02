import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-saved',
  templateUrl: 'saved.html',
})
export class SavedPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private api:ApiProvider
    ) {
  }
  savedCards: Array<Object> = [];
  noSavedCards:boolean = false;
  savedOffset:number = 0;
  cardLoadingIterator: number = 5;  // how many cards will load after end

  noMoreSavedCardsToLoad:boolean = false;

  occuredErrorMessage:string = "";
  loadingEnd = true;

  ionViewDidEnter() {
    this.loadingEnd = false;

    this.api.invokeMethod("contentlist", { favorite_items : true }).subscribe(response => { 
      if(response.data) {
        this.savedCards = response.data.list; 
        if (response.data.list.length < response.data.limit) {
          this.noMoreSavedCardsToLoad = true;
        }
        if (response.data.list.length === 0){
          this.noSavedCards = true;
        }else{
          this.noSavedCards = false;
        }
      }
      this.loadingEnd = true;
    }, error => {
      console.error(">> [DEALCENTIVE] Saved Page failed to load cards: ", error);
      this.occuredErrorMessage = error.statusText;
      this.loadingEnd = true;
    })
  }

  doInfinite(infiniteScroll) {
    if(!this.noMoreSavedCardsToLoad) {
      this.savedOffset += this.cardLoadingIterator;
      this.api.invokeMethod("contentlist", { favorite_items: true, offset: this.savedOffset })
      .subscribe(response => {
        if(response.data.list) {
          if (response.data.list.length !== 0 && response.data.list.length >= response.data.limit) {
            this.savedCards = [...this.savedCards, ...response.data.list];
          }
          else {
            this.noMoreSavedCardsToLoad = true;
          }
        }
        infiniteScroll.complete();
      })
    }
    else infiniteScroll.complete();
  }

  doRefresh(refresher?) {
    this.api.invokeMethod("contentlist", { favorite_items : true }).subscribe(response => { 
      if(response.data) {
        this.savedCards = response.data.list; 
      }
      if(refresher) refresher.complete();
    }, error => {
      console.error(">> [DEALCENTIVE] Saved Page failed to refresh cards: ", error);
      this.occuredErrorMessage = error.statusText;
      if(refresher) refresher.complete();
    })
  }

}
