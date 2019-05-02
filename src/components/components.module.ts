import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { SearchbarComponent } from './headers/searchbar/searchbar';
import { SearchbarSearchComponent } from './headers/searchbar-search/searchbar-search';
import { ProductCardComponent } from './product-card/product-card';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

@NgModule({
	declarations: [
		SearchbarComponent,
		SearchbarSearchComponent,
		ProductCardComponent,
	],
	imports: [
		IonicModule
	],
	exports: [
		SearchbarComponent,
		SearchbarSearchComponent,
		ProductCardComponent,
	],
	providers: [
		SearchbarComponent, 
		SearchbarSearchComponent,
		ProductCardComponent, 
		Geolocation,
		LocationAccuracy
	]
})
export class ComponentsModule {}
export { SearchbarComponent, SearchbarSearchComponent };
export { ProductCardComponent };

