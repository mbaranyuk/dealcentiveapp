import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RewardsPage, RewardDetails, CompanyDetails } from './rewards';

@NgModule({
  declarations: [
    RewardsPage,
    RewardDetails,
    CompanyDetails
  ],
  imports: [
    IonicPageModule.forChild(RewardsPage),
  ],
  entryComponents: [
    RewardDetails,
    CompanyDetails
  ]
})
export class RewardsPageModule {}
