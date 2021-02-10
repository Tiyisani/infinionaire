import { NgModule ,LOCALE_ID} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EquipmentDetailPageRoutingModule } from './equipment-detail-routing.module';

import { EquipmentDetailPage } from './equipment-detail.page';
import { CreateBookingsComponent } from 'src/app/bookings/create-bookings/create-bookings.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarModule } from 'ion2-calendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EquipmentDetailPageRoutingModule,
    SharedModule,
    CalendarModule,
  ],
  declarations: [EquipmentDetailPage,CreateBookingsComponent],
  entryComponents:[CreateBookingsComponent],
  providers: [{ provide: LOCALE_ID, useValue: 'zh-CN' }]
})
export class EquipmentDetailPageModule {}
