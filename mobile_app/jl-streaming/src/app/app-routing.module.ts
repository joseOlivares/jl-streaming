import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./camera/camera.module').then(m=>m.CameraPageModule)
    //Quitamos home para no mostrar los tabs inferiores
    //loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'camera',
    loadChildren: () => import('./camera/camera.module').then(m=>m.CameraPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
