// Navigation component - Side Menu
// Key requirement for navigation is this component to be a @IonicPage for lazy loading

import { Component, ViewChild } from '@angular/core';
import { Nav, NavController } from 'ionic-angular';
import { IonicPage } from 'ionic-angular';
import { ApiProvider } from "../../providers/api/api"

export interface PageInterface {
  title: string;
  tabPageName?: string;    // name of the tab page for child page display; If this page is a tab's children then pageName = 'TabPage' else pageName is undefined
  component: any;          // name of page component class. Every page should have unique component name
  tabId?: number;          // parameter that defines id of a tab where page will be loaded
  icon?:string;
  subItems?: Array<Object>;
  params?: any;
  opened?: boolean;
}

@IonicPage()
@Component({
  selector: 'page-sidebar',
  templateUrl: 'sidebar.html'
})
export class SidebarComponent {
  @ViewChild(Nav) nav: Nav;
  rootPage = 'MainTabsPage';
  userInfo = null;
  unreadMessages: number;

  constructor(
    public api: ApiProvider,
    public navCtrl: NavController,
    // public appCtrl: App,
    // public viewCtrl: ViewController
    ) { 
      this.updateSidebarName();

      this.api.invokeMethod("messageslist", {}).subscribe(res => {
        console.log("MSGS not read: ", res.data.total_unread_items);
        this.unreadMessages = res.data.total_unread_items;
      });
    }

  pages: PageInterface[] = [
    { title: "Featured", component: "MainTabsPage", tabId: 0, icon: "dealcentive-featured" },
    { title: "Offers", component: "", icon: "basket", subItems: [
      {title: "Featured Categories", component: "MainTabsPage", tabId: 0, params: {is_featured: true}},
      {title: "View All", component: "MainTabsPage", tabId: 0, params: {is_featured: false}}
    ], opened: false},
    { title: "Rewards", component: "RewardsPage", icon: "cash"},
    { title: "Reports", component: "", icon: "paper", subItems: [
      {title: "My Leads", component: "LeadsPage"},
      {title: "Posted Content", component: "PostedContentPage"},
      {title: "Points Assignments", component: "PointsPage"},
      {title: "Claimed Prizes", component: "ClaimedRewardsPage"},
    ], opened: false},
    { title: "Notifications", component: "MainTabsPage", tabId: 2, icon: "notifications" },
    { title: "Profile", icon: "person", tabPageName: "MainTabsPage", component: "ProfilePage", params: {userInfo: this.userInfo}},
    { title: "Search", component: "MainTabsPage", tabId: 1, icon: "search"},
    { title: "Saved", component: "MainTabsPage", tabId: 3, icon: "heart" },
    // { title: "My Stuff", icon: "person" },
  ];

  onUserNameClick() {
    console.log("onUserNameClick");
    this.openPage({ title: "Profile", icon: "person", tabPageName: "MainTabsPage", component: "ProfilePage"})
  }

  openPage(page: PageInterface, event?: any) {
    console.log(page);
    console.log(this.nav.getActiveChildNavs()[0]);
    if (event) {
      event.stopPropagation();
    }
 
    // The index is equal to the order of our tabs inside main-tabs.ts
    if (page.tabId) {
      page.params.tabId = page.tabId
    }
    if (page.opened) {
      page.opened = false;
    }
    else page.opened = true;

    // if (page.title === 'Profile') {
    //   params.userInfo = this.userInfo;
    // }

    if (page.component) {
      try {
        // The active child nav is our Tabs Navigation
        if (this.nav.getActiveChildNavs()[0] && page.tabId != undefined) {
          if (this.nav.canGoBack()) this.nav.pop();  // if there is active page without Tab Component

          console.log(page.params);
          console.log(this.nav.getActiveChildNavs()[0].rootParams);

          this.nav.getActiveChildNavs()[0].rootParams = page.params;
          console.log(this.nav.getActiveChildNavs()[0].rootParams);
          this.nav.getActiveChildNavs()[0].slideTo(page.tabId);
        } 
        else {
          // Tabs are not active, so reset the root page 
          // In this case: moving to or from a page without tabs
  
          if (this.nav.canGoBack()) this.nav.pop();  // if we already on page without Tab Component

          console.log(page.params);
          this.nav.push(page.component, page.params);
        }      
      } 
      catch (error) {
        console.error(">> [DEALCENTIVE]: Navigation error ", error);
      }
    }
  }

  logOut() {
    console.log("Logged out, goodbye!");
    localStorage.clear();
    // this.navCtrl.goToRoot({});
    this.navCtrl.setRoot('AuthPage');
  }

  updateSidebarName(){
    console.log("UPDATE NAME");
    if (localStorage.getItem('profile')) {
      this.userInfo = JSON.parse(localStorage.getItem('profile'));
    }
    if (!this.userInfo) {
      this.api.invokeMethod('myinfo', {}).subscribe(res => {
        if (res && !res.error_code) {
          this.userInfo = res.data;
          localStorage.setItem('profile', JSON.stringify(this.userInfo));
        }
      });
    }
  }
}