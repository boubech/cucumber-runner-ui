import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {MatTable} from "@angular/material/table";
import {Setting} from "../../services/test-runner-service";

export interface RowSetting {
  index: number
  setting: Setting;
}

@Component({
  selector: 'app-runner-settings',
  templateUrl: './runner-settings.component.html',
  styleUrls: ['./runner-settings.component.css']
})
export class RunnerSettingsComponent implements OnInit {

  displayedColumns: string[] = ['name', 'value', 'action'];

  @Input("settings") settings: Setting[] = [];
  @Input("type") type: 'property' | 'environment' | undefined;

  @ViewChild(MatTable, {static: true}) table: MatTable<RowSetting> | undefined;
  dataSource: Array<RowSetting> = [];

  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.settings.filter(setting => setting.type == this.type).forEach(setting => {
      this.dataSource.push({index: this.getMaxIndexAndIncrement(), setting: setting})
    });
    this.addRowIfNeeded();
  }

  getMaxIndexAndIncrement() {
    let max = 0;
    this.dataSource.map(i => Math.max(i.index, max)).forEach(index => max = index)
    return max + 1;
  }

  onChange() {
    this.purgeEmptyRow();
    this.addRowIfNeeded();
    this.copyToSettings();
  }

  private copyToSettings() {
    this.dataSource.filter(r => r.setting.key != '' || r.setting.value != '').forEach(row => {
      let found = this.settings.find(setting => row.setting.key == setting.key);
      if (found) {
        found.value = row.setting.value;
      } else {
        this.settings.push(row.setting);
      }
    })
  }

  addRowIfNeeded() {
    let lastRow = this.dataSource[this.dataSource.length - 1];
    if (lastRow) {
      if (lastRow.setting.key != '' && lastRow.setting.value != '') {
        this.dataSource.push(<RowSetting>{
          index: this.getMaxIndexAndIncrement(),
          setting: {key: '', value: '', type: this.type}
        });
        this.renderRows();
      }
    }
  }

  renderRows(): void {
    if (this.table && this.table.dataSource) {
      this.table.renderRows();
    }
  }

  deleteRow(row: RowSetting) {
    console.log(row)
    this.dataSource = this.dataSource.filter(r => r.index != row.index);
    this.addRowIfNeeded();
    this.renderRows();
    this.copyToSettings();
  }

  private purgeEmptyRow() {
    this.dataSource = this.dataSource.filter(r => r.setting.key != '' || r.setting.value != '');
  }

}
