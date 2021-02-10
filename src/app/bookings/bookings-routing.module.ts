import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookingsPage } from './bookings.page';

const routes: Routes = [
  {
    path: '',
    component: BookingsPage
  },
  {
    path: 'booking-details',
    loadChildren: () => import('./booking-details/booking-details.module').then( m => m.BookingDetailsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingsPageRoutingModule {}
