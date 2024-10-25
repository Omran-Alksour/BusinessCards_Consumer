import { Component, OnInit } from '@angular/core';
import { ModelComponent } from '../shared/ui/model/model.component';
import { BussineesCardFormComponent } from '../business-card-form/business-card-form.component';
import { ToastrService } from 'ngx-toastr';
import { BusinessCardservice } from '../../services/BusinessCard/business-card.service';
import { IBusinessCard } from '../shared/models/BusinessCard';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { identifierName } from '@angular/compiler';
import { ExportService } from '../../services/Files/Export/export.service';
@Component({
  selector: 'app-bussineesCard',
  standalone: true,
  imports: [CommonModule,ModelComponent, BussineesCardFormComponent,RouterLink],
  templateUrl: './business-card.component.html',
  styleUrl: './business-card.component.scss',
})
export class BussineesCardComponent implements OnInit {

ImportFile() {
console.log("import file ..");
}
  isModelOpen = false;
  businessCards: IBusinessCard[] = [];
  bussineesCard!: IBusinessCard;
 activeDropdown: string | undefined = undefined;
  // isMenuOpen = false;

  constructor(
    private businessCardservice: BusinessCardservice,
    private exportService: ExportService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllBusinessCards();
  }
  toggleMenu(id: string |undefined): void {
    if (this.activeDropdown === id) {
      this.activeDropdown = undefined;
    } else {
      this.activeDropdown = id;
    }
  }
  getAllBusinessCards() {
    debugger;
    this.businessCardservice.getBusinessCards().subscribe({
      next: (response) => {
        console.log(response);
        if (response.isSuccess ) {
          this.businessCards = response.value?.data;
        }
      },
    });
  }

  newBusinessCard() {
    this.bussineesCard =  {
      name: '',
      gender: 1,
      dateOfBirth: (new Date()).toISOString(),
      email: '',
      phone: '',
      address: '',
    };

    this.openModel();
  }


  loadBusinessCards(bussineesCard: IBusinessCard) {
    this.bussineesCard = bussineesCard;
    this.openModel();
  }


  exportBusinessCards(format: string ,IDs:string[]|undefined=undefined): void {
    // this.exportService.exportAndDownloadBusinessCards(format,IDs).su
  }

  deleteBusinessCard(id: string ="") {
    this.businessCardservice.deleteBusinessCards([id]).subscribe({
      next: (response) => {
        
        if (response.isSuccess) {
        this.toastr.success("Card deleted successfully.");
        this.getAllBusinessCards();
        }

      },
    });
  }

  openModel() {
    this.isModelOpen = true;
  }

  closeModel() {
    this.isModelOpen = false;
    this.getAllBusinessCards();
  }
}
