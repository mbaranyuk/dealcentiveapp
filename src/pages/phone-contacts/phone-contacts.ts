import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Contacts } from '@ionic-native/contacts';

@IonicPage()
@Component({
  selector: 'phone-contacts',
  templateUrl: 'phone-contacts.html',
})
export class PhoneContacts {

  settings: any = {};
  loading: boolean = false;
  contactsArray: any = [];
  contactsSorted: any = {};
  objectKeys: any[] = [];
  searchQuery: string = '';
  loadedContacts: any[] = [];
  showPhones: boolean = false;
  itemPhones: any = {};
  @ViewChild('searchField') searchField;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private socialSharing: SocialSharing,
    private contacts: Contacts){
  }

  ionViewWillEnter(){
    this.loading = true;
    this.settings = this.navParams.get('settings');
    this.contacts.find(['displayName', 'name'], {filter: "", multiple: true})
    .then(data => {
      this.loading = false;
      this.contactsArray = data.map( item => {
        let contact = {
          name: (item.name && item.name.formatted) ? item.name.formatted : item.displayName ? item.displayName : item.name.formatted,
          phone: (item.phoneNumbers && item.phoneNumbers.length>0) ? item.phoneNumbers[0].value : '',
          phoneNumbers: item.phoneNumbers
        };
        return contact;
      } );
      this.loadedContacts = this.contactsArray;

      this.contactsArray.sort(function(a, b){
        if(a.name < b.name) { return -1; }
        if(a.name > b.name) { return 1; }
        return 0;
      });
      
      this.contactsArray.forEach(element => {
        let firstLetter = element.name[0].toLowerCase();
        if(this.contactsSorted[firstLetter]){
          this.contactsSorted[firstLetter].push(element);
        }else{
          this.contactsSorted[firstLetter] = [element];
          this.objectKeys.push(firstLetter);
        }
      });
    });
   
  }

  ionViewWillLeave(){
    this.leaveToSearch();
  }

  notFound():boolean {
    let res = true;
    this.objectKeys.forEach( block => {
      let resp = this.findInBlock(this.contactsSorted[block]);
      if( resp ) res = false;
    } );
    return res;
  }

  leaveToSearch(){
    let active = this.navCtrl.isTransitioning();
    if(!active) this.navCtrl.goToRoot({animate: false});
  }

  shareMessage(item){
    if(item && item.phoneNumbers && item.phoneNumbers.length>1){
      this.itemPhones = item;
      this.showPhones = true;
    }else{
      let phone = item.phone;
      this.socialSharing.shareViaSMS(this.settings.sharedText, phone);
    }
  }

  clear(){
    this.searchQuery = '';
  }

  findInBlock(block):boolean {
    let res = false;
    block.forEach( item => {
      if(this.findInItem(item)){
        res = true;
      }
    } );
    return res;
  }

  findInItem(item):boolean {
    let query = this.searchQuery;
    if( item.name.toLowerCase().indexOf( query.toLowerCase() ) == -1 && item.phone.toLowerCase().indexOf( query.toLowerCase() ) == -1 ) {
      return false;
    }
    return true;
  }

  hideDialog(){
    this.itemPhones = {};
    this.showPhones = false;
  }

  sendToNum(num){
    this.socialSharing.shareViaSMS(this.settings.sharedText, num);
  }


}
