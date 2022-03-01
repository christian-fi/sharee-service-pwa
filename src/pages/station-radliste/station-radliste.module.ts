// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) Christian Fischer, TeilRad GmbH
//
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
