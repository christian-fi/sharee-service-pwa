// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) Christian Fischer, TeilRad GmbH
//
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

