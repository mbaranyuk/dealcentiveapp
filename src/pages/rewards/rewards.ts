import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { HelptextsProvider } from '../../providers/helptexts/helptexts';

@Component({
  templateUrl: 'reward_details.html',
})
export class RewardDetails {
  constructor(
    private params: NavParams, 
    public navCtrl: NavController, 
    private api: ApiProvider,
    private helptexts: HelptextsProvider
    ) {
      this.buttonTitle = this.helptexts.getText('rewards_claim_button');
      console.log(this.buttonTitle);
  }

  reward: object;
  company_points = this.params.data.company_points;
  company = this.params.data.company;
  gift = this.params.data.item;
  loading: boolean = false;
  buttonTitle: string;
  success: boolean = false;

  usePoints(id){
    if(this.loading) return;
    this.loading = true;
    this.api.invokeMethod("usepoints", {item: id}).subscribe(res => {
      if(res.data){
        this.loading = false;
        this.company.points = res.data.points_available;
        this.success = true;
      }else{
        this.loading = false;
        this.success = true;
      }
    });
  }

  moveBack(){
    this.navCtrl.getPrevious().data.company = this.company;
    this.navCtrl.pop();
  }
}

@Component({
  templateUrl: 'company_details.html',
})
export class CompanyDetails {
  company = this.params.data.item;
  gifts = [ ];
  loading: boolean = false;
  constructor(public navCtrl: NavController, private params: NavParams, private api: ApiProvider) {
    this.loading = true;
    this.api.invokeMethod("pointsstoreitems", {company: this.company.id}).subscribe(res => {
      this.gifts = res.data.list;
      this.loading = false;
    });
  }
  
  openNavDetailsPage(selectedGift){
    this.navCtrl.push(RewardDetails, { item: selectedGift, company_points: this.company.points, company: this.company });
  }
}

@IonicPage()
@Component({
  selector: 'page-rewards',
  templateUrl: 'rewards.html',
})
export class RewardsPage {

  loading = false;
  companies: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, private api: ApiProvider) {
    this.loading = true;
    this.api.invokeMethod("pointscompanies", {}).subscribe(res => {
      this.companies.list = res.data.list;
      this.loading = false;
    });
  }
  openNavDetailsPage(selected) {
    this.navCtrl.push(CompanyDetails, { item: selected });
  }

}
