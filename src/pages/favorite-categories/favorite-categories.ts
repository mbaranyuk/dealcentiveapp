import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ApiProvider } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-favorite-categories',
  templateUrl: 'favorite-categories.html',
})
export class FavoriteCategoriesPage {
  categories: any = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private api: ApiProvider) {
      this.loadCategories();
  }

  loadCategories() {
    this.api.invokeMethod('contentcategories', {}).subscribe((res: any) => {
      if (res && res.error_code) {
        console.log('>>>e', res);
      } else {
        this.categories = res.data.list;
        for (const cat of this.categories) {
          cat.added = cat.is_featured;
        }
      }
    });
  }

  addToFeatured(category: any) {
    this.api.invokeMethod('setfeaturedctg', {category: category.id}).subscribe((res: any) => {
      if (res && res.error_code) {
        console.log('>>>e', res.error_message);
      } else {
        category.added = true;
      }
    });
  }

  removeFromFeatured(category: any) {
    this.api.invokeMethod('unsetfeaturedctg', {category: category.id}).subscribe((res: any) => {
      if (res && res.error_code) {
        console.log('>>>e', res.error_message);
      } else {
        category.added = false;
      }
    });
  }

  processFeatured(category) {
    if (category.added) {
      this.addToFeatured(category);
    } else {
      this.removeFromFeatured(category);
    }
  }

  isAnyAdded() {
    return this.categories.some((item) => {
      return item.added;
    })
  }

  goToSocial() {
    this.navCtrl.push("SocialConnectPage");
    for (const cat of this.categories) {
      this.processFeatured(cat);
    }
  }
  goToFeatured() {
    for (const cat of this.categories) {
      this.processFeatured(cat);
    }
    if(this.navCtrl.canGoBack) {
      this.navCtrl.popToRoot();
    }
    else console.error(">> [DEALCENTIVE] Nav error: Can't go back");
  }

}
