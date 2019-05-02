import { IonicModule } from 'ionic-angular';
import { TableComponent } from './table';
import { NgModule } from '@angular/core';
 
@NgModule({
  declarations: [
    TableComponent
  ],
  imports: [
    IonicModule
  ],
  exports: [
    TableComponent
  ]
})
export class TableComponentModule {}