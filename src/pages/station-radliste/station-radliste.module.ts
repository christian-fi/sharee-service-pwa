// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) Christian Fischer, TeilRad GmbH
//
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StationRadlistePage } from './station-radliste';

import {AutosizeModule} from 'ngx-autosize';

@NgModule({
  declarations: [
    StationRadlistePage,
  ],
  imports: [
    IonicPageModule.forChild(StationRadlistePage), AutosizeModule
  ],
})
export class StationRadlistePageModule {}
