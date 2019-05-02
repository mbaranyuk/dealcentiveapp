import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-posted-content',
  templateUrl: 'posted-content.html',
})
export class PostedContentPage {
  table: any;
  isTableEmpty: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private api: ApiProvider,
    private aib: InAppBrowser) {
      this.api.invokeMethod('postedcontenttable', {}).subscribe(res => {
        if (res && !res.error_code) {
          this.table = res.data.table;
        } else {
          console.log('>>>e', res.error_message);
        }

        if(res.data.table.rows.length < 1) this.isTableEmpty = true;
      });
    }
    
    openPage($event, url){
      $event.preventDefault();
      this.aib.create(url, "_system", {location: 'no', hideurlbar: 'no', hidenavigationbuttons: 'no'});
    }

}
