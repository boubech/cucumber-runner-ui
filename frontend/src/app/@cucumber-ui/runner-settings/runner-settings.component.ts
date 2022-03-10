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

  displayedColumns: string[] = ['name', 'value'];

  @Input("settings") settings: Setting[] = [];
  @Input("title") title: string = '';
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

  copyToSettings() {
    this.dataSource.filter(r => r.setting.key != '' || r.setting.value != '').forEach(row => {
      let found = this.settings.find(setting => row.setting.key == setting.key);
      if (found) {
        found.value = row.setting.value;
      } else {
        this.settings.push(row.setting);
      }
    });
    this.removeEmptySetting()
  }

  removeEmptySetting() {
    let i = this.settings.length - 1;
    if (i >= 0) {
      while (i >= 0) {
        var setting = this.settings[i];
        if (setting.key.trim().length == 0) {
          this.settings.splice(i, 1);
          i = i - 1;
        }
        i = i - 1;
      }
    }
  }

  addRowIfNeeded() {
    let addRow = false;
    if (this.dataSource.length > 0) {
      let lastRow = this.dataSource[this.dataSource.length - 1];
      if (lastRow.setting.key != '' && lastRow.setting.value != '') {
        addRow = true;
      }
    } else {
      addRow = true;
    }
    if (addRow) {
      this.dataSource.push(<RowSetting>{
        index: this.getMaxIndexAndIncrement(),
        setting: {key: '', value: '', type: this.type}
      });
      this.renderRows();
    }
  }

  renderRows(): void {
    if (this.table && this.table.dataSource) {
      this.table.renderRows();
    }
  }

  purgeEmptyRow() {
    this.dataSource = this.dataSource.filter(r => r.setting.key != '' || r.setting.value != '');
  }

}
