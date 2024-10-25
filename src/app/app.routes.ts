import { Routes } from '@angular/router';
import { BussineesCardComponent } from './pages/business-card/business-card.component';
import { FileImportComponent } from './pages/file-import/file-import.component';
import { BusinessCardsWrapperComponent } from './pages/business-cards-wrapper/business-cards-wrapper.component';

export const routes: Routes = [
  { path: '', component: BusinessCardsWrapperComponent },
  { path: 'import', component: FileImportComponent },
  { path: 'old', component: BussineesCardComponent },

];
