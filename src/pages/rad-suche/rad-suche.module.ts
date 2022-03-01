// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) Christian Fischer, TeilRad GmbH
//
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
