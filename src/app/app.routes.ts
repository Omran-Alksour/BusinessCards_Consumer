import { Routes } from '@angular/router';
import { FileImportComponent } from './pages/file-import/file-import.component';
import { BusinessCardsWrapperComponent } from './pages/business-cards-wrapper/business-cards-wrapper.component';

export const routes: Routes = [
  { path: '', component: BusinessCardsWrapperComponent },
  { path: 'import', component: FileImportComponent },
];
