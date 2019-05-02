import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AuthPage } from './auth';
import { FormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [
    AuthPage,
  ],
  imports: [
    IonicPageModule.forChild(AuthPage),
    FormsModule,
    TextMaskModule
  ],
})
export class AuthPageModule {}
