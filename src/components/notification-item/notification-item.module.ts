import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { NotificationItemComponent } from './notification-item';

@NgModule({
  declarations: [
    NotificationItemComponent,
  ],
  imports: [
    IonicModule
  ],
  exports: [
    NotificationItemComponent
  ]
})
export class NotificationItemModule {}
