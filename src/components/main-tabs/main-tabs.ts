import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavParams, NavController } from 'ionic-angular';
import { SuperTabsController } from 'ionic2-super-tabs';
import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-main-tabs',
  templateUrl: 'main-tabs.html',
})
export class MainTabsPage {
  @ViewChild("SuperTabs") superTabs: SuperTabsController;

  myIndex: number;
  userInfo;

  tab1 = 'FeaturedPage';
  tab2 = 'SearchPage';
  tab3 = 'NotificationsPage';
  tab4 = 'SavedPage';
  tab5 = 'MenuPage';

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private api: ApiProvider,
    private superTabsController: SuperTabsController
  ) {
    this.myIndex = navParams.data.tabId || 0;
    this.updateSidebarName();
    this.superTabsController.enableTabsSwipe(false);
  }

  updateSidebarName(){
    if (!this.userInfo && localStorage.getItem('profile')) {
      this.userInfo = JSON.parse(localStorage.getItem('profile'));
    }
    else if (!this.userInfo) {
      this.api.invokeMethod('myinfo', {}).subscribe(res => {
        if (res && !res.error_code) {
          this.userInfo = res.data;
          localStorage.setItem('profile', JSON.stringify(this.userInfo));
        }
      });
    }
  }
}
