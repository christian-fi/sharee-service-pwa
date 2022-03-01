// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) Christian Fischer, TeilRad GmbH
//
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RadServicePage } from './rad-service';

@NgModule({
  declarations: [
    RadServicePage,
  ],
  imports: [
    IonicPageModule.forChild(RadServicePage),
  ],
})
export class RadServicePageModule {}
