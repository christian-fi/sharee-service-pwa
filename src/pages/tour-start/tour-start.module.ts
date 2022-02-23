import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TourStartPage } from './tour-start';

@NgModule({
  declarations: [
    TourStartPage,
  ],
  imports: [
    IonicPageModule.forChild(TourStartPage),
  ],
})
export class TourStartPageModule {}

