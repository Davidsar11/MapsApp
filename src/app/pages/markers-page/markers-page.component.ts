import {
  AfterViewInit,
  Component,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import { environment } from '../../../environments/environment.development';
import mapboxgl, { LngLat, LngLatLike, Map } from 'mapbox-gl';
import { DecimalPipe } from '@angular/common';

mapboxgl.accessToken = environment.mapboxKey;



@Component({
  selector: 'app-markers-page',
  imports: [DecimalPipe],
  templateUrl: './markers-page.component.html',
})
export class MarkersPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');

  map = signal<mapboxgl.Map | null>(null);

  zoom = signal(14);

  markers = signal<mapboxgl.Marker[]>([]);

  cordinates = signal({
    lng: -3.701,
    lat: 40.417,
  });

  ngAfterViewInit() {
    const { lng, lat } = this.cordinates();
    const map = new mapboxgl.Map({
      container: this.divElement()?.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [lng, lat], // starting position [lng, lat]
      zoom: this.zoom(), // starting zoom
    });

    this.mapListeners(map);
  }

  mapListeners(map: mapboxgl.Map) {
    map.on('click', (event) => {
      this.mapClick(event);
    });

    this.map.set(map);
  }

  mapClick(evento: mapboxgl.MapMouseEvent) {

    if(this.isInArrayMarker(evento.lngLat)){
      console.log('esta')
      return;
    }

    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );

    const marker = new mapboxgl.Marker({
      color: color,
    })
      .setLngLat(evento.lngLat)
      .addTo(this.map()!);


    this.markers.set([...this.markers(), marker]);

  }


  isInArrayMarker(pos : LngLat){


    return this.markers().find(marker =>  {
      const mark = marker.getLngLat();
      return mark.lat === pos.lat && mark.lng === pos.lng
    });
    // return this.markers().find( m => m._lngLat == pos);
  }



  flyToMarker (lngLat: LngLatLike){
    if(!this.map()) return;

    this.map()?.flyTo({ center : lngLat});
  }


  deleteMarker(marker : mapboxgl.Marker){
    marker.remove();
    this.markers.set(  this.markers().filter(m => m._lngLat != marker._lngLat)  );
  }
}
