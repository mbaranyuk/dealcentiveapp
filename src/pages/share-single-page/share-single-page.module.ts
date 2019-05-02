import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShareSinglePage } from './share-single-page';

@NgModule({
  declarations: [
    ShareSinglePage,
  ],
  imports: [
    IonicPageModule.forChild(ShareSinglePage),
  ],
  providers: [
  ]
})
export class ShareSinglePageModule {}
