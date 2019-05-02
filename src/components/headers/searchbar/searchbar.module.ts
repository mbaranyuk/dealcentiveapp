import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchbarComponent } from './searchbar';

@NgModule({
  declarations: [
    SearchbarComponent
  ],
  imports: [
		IonicPageModule.forChild(SearchbarComponent),
  ]
})
export class SidebarModule {}
