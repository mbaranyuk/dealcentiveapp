import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FavoriteCategoriesPage } from './favorite-categories';

@NgModule({
  declarations: [
    FavoriteCategoriesPage,
  ],
  imports: [
    IonicPageModule.forChild(FavoriteCategoriesPage),
  ],
})
export class FavoriteCategoriesPageModule {}
