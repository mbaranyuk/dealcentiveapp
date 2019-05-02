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
  selector: 'head-searchbar',
  templateUrl: 'searchbar.html'
})
export class SearchbarComponent {
  
  @Input() categoriesVisibility: boolean = false;
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
      this.displayWidth = this.platform.width();
    });

    this.loadCategories();

    if(this.searchProvider.PARAMS_FEATURED["category"]) {
      this.selectedCategory = this.searchProvider.PARAMS_FEATURED["category"];
      this.addCategoryToSearch(this.selectedCategory);
    }

    this.searchProvider.onNeedToRefresh.subscribe(x => {
      this.loadCategories();
    });
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
  }> = [];

  loadingLocation: boolean = false;

  addCategoryToSearch(category) {
    if (category.id === this.searchProvider.PARAMS_FEATURED["category"]) {
      this.searchProvider.deleteFeaturedParam("category");
      this.selectedCategory = null;
      this.searchProvider.featuredParamsChangePromise({}, false).then(result => {
        result.subscribe(response => { this.searchEvent.emit(response.data.list) });
      });
    }
    else {
      this.searchProvider.featuredParamsChangePromise({ category:category.id }, false).then(result => {
        result.subscribe(response => { this.searchEvent.emit(response.data.list) });
        this.selectedCategory = category.id;
      });
      if (this.navCtrl.parent.slideTo) this.navCtrl.parent.slideTo(0);
    }
  }

  loadCategories() {
    try {
      this.api.invokeMethod("contentcategories", {
      }, false).subscribe(categories => {
        if (categories.data) {
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
    let _slideItems = slider._slides;
    let _translation = slider._translate;
    let virtualSizes = [];
    _slideItems.forEach(element => {
      var _wid;
      if (element.getBoundingClientRect().width ) _wid = element.getBoundingClientRect().width;
      else _wid = element.clientWidth;
      virtualSizes.push(_wid);
      _totalVirtualWidth += (_wid);
    });
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
        this.settings.search_query = this.searchRequest;
      }
      else {
        delete this.settings.search_query;
        this.searchProvider.deleteFeaturedParam('search_query');
      }
      if (this.localeSearch === true && this.lng) {
          this.settings.location_lat = this.lat;
          this.settings.location_lng = this.lng;
          this.settings.featured_categories = true;
          this.searchProvider.featuredParamsChangePromise(this.settings, "Searching nearby items...").then(result => {
            result.subscribe(response => {
              if(response.data) this.searchEvent.emit(response.data.list)
              if (this.navCtrl.parent.slideTo) this.navCtrl.parent.slideTo(0);
            })
          });
      } 
      else {
        this.settings.location_lat = undefined;
        this.settings.location_lng = undefined;
        this.searchProvider.featuredParamsChangePromise(this.settings, "Searching...").then(result => {
          result.subscribe(response => {
            if(response.data) this.searchEvent.emit(response.data.list); 
            if (this.navCtrl.parent.slideTo) this.navCtrl.parent.slideTo(0);
          })
        });
      }
    }
  }
  search(params, msg?) {
    return this.api.invokeMethod("contentlist", params, msg);
  }
  switchLocale() {
    this.localeSearch = !this.localeSearch;
    if(this.localeSearch){
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
        // if(canRequest) {
          this.loadingLocation = true;
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            () =>{
              this.geo.getCurrentPosition().then((resp) => {
                console.log('resp', resp);
                  this.lat = resp.coords.latitude;
                  this.lng = resp.coords.longitude;
                  this.loadingLocation = false;
                }, (error) => {
                  this.toast.presentToast(`Sorry, but we can't get your location. Problem: "${error.message}".`);
                  this.localeSearch = false;
                  this.loadingLocation = false;
                })
            },
            error => {  this.loadingLocation = false; this.localeSearch = false; console.log('Error requesting location permissions', error) }
          );
        // }
      });
    }else{
      this.loadingLocation = false;
    }
  }
}