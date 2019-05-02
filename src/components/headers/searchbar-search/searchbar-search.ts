import { Component, Input, ViewChild, HostListener, Output, EventEmitter } from '@angular/core'
import { ApiProvider } from '../../../providers/api/api';
import { SearchProvider } from '../../../providers/search/search';
import { Slides, Platform, IonicPage } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { ToastProvider } from '../../../providers/toast/toast';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

export interface SettingsInterface {
  search_query?: string,
  category?: number,
  featured_categories?: boolean,
  favorite_items?: boolean,
  offset?: number,
  location_lat?: number,
  location_lng?: number,
  location_name?: string
}
@IonicPage()
@Component({
  selector: 'head-searchbar-search',
  templateUrl: 'searchbar-search.html'
})
export class SearchbarSearchComponent {
  
  @Input() categoriesVisibility: boolean = false;
  @Input() inResultPage: boolean = false;
  @Output() searchEvent = new EventEmitter<Array<Object>>();
  @ViewChild('searchField') searchInput;
  @ViewChild("customSlides") slides: Slides;

  @HostListener('window:resize', ['$event'])
    onResize(event){
      this.displayWidth = event.target.innerWidth;
      this.slideChanged();
    }

    lat: number;
    lng: number;

  constructor(
    private api: ApiProvider,
    private searchProvider: SearchProvider,
    private platform: Platform,
    private geo: Geolocation,
    private toast: ToastProvider,
    private navCtrl: NavController,
    private locationAccuracy: LocationAccuracy
  ) { 
    this.platform.ready().then((readySource) => {
      this.displayWidth = this.platform.width() - 75;
    });

    this.loadCategories();
    this.localeSearch = this.searchProvider.localeState;
    if(!this.localeSearch) this.loadingLocation = false;
    
    this.searchProvider.updateLocationTrigger.subscribe( val => {
      this.localeSearch = val;
      if(!this.localeSearch) this.loadingLocation = false;
    } );
    this.searchProvider.updateCoordsTrigger.subscribe( val => {
      if(val.lat && val.lng){
        this.lat = val.lat;
        this.lng = val.lng;
      }else{
        this.lat = undefined;
        this.lng = undefined;
      }
    } );
    this.searchProvider.updateSearchQuery.subscribe( val => {
      this.searchRequest = val;
    } );
  }

  searchRequest:string;
  settings: SettingsInterface = {};
  displayWidth;
  slideButtons;
  localeSearch: boolean = false;

  spaceBetween = 10;
  mySlidesPerView: number = 3;
  selectedCategory: number;

  categories:Array<{
    id?: number,
    name: string,
    icon?: string,
    selected?: boolean
  }> = []

  loadingLocation: boolean = false;

  addCategoryToSearch(category) {
    if (category.id === this.searchProvider.PARAMS_SEARCH["category"]) {
      this.searchProvider.deleteSearchParam("category");
      this.selectedCategory = null;
      this.searchProvider.searchParamsChangePromise({}, false).then(result => {
      });
      let active = this.navCtrl.getActive();
      if(active.id !== "SearchResultsPage"){
        this.navCtrl.push("SearchResultsPage");
      }else{
        this.searchProvider.reloadResultsPage.emit(true);
      }
    }
    else {
      this.searchProvider.searchParamsChangePromise({ category:category.id }, false).then(result => {
        this.selectedCategory = category.id;
      });
      let active = this.navCtrl.getActive();
      if(active.id !== "SearchResultsPage"){
        this.navCtrl.push("SearchResultsPage");
      }else{
        this.searchProvider.reloadResultsPage.emit(true);
      }
    }
  }

  loadCategories() {
    try {
      this.api.invokeMethod("contentcategories", {}, false).subscribe(categories => {
        if (categories.data) {
          if(this.inResultPage){
            this.categories = categories.data.list
            .map(cat => {
              return { 
                id: cat.id,
                name:cat.title, 
                icon:"star-outline",
              }
            });
          }else{
            this.categories = categories.data.list
            .filter(cat => cat.is_featured)
            .map(cat => {
              return { 
                id: cat.id,
                name:cat.title, 
                icon:"star-outline",
              }
            });
          }
         }
      })
    } catch (error) {
        console.log(">> [DEALCENTIVE] Search Page failed to load initial categories: ", error);
    }
  }

