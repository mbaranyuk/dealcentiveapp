import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PointsPage } from './points';

import { TableComponentModule } from '../../components/table/table.module';

@NgModule({
  declarations: [
    PointsPage
  ],
  imports: [
    IonicPageModule.forChild(PointsPage),
    TableComponentModule
  ],
})
export class PointsPageModule {}
