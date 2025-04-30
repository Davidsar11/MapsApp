import { Component, inject } from '@angular/core';
import { routes } from '../../../app.routes';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {

  router = inject(Router);


  routes = routes.map(route => ({
    path: route.path,
    title: `${route.title ?? 'Maps'}`,
  })).filter(route => route.path != '**');// coge todas las rutas

  pageTitle$ = this.router.events.pipe(
    filter(elm => elm instanceof NavigationEnd),
    map(event => event.url),
    map(elm => routes.find(route => `/${route.path}` === elm )?.title ),
  ); // coge el titulo de la ruta activa


}
