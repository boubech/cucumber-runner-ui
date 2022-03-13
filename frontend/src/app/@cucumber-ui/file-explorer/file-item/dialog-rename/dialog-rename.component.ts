import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

class DialogData {
  newName: string | undefined
}

@Component({
  selector: 'app-dialog-rename.component',
  templateUrl: './dialog-rename.component.html',
  styleUrls: ['./dialog-rename.component.css']
})
export class DialogRenameComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogRenameComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.data.newName = undefined;
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }
}
