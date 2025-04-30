import { AfterViewInit, Component, effect, ElementRef, signal, viewChild } from '@angular/core';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
import { environment } from '../../../environments/environment.development';
import { DecimalPipe, JsonPipe } from '@angular/common';

mapboxgl.accessToken = environment.mapboxKey;

@Component({
  selector: 'app-fullscreen-map-page',
  imports: [DecimalPipe, JsonPipe],
  templateUrl: './fullscreen-map-page.component.html',
  styles: `
    div{
      width: 100vw;
      height: calc(100vh - 64px);
    }

    #controls {
      background-color: white;
      padding: 10px;
      border-radius: 5px;
      position: fixed;
      bottom: 25px;
      right: 20pX;
      z-index: 9999;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      border: 1px solid #e2e8f0;
      width: 250px;
    }
  `,
})
export class FullscreenMapPageComponent implements AfterViewInit{
  divElement = viewChild<ElementRef>('map');

  map = signal<mapboxgl.Map | null>(null);

  zoom = signal(14);


  cordinates = signal( {
    lng: -3.701,
    lat: 40.417
  });



  ngAfterViewInit() {

    const {lng, lat } = this.cordinates();
    const map = new mapboxgl.Map({
      container: this.divElement()?.nativeElement , // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [lng, lat], // starting position [lng, lat]
      zoom: this.zoom(), // starting zoom
    });

    this.mapListeners(map);

  }

// para que se mueva el zoom con la barrita de abajo
  zoomEffect = effect( () => {
    if( !this.map()) return;

    this.map()?.zoomTo( this.zoom());
  });


  mapListeners( map: mapboxgl.Map) {


    // para que se mueva la barrita de abajo
    // conforme quito zoom con el ratón
    map.on('zoomend', (event) => {
      const newZoom = event.target.getZoom();
      this.zoom.set(newZoom);
    });

// cuando termino de mover me actualiza el centro
    map.on('moveend', () => {
      const center = map.getCenter();
      this.cordinates.set(center);
    })


    map.addControl( new mapboxgl.FullscreenControl);
    map.addControl( new mapboxgl.NavigationControl);
    map.addControl( new mapboxgl.GeolocateControl);
    map.addControl( new mapboxgl.ScaleControl);


    this.map.set(map);

  }


  


}
