import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EquipmentPage } from './equipment.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: EquipmentPage,
    children:[
      {
        path: 'discover',
        children:[
                   {
                     path:'',
                     loadChildren: () => import('./discover/discover.module').then( m => m.DiscoverPageModule)
                   },
                   {
                     path:':equipmentId',
                     loadChildren:() => import('./discover/equipment-detail/equipment-detail.module').then(m =>m.EquipmentDetailPageModule)
                    }
        
                ]
      },
      {
        path: 'offers',
        children:[
                  {   path:'',
                      loadChildren: () => import('./offers/offers.module').then( m => m.OffersPageModule)
                  },
                  {
                    path:'new-offer',
                    loadChildren: () => import('./offers/new-offer/new-offer.module').then(m => m.NewOfferPageModule)
                  },
                
                  {
                    path:'edit/:equipmentId',
                    loadChildren: () => import('./offers/edit-offer/edit-offer.module').then(m => m.EditOfferPageModule)
                  }
                  
                ]
      },
     {
      path: 'profile',
      children:[
                 {
                   path:'',
                   loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
                 }
      
               ]
              },
              {
                path: 'messaging',
                children:[
                           {
                             path:'',
                             loadChildren: () => import('./messaging/messaging.module').then( m => m.MessagingPageModule)
                           }
                
                         ]
                        },
      {
        path:'',
        redirectTo:'/equipment/tabs/discover',
        pathMatch:'full'
     }
    ] 

  }, 
       {
         path:'',
         redirectTo:'/equipment/tabs/discover',
         pathMatch:'full'
       },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EquipmentPageRoutingModule {}
