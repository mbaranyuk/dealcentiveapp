import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MainTabsPage } from './main-tabs';
import { SuperTabsModule } from 'ionic2-super-tabs';

@NgModule({
  declarations: [
    MainTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(MainTabsPage),
    SuperTabsModule.forRoot()
  ],
})
export class MainTabsPageModule {}
