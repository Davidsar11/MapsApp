import { Component, ElementRef, input, signal, viewChild } from '@angular/core';
import { HouseProperty } from '../../interfaces/property.interface';
import mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-mini-map',
  imports: [],
  templateUrl: './mini-map.component.html',
})
export class MiniMapComponent {

  item = input.required<HouseProperty>();
  i = input.required<number>();


  divElement = viewChild<ElementRef>('mapa');

  map = signal<mapboxgl.Map | null>(null);



  ngAfterViewInit() {
    const map = new mapboxgl.Map({
      container: this.divElement()?.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.item().lngLat, // starting position [lng, lat]
      zoom: 15, // starting zoom
      interactive: false,
    });

    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );

    const marker = new mapboxgl.Marker({
      color: color,
    })
      .setLngLat(this.item().lngLat)
      .addTo(map);
    map.addControl( new mapboxgl.NavigationControl);


    this.map.set(map);
  }

}
