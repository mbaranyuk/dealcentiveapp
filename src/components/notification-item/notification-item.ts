import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'notification-item',
  templateUrl: 'notification-item.html'
})
export class NotificationItemComponent implements OnInit {
  @Input() data: any;
  time: string;
  safeHtml: any;

  constructor( private sanitizer: DomSanitizer) {}

  ngOnInit() {
    let itemDate: any = new Date(this.data.datetime);
    let currDate: any = new Date();
    let currUtc: any = new Date(currDate.valueOf() + currDate.getTimezoneOffset() * 60000);
    try {
      // console.log(' currDate.gsetTimezoneOffset()', new Date( itemDate.valueOf() - currDate.getTimezoneOffset() * 60000 ).toLocaleTimeString() );
      let diff = Math.floor(Math.abs(currUtc - itemDate) / 36e5);
      if (diff <= 12) {
        if (diff < 1) {
          diff *= 10;
          this.time = diff + ' min ago';
        } else {
          this.time = diff + ' hours ago';
        }
      } else {
        this.time = this.formatAMPM(new Date( itemDate.valueOf() - currDate.getTimezoneOffset() * 60000 ));
      }
    } catch (e) {
      this.time = this.formatAMPM(new Date( itemDate.valueOf() - currDate.getTimezoneOffset() * 60000 ));
    };
    this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(this.data.text);
  }

  formatAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

}
