import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostedContentPage } from './posted-content';

@NgModule({
  declarations: [
    PostedContentPage,
  ],
  imports: [
    IonicPageModule.forChild(PostedContentPage),
  ],
})
export class PostedContentPageModule {}
