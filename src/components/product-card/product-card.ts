import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ApiProvider } from '../../providers/api/api';

@Component({
  selector: 'product-card',
  templateUrl: 'product-card.html'
})
export class ProductCardComponent {
  @Input() card: any;
  
  objectKeys = Object.keys;
  userInfo: any;
  cardShare: any;
  socialLogoNames = {
    email: { name:"mail", color: "#c92c19" },
    fbexternal: { name:"flag", color: "#4e71a8" },
    facebook: { name:"logo-facebook", color: "#4e71a8" },
    linkedin: { name:"logo-linkedin", color: "#1686b0" },
    sms: { name:"dealcentive-sms", color: "#5aba51" },
    twitter: { name:"logo-twitter", color: "#1cb7eb" },
    whatsapp: { name:"logo-whatsapp", color: "#2cb742" }
  }
  loadingSocial: boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private aib: InAppBrowser,
    private socialSharing: SocialSharing,
    public api: ApiProvider
  ) {}

  openProductPage(card) {
    this.navCtrl.push("ProductPage", { card: card });
  }

  shareProduct(name) {
    if(this.loadingSocial) return;
    this.loadingSocial = true;
    let links = {};
    this.cardShare = this.card;
    links = this.card.shareable_url;
    this.api.invokeMethod("myinfo", {}).subscribe(response => {
      if (response.success){
        this.userInfo = response.data;
        if (name && links) {
          if (links[name]) {
            this.shareSocial(name, links[name]);
          }
          else{
            this.shareSocial(name, links['default']);
          }
        }
      }
    this.loadingSocial = false;
  });

  }

  shareSocial(name: string, link: string): void{
    let sharedText = this.cardShare.share_text[name];
    switch(name){
      case 'fbexternal':
        sharedText = this.cardShare.share_text['default'];
        this.socialSharing.shareViaFacebook(sharedText, this.card.image , link);
      break;
      case 'email':
        let subject = (this.cardShare.share_text.email_subject) ? this.cardShare.share_text.email_subject : '';
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
    let campaign = this.cardShare.id;
    let preview = {
      image: this.cardShare.image,
      title: this.cardShare.title
    }
    let twitterLength = this.cardShare.twitter_max_length;
    this.navCtrl.push("ShareSinglePage", { 
      settings: {type, text, link, title, campaign, twitterLength}, 
      preview: preview });
  }

  preshareSocialConnect(type, text, link, title){
    let campaign = this.cardShare.id;
    let preview = {
      image: this.cardShare.image,
      title: this.cardShare.title
    }
    let twitterLength = this.cardShare.twitter_max_length;
    this.navCtrl.push("PreshareSocialConnect", { 
      settings: {type, text, link, title, campaign, twitterLength}, 
      preview: preview });
  }
}
