import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SocialConnectPage } from './social-connect';

@NgModule({
  declarations: [
    SocialConnectPage,
  ],
  imports: [
    IonicPageModule.forChild(SocialConnectPage)
  ],
})
export class SocialConnectPageModule {}
