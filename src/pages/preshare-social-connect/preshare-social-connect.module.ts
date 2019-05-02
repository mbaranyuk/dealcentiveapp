import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PreshareSocialConnect } from './preshare-social-connect';

@NgModule({
  declarations: [
    PreshareSocialConnect,
  ],
  imports: [
    IonicPageModule.forChild(PreshareSocialConnect),
  ],
  providers: [
  ]
})
export class PreshareSocialConnectModule {}
