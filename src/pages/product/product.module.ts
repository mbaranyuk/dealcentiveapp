import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductPage } from './product';
import { Geolocation } from '@ionic-native/geolocation';
import { SocialSharing } from '@ionic-native/social-sharing';

@NgModule({
  declarations: [
    ProductPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductPage),
  ],
  providers: [
    Geolocation,
    SocialSharing
  ]
})
export class ProductPageModule {}
