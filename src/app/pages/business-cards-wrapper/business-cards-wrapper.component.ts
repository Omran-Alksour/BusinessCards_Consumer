import { IBusinessCard } from '../shared/models/BusinessCard';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { BusinessCardDialogComponent } from '../business-card-dialog/business-card-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { BusinessCardservice } from '../../services/BusinessCard/business-card.service';
import { ExportService } from '../../services/Files/Export/export.service';
import { CustomConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-business-cards-wrapper',
  templateUrl: './business-cards-wrapper.component.html',
  styleUrls: ['./business-cards-wrapper.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ]
})
export class BusinessCardsWrapperComponent /*implements AfterViewInit */ {

deleteSelectedBusinessCardsDialog() {
  this.deleteRowsDialog(this.selectedRows);
}

deleteRowsDialog(rows: IBusinessCard[]): void {
  const dialogRef = this.dialog.open(CustomConfirmationDialogComponent, {
    data: {
      title: 'Delete Business Cards',
      message: 'Are you sure you want to delete the selected business cards?',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if(result){
      this.deleteRows(rows);
    }
  });

}




  displayedColumns: string[] = ['select', 'id','name',/* 'gender','dateOfBirth',*/  'email', 'phone',/*'address',*/ 'photo','lastUpdateAt', 'actions'];
  dataSource = new MatTableDataSource<IBusinessCard>([]);
  selectedRows: IBusinessCard[] = [];
  fullPage: IBusinessCard[] = [];

//pagination
  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;

  orderBy: string = "LastUpdateAt";
  orderDirection:string ="desc";

  search:string | null=null;
  typingTimeout: any = null;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private dialog: MatDialog, private businessCardservice: BusinessCardservice,
        private exportService: ExportService,
    private toastr: ToastrService) {
  }


  ngOnInit(): void {
    this.getBusinessCards();
  }
  onSort(sort: Sort) {
    this.orderDirection=sort.direction ? sort.direction : 'asc';
    this.orderBy=sort.active;
console.log(`Active Sort: ${sort.active}`);
    this.getBusinessCards(this.currentPage, this.pageSize, this.orderBy, this.orderDirection, this.search);
  }

  getBusinessCards(pageNumber:number=1,pageSize:number=10,orderBy:string="LastUpdateAt",orderDirection:string="desc", search:string | null=null) {

    debugger;
    this.businessCardservice.getBusinessCards(pageNumber,pageSize,orderBy,orderDirection,search).subscribe({
      next: (response) => {
        console.log(response);
        if (response.isSuccess ) {
          this.dataSource.data = response.value?.data;
         this.fullPage=response.value?.data;
        // Set paginator values
          this.paginator.pageIndex = response.value.pageNumber - 1; // 0-based index
          this.paginator.pageSize = response.value.pageSize;
          this.paginator.length = response.value.totalRecords;

          this.dataSource.sort = this.sort;
        }
      },
    });
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.selectedRows.length =0;
    this.getBusinessCards(this.currentPage, this.pageSize);
  }

  applyFilter(event: Event) {
          this.search = (event.target as HTMLInputElement).value;

          //User is still typing
          if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
          }

          //Call after 300ms
          this.typingTimeout = setTimeout(() => {
            this.getBusinessCards(this.currentPage, this.pageSize, this.orderBy, this.orderDirection, this.search);
          }, 300);
    }


  toggleSelection(row: IBusinessCard) {
    const index = this.selectedRows.indexOf(row);
    if (index === -1) {
      this.selectedRows.push(row);
    } else {
      this.selectedRows.splice(index, 1);
    }
  }

  selectAll(isChecked: boolean) {
    if (isChecked) {
      this.selectedRows = [...this.dataSource.data];
    } else {
      this.selectedRows = [];
    }
  }

  editRow(row: IBusinessCard) {
    console.log('Editing row:', row);
  }

  deleteSelectedBusinessCards() {
    this.deleteRows(this.selectedRows);
  }


  deleteRows(rows: IBusinessCard[]): void {
    const IDs = rows.map(row => row.id);
    this.dataSource.data = this.dataSource.data.filter(data => !IDs.includes(data.id));

    this.businessCardservice.deleteBusinessCards(IDs).subscribe({
      next: (response) => {
        let deletedIDs:(string|undefined)[] =response.value??[];

        this.dataSource.data = this.dataSource.data.filter(data => !deletedIDs?.includes(data.id));
        this.toastr.success("Deletion successful.");
      },
      error: (error) => {
        console.error('Error deleting business cards', error);
      },
      complete: () => {
        console.log('Deletion request completed');
      }
    });
  }




  exportSelectedBusinessCards(format: string): void {
    debugger;
    const IDs = this.selectedRows.map(row => row.id);
    this.exportService.exportAndDownloadBusinessCards(format, IDs);
  }


  /////////////////
  openAddBusinessCardDialog() {
    const dialogRef = this.dialog.open(BusinessCardDialogComponent, {
      width: '400px'
    });

    // After closes, update the table
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Add the new to the list
        this.dataSource.data = [...this.dataSource.data, result];
      }
    });
  }

}

