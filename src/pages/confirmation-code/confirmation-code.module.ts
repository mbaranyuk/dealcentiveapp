import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmationCodePage } from './confirmation-code';

import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    ConfirmationCodePage,
  ],
  imports: [
    IonicPageModule.forChild(ConfirmationCodePage),
    DirectivesModule
  ],
})
export class ConfirmationCodePageModule {}
