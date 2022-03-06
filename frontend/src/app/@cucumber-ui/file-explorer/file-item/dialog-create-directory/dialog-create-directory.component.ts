import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

class DialogData {
  directory: string | undefined
}

@Component({
  selector: 'app-dialog-create-directory',
  templateUrl: './dialog-create-directory.component.html',
  styleUrls: ['./dialog-create-directory.component.css']
})
export class DialogCreateDirectoryComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogCreateDirectoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }
}
