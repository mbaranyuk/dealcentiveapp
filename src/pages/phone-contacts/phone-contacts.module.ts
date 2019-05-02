import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PhoneContacts } from './phone-contacts';

@NgModule({
  declarations: [
    PhoneContacts,
  ],
  imports: [
    IonicPageModule.forChild(PhoneContacts),
  ],
  providers: [
  ]
})
export class PhoneContactsModule {}
