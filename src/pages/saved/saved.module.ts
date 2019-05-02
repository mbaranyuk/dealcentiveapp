import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SavedPage } from './saved';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    SavedPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(SavedPage),
  ],
})
export class SavedPageModule {}
