import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StationSuchePage } from './station-suche';

@NgModule({
  declarations: [
    StationSuchePage,
  ],
  imports: [
    IonicPageModule.forChild(StationSuchePage),
  ],
})
export class StationSuchePageModule {}
