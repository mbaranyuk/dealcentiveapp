import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeaturedPage } from './featured';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    FeaturedPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(FeaturedPage),
  ],
})
export class FeaturedPageModule {}
