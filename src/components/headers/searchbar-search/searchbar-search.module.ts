import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchbarSearchComponent } from './searchbar-search';

@NgModule({
  declarations: [
    SearchbarSearchComponent
  ],
  imports: [
		IonicPageModule.forChild(SearchbarSearchComponent),
  ]
})
export class SidebarModule {}
