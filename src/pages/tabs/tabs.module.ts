// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (c) Christian Fischer, TeilRad GmbH
//
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { TabsPage } from './tabs';

@NgModule({
  declarations: [
    TabsPage,
  ],
  imports: [
    IonicPageModule.forChild(TabsPage)
    ],
  exports: [
    TabsPage
  ]
})
export class TabsPageModule { }
