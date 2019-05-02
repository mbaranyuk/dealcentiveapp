import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationsPage } from './notifications';

import { NotificationItemModule } from '../../components/notification-item/notification-item.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    NotificationsPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationsPage),
    NotificationItemModule,
    PipesModule
  ],
})
export class NotificationsPageModule {}