  // [ SLIDER ]
  slideChanged() {
    if (this.slides) {
      let percents = this.initAdaptiveSlider(this.slides, this.displayWidth, this.categories, {spaceBetween: 10}).percent;
      if (-percents > 95) this.goToFirstSlide();
      this.mySlidesPerView = this.initAdaptiveSlider(this.slides, this.displayWidth, this.categories, {spaceBetween: 10}).coefficient;
    }
  }

  initAdaptiveSlider(slider, deviceDisplay:number, items:Array<Object>, standartSliderParameters: {spaceBetween:number}){
    let _totalVirtualWidth = 0;
    let sliderBarMargin = 17;
    let _slideItems = slider._slides;     // local
    let _translation = slider._translate;
    let virtualSizes = [];

    _slideItems.forEach(element => {
      var _wid;
      if (element.getBoundingClientRect().width ) _wid = element.getBoundingClientRect().width;
      else _wid = element.clientWidth;
      virtualSizes.push(_wid);
      _totalVirtualWidth += (_wid);
    })
    let totalBordersValue = _slideItems.length * 2;
    let _marginsBetweenButtons = standartSliderParameters.spaceBetween * (items.length-1);
    _totalVirtualWidth += _marginsBetweenButtons;
    slider._wrapper.style.width = `${_totalVirtualWidth}px`;
    let percentsDone = (_translation)/(_totalVirtualWidth + _marginsBetweenButtons)*100;
    setTimeout(() => {
      this.slides.update();
    }, 100);
    return {
      coefficient: (this.displayWidth  - sliderBarMargin ) / ((_totalVirtualWidth + totalBordersValue)/this.categories.length), 
      percent: percentsDone
    };

  }
  goToFirstSlide(){
    this.slides.slideTo(0, 500);
  }
  // [ SEARCH ]
  fireSearchOnEnter(event = {keyCode: 13}) {
    if(this.loadingLocation) return;
    if(event.keyCode === 13) {
      if (this.searchRequest && this.searchRequest.length > 0) {
        this.settings.search_query = this.searchRequest;    // add search query
      }
      else {
        delete this.settings.search_query;                                     // else delete it
        this.searchProvider.deleteSearchParam('search_query');
      }
      if (this.localeSearch === true && this.lng) {
          this.settings.location_lat = this.lat;
          this.settings.location_lng = this.lng;
          this.searchProvider.searchParamsChangePromise(this.settings, "Searching nearby items...").then(result => {
              let active = this.navCtrl.getActive();
              if(active.id !== "SearchResultsPage"){
                this.navCtrl.push("SearchResultsPage");
              }else{
                this.searchProvider.reloadResultsPage.emit(true);
              }
          });
      } 
      else {
        this.settings.location_lat = undefined;
        this.settings.location_lng = undefined;
        this.searchProvider.searchParamsChangePromise(this.settings, "Searching...").then(result => {
            let active = this.navCtrl.getActive();
            if(active.id !== "SearchResultsPage"){
              this.navCtrl.push("SearchResultsPage");
            }else{
              this.searchProvider.reloadResultsPage.emit(true);
            }
          })
      }
    }
  }

  switchLocale() {
    this.localeSearch = !this.localeSearch;
    this.searchProvider.updateLocationTrigger.emit( this.localeSearch );
    if(this.localeSearch){
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
        // if(canRequest) {
          this.loadingLocation = true;
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            () =>{
              this.geo.getCurrentPosition().then((resp) => {
                  this.lat = resp.coords.latitude;
                  this.lng = resp.coords.longitude;
                  this.searchProvider.updateCoordsTrigger.emit( {lat: resp.coords.latitude , lng: resp.coords.longitude} );
                  this.loadingLocation = false;
                }, (error) => {
                  this.toast.presentToast(`Sorry, but we can't get your location. Problem: "${error.message}".`);
                  this.localeSearch = false;
                  this.searchProvider.updateLocationTrigger.emit( false );
                  this.searchProvider.updateCoordsTrigger.emit( {lat: undefined , lng: undefined} );
                  this.loadingLocation = false;
                })
            },
            error => { this.loadingLocation = false; this.localeSearch = false; console.log('Error requesting location permissions', error) }
          );
        // }
      });
    }else{
      this.loadingLocation = false;
    }
  }

}