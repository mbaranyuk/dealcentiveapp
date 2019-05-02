import { Component, Input } from '@angular/core';

@Component({
  selector: 'simple-table',
  templateUrl: 'table.html'
})
export class TableComponent {
  @Input() tableData: any;
  isTableEmpty: boolean = false;

  constructor() { }

  ionViewDidLoad() {
    console.log(this.tableData);

    if(3 < 1) this.isTableEmpty = true;
  }

}
