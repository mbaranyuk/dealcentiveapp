import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HelptextsProvider} from "../../providers/helptexts/helptexts";

export interface PageInterface {
  title: string;
  tabPageName?: string;    // name of the tab page for child page display; If this page is a tab's children then pageName = 'TabPage' else pageName is undefined
  component: any;          // name of page component class. Every page should have unique component name
  tabId?: number;          // parameter that defines id of a tab where page will be loaded
  icon?:string;
  subItems?: Array<Object>;
  params?: any;
  opened?: boolean;
  isAll?: boolean;
  visible?: boolean;
}

@IonicPage()
@Component({
  selector: 'menu-page',
  templateUrl: 'menu-page.html',
})
export class MenuPage {
  username:string;
  userInfo;
  unreadMessages: number;
  disabled_points: boolean = true;
  pages: PageInterface[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private helptexts: HelptextsProvider) {
    this.disabled_points = this.helptexts.getText('disable_points');
    this.pages = [
      { title: "Featured", component: "MainTabsPage", tabId: 0, icon: "dealcentive-featured", visible: true },
      { title: "Offers", component: "", icon: "basket", subItems: [
          {title: "Featured Categories", component: "MainTabsPage", tabId: 0, params: {is_featured: true},  visible: true},
          {title: "View All", component: "MainTabsPage", tabId: 1, params: {is_featured: false, showAll: true}, isAll: true,  visible: true}
        ], opened: false,  visible: true},
      { title: "Rewards", component: "RewardsPage", icon: "cash",  visible: !this.disabled_points},
      { title: "Reports", component: "", icon: "paper", subItems: [
          {title: "My Leads", component: "LeadsPage",  visible: true},
          {title: "Posted Content", component: "PostedContentPage",  visible: true},
          {title: "Points Assignments", component: "PointsPage",  visible: !this.disabled_points},
          {title: "Claimed Prizes", component: "ClaimedRewardsPage",  visible: !this.disabled_points},
        ], opened: false,  visible: true},
      { title: "Notifications", component: "MainTabsPage", tabId: 2, icon: "notifications",  visible: true},
      { title: "Profile", icon: "person", tabPageName: "MainTabsPage", component: "ProfilePage", params: {userInfo: this.userInfo}, visible: true},
      { title: "Search", component: "MainTabsPage", tabId: 1, icon: "search", visible: true},
      { title: "Saved", component: "MainTabsPage", tabId: 3, icon: "heart", visible: true},
    ];
  }

  ionViewDidLoad() {
    if (localStorage.profile) {
      this.userInfo = JSON.parse(localStorage.profile);
      this.username = this.getUserData(JSON.parse(localStorage.profile));
    }
  }

  getUserData({first_name, last_name}) {
    if(first_name && last_name ) {
      return `${first_name} ${last_name}`
    }
  }

  openPage(page: PageInterface, event?: any) {
    if (page.hasOwnProperty("opened")) {
      page.opened = !page.opened;
    }

    if (page.component) {
      try {
        if (page.tabId != undefined) {
          if (page.params && this.navCtrl.parent) {
            this.navCtrl.parent.rootParams = page.params;
          }
          if(page.isAll){
            this.navCtrl.parent.rootParams.showAll = true;
          }
          this.navCtrl.parent.slideTo(page.tabId);
        }
        else this.navCtrl.push(page.component, page.params);
      } 
      catch(error) {
        console.error(">> [DEALCENTIVE]: Navigation error ", error);
      }
    }
  }

}
