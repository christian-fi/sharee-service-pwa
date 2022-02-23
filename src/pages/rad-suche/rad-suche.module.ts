import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RadSuchePage } from './rad-suche';

@NgModule({
  declarations: [
    RadSuchePage,
  ],
  imports: [
    IonicPageModule.forChild(RadSuchePage),
  ],
})
export class RadSuchePageModule {}
