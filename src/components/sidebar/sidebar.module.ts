import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SidebarComponent } from './sidebar';

@NgModule({
  declarations: [
    SidebarComponent
  ],
  imports: [
		IonicPageModule.forChild(SidebarComponent),
  ],
})
export class SidebarModule {}
