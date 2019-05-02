import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PushProvider } from '../../providers/push/push';
import { ApiProvider } from '../../providers/api/api';
import { AlertProvider } from '../../providers/alert/alert';

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
  notifications: any = [];

  occuredErrorMessage: string = "";
  loadingEnd: boolean = true;
  noMoreMessagesToLoad: boolean = false;
  lastLoadedMsg:number = 0;
  
  private currDate: any;
  private loading: boolean;
  private offset: any;

  private monthes: any = {
    '1': 'Jan',
    '2': 'Feb',
    '3': 'Mar',
    '4': 'Apr',
    '5': 'May',
    '6': 'June',
    '7': 'July',
    '8': 'Aug',
    '9': 'Sept',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec'
  };

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private api: ApiProvider,
    private alert: AlertProvider,
    private push: PushProvider) {
      this.api.invokeMethod('messageslist', { }).subscribe((response: any) => {
        this.loadingEnd = false;
        localStorage.removeItem('lastNotification');
        if (response && !response.error_code) {
          if (response.data.list && response.data.list.length) {
            this.notifications = response.data.list;

            if (response.data.list.length >= response.data.total_items) this.noMoreMessagesToLoad = true;

            this.notifications.sort((a: any, b: any) => {
              let aDate: any = new Date(a.datetime);
              let bDate: any = new Date(b.datetime);
              return bDate - aDate;
            });
          } else {
            this.notifications = [];
          }
          this.offset = 0;
        } else {
          this.alert.showAlert('Error', response.error_message);
        }
        this.loadingEnd = true;
      },
      error => {
        this.occuredErrorMessage = error.statusText;
      });

      let date = new Date();
      this.currDate = {
        month: date.getMonth()+1,
        day: date.getDate(),
        year: date.getFullYear()
      };

  }

  ionViewWillEnter(){
    setTimeout( () => {
      this.push.clearNotification();
    }, 5000);

  }

  doInfinite(infiniteScroll) {
    if (!this.noMoreMessagesToLoad) {
      if (!this.loading) {
        this.loading = true;
        this.offset += 15;
        this.api.invokeMethod('messageslist', {
          limit: 15,
          offset: this.offset
        }).subscribe((res: any) => {
          if (res && !res.error_code) {
            if (res.data.list && res.data.list.length) {
              this.notifications = [...this.notifications, ...res.data.list];
              this.notifications.sort((a: any, b: any) => {
                let aDate: any = new Date(a.datetime);
                let bDate: any = new Date(b.datetime);
                return bDate - aDate;
              });
              if (this.notifications.length === res.data.total_items) this.noMoreMessagesToLoad = true;
            }

          } else {
            console.log('>>>e', res.error_message);
          }

          this.loading = false;
          infiniteScroll.complete();
        });
      }
    }

    else if (infiniteScroll && this.noMoreMessagesToLoad) infiniteScroll.complete(); 
  }

  doRefresh(refresher?) {
    this.noMoreMessagesToLoad = false;
    
    this.api.invokeMethod("messageslist", {  }).subscribe(response => { 
      if (response && !response.error_code) {
        if (response.data.list && response.data.list.length) {
          this.notifications = response.data.list;
          if (response.data.list.length >= response.data.total_items) this.noMoreMessagesToLoad = true;
            this.notifications.sort((a: any, b: any) => {
            let aDate: any = new Date(a.datetime);
            let bDate: any = new Date(b.datetime);
            return bDate - aDate;
          });
        }
      }
      if(refresher) refresher.complete();
    }, error => {
      console.error(">> [DEALCENTIVE] Notifications Page failed to refresh messages: ", error);
      this.occuredErrorMessage = error.statusText;
      if(refresher) refresher.complete();
    })
  }

  formatDateStr(dateStr: string) {
    if (!dateStr) return '';

    try {
      let data = dateStr.split('/');
      if (data[0] === ''+this.currDate.month && data[2] === ''+this.currDate.year) {
        if (data[1] === ''+this.currDate.day) {
          return 'today';
        } else {
          return data[1] + ' ' + this.monthes[data[0]];
        }
        
      } else {
        return dateStr
      }
    } catch (error) {
      return dateStr;
    }
  }

}
