import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StationRadlistePage } from './station-radliste';

@NgModule({
  declarations: [
    StationRadlistePage,
  ],
  imports: [
    IonicPageModule.forChild(StationRadlistePage),
  ],
})
export class StationRadlistePageModule {}
