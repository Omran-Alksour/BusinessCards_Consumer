import { Component, OnInit } from '@angular/core';
import { ModelComponent } from '../shared/ui/model/model.component';
import { BussineesCardFormComponent } from '../business-card-form/business-card-form.component';
import { ToastrService } from 'ngx-toastr';
import { BusinessCardservice } from '../../services/business-card.service';
import { IBusinessCard } from '../shared/models/BusinessCard';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-bussineesCard',
  standalone: true,
  imports: [CommonModule,ModelComponent, BussineesCardFormComponent],
  templateUrl: './business-card.component.html',
  styleUrl: './business-card.component.scss',
})
export class BussineesCardComponent implements OnInit {
  isModelOpen = false;
  businessCards: IBusinessCard[] = [];
  bussineesCard!: IBusinessCard;
 activeDropdown: string | undefined = undefined;
  // isMenuOpen = false;

  constructor(
    private BusinessCardservice: BusinessCardservice,
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
    this.BusinessCardservice.getAllBusinessCards().subscribe({
      next: (response) => {
        if (response.data) {
          this.businessCards = response.data;
        }
      },
    });

  }

  // Toggles the dropdown open/close based on the clicked item
  toggleDropdown(id: string="") {
    // this.activeDropdown = this.activeDropdown === id ? null : id;
  }
  loadBusinessCards(bussineesCard: IBusinessCard) {
    this.bussineesCard = bussineesCard;
    this.openModel();
  }
  exportBusinessCardAsCsv(bussineesCard: IBusinessCard) {
    // this.bussineesCard = bussineesCard;
    // this.openModel();
  }
  exportBusinessCardAsXml(bussineesCard: IBusinessCard) {
    // this.bussineesCard = bussineesCard;
    // this.openModel();
  }


  deleteBusinessCard(id: string ="") {
    this.BusinessCardservice.deleteBusinessCard(id).subscribe({
      next: (response) => {
        this.toastr.success(response.message);
        this.getAllBusinessCards();
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
