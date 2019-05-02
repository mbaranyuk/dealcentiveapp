import { Component } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;

@IonicPage()
@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {
  private mapElement: ElementRef;

  @ViewChild('map') set content(content: ElementRef) {
    this.mapElement = content;
  }
  map: any;

  card = this.navParams.get('card');
  objectKeys = Object.keys;
  liked:boolean = this.card.is_favorite;
  loadedMap: boolean = false;
  deniedGeo:boolean = false;

  socialLogoNames = {
    email: { name:"mail", color: "#c92c19" },
    fbexternal: { name:"flag", color: "#4e71a8" },
    facebook: { name:"logo-facebook", color: "#4e71a8" },
    linkedin: { name:"logo-linkedin", color: "#1686b0" },
    sms: { name:"dealcentive-sms", color: "#5aba51" },
    twitter: { name:"logo-twitter", color: "#1cb7eb" },
    whatsapp: { name:"logo-whatsapp", color: "#2cb742" },
    whataspp: { name:"logo-whatsapp", color: "#2cb742" },
  }

  userInfo: any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public api: ApiProvider,
    private aib: InAppBrowser,
    public geolocation: Geolocation,
    private socialSharing: SocialSharing
    ) {}
  
  ionViewWillEnter(){
    this.api.invokeMethod("contentinfo", {id: this.navParams.get('card').id}).subscribe(card => {
      this.card = card.data;
      this.liked = card.data.is_favorite;
      if (this.card.has_geocoordinates) {
        var latLng = [this.card.geocoordinates.lat, this.card.geocoordinates.lng];
          this.loadMap(latLng)
        .then(() => {
          this.addMarker(this.card.geocoordinates, this.card.company.title);
          var currCenter = this.map.getCenter();
          google.maps.event.trigger(this.map, 'resize');
          this.map.setCenter(currCenter);
        })
      }
    });
    this.api.invokeMethod("myinfo", {}).subscribe(response => {
      if (response.success) this.userInfo = response.data;
    });
  }

  loadMap([ center_lat, center_lon ]:any = []){
    return new Promise((resolve, reject) => {
      this.loadedMap = false;
        let latLng;
        if (center_lat && center_lon) {
          latLng = new google.maps.LatLng(center_lat, center_lon);
          let mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };
          if (this.mapElement) {
            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
            this.loadedMap = true;
            resolve();
          }
        }
    })
  }

  addMarker(coords?:any, title:string = ""){
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });
    let content = title;         
    if (content) this.addInfoWindow(marker, content);
  }

  addInfoWindow(marker, content){
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }
  setFav() {
    this.liked = !this.liked;
    if(this.liked === true) {
      this.api.invokeMethod("setfavoriteitem", {item: this.card.id}).subscribe();
      this.liked = true;
    }
    else this.api.invokeMethod("unsetfavoriteitem", {item: this.card.id}).subscribe();
  }

  openBrowser(){
    const browser = this.aib.create( this.card.payable ? this.card.payment_page : this.card.offer_page, '_blank', {location: 'no', hideurlbar: 'no', hidenavigationbuttons: 'no'});
    browser.show();
  }

  shareProduct(name, links: Object) {
    if (name && links) {
      if (links[name]) {
        this.shareSocial(name, links[name]);
      }
      else{
        this.shareSocial(name, links['default']);
      }
    }
  }

  shareSocial(name: string, link: string): void{
    let sharedText = this.card.share_text[name];
    switch(name){
      case 'fbexternal':
        sharedText = this.card.share_text['default'];
        this.socialSharing.shareViaFacebook(sharedText, this.card.image , link);
      break;
      case 'email':
      let subject = (this.card.share_text.email_subject) ? this.card.share_text.email_subject : '';
      this.socialSharing.shareViaEmail(sharedText, subject, ['']);
      break;
      case 'facebook':{
        if(this.userInfo.facebook_connected){
        this.openSharePage( 'fb_p', sharedText, link, 'Facebook');
        }else{
          this.preshareSocialConnect('fb_p', sharedText, link, 'Facebook');
        }
      }
      break;
      case 'linkedin':{  
        if(this.userInfo.linkedin_connected){
          this.openSharePage( 'li', sharedText, link, 'LinkedIn');
        }else{
          this.preshareSocialConnect('li', sharedText, link, 'LinkedIn');
        }
      }
      break;
      case 'sms':{
        this.navCtrl.push("PhoneContacts", { 
          settings: {sharedText, link}
        });
      }
      break;
      case 'twitter':{
        if(this.userInfo.twitter_connected){
          this.openSharePage( 'tw', sharedText, link, 'Twitter');
        }else{
          this.preshareSocialConnect('tw', sharedText, link, 'Twitter');
        }
      }
      break;
      case 'whatsapp':{
        let sharedUrl = `https://wa.me/?text=${sharedText}`;
        this.aib.create(sharedUrl, "_system", {location: 'no', hideurlbar: 'no', hidenavigationbuttons: 'no'});
      }
      break;
      case 'whataspp':{
        let sharedUrl = `https://wa.me/?text=${sharedText}`;
        this.aib.create(sharedUrl, "_system", {location: 'no', hideurlbar: 'no', hidenavigationbuttons: 'no'});
      }
      break;
    }
  }

  openSharePage(type, text, link, title){
    let campaign = this.card.id;
    let preview = {
      image: this.card.image,
      title: this.card.title
    }
    let twitterLength = this.card.twitter_max_length;
    this.navCtrl.push("ShareSinglePage", { 
      settings: {type, text, link, title, campaign, twitterLength}, 
      preview: preview });
  }

  preshareSocialConnect(type, text, link, title){
    let campaign = this.card.id;
    let preview = {
      image: this.card.image,
      title: this.card.title
    }
    let twitterLength = this.card.twitter_max_length;
    this.navCtrl.push("PreshareSocialConnect", { 
      settings: {type, text, link, title, campaign, twitterLength}, 
      preview: preview });
  }

}
