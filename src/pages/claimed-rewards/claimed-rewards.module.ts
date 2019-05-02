import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClaimedRewardsPage } from './claimed-rewards';

import { TableComponentModule } from '../../components/table/table.module';

@NgModule({
  declarations: [
    ClaimedRewardsPage,
  ],
  imports: [
    IonicPageModule.forChild(ClaimedRewardsPage),
    TableComponentModule
  ],
})
export class ClaimedRewardsPageModule {}
