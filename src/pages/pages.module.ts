import { NgModule } from '@angular/core';
import { FeaturedPageModule } from "./featured/featured.module";
import { SearchResultsPageModule } from './search-results/search-results.module'
import { SearchPageModule } from "./search/search.module";
import { NotificationsPageModule } from './notifications/notifications.module';
import { SavedPageModule } from './saved/saved.module';
import { MenuPageModule } from './menu-tab-page/menu-page.module';
import { LoginPageModule } from './login/login.module';
import { SignUpPageModule } from './sign-up/sign-up.module';
import { AuthPageModule } from './auth/auth.module';
import { ConfirmationCodePageModule } from './confirmation-code/confirmation-code.module';
import { FavoriteCategoriesPageModule } from './favorite-categories/favorite-categories.module';
import { SocialConnectPageModule } from './social-connect/social-connect.module';
import { PostedContentPageModule } from './posted-content/posted-content.module';
import { LeadsPageModule } from './leads/leads.module';
import { ProductPageModule } from './product/product.module';
import { ShareSinglePageModule } from './share-single-page/share-single-page.module';
import { PreshareSocialConnectModule } from './preshare-social-connect/preshare-social-connect.module';

import { PointsPageModule } from './points/points.module';
import { RewardsPageModule } from './rewards/rewards.module';
import { NoConnectionPageModule } from './no-connection/no-connection.module';
import { PhoneContactsModule } from './phone-contacts/phone-contacts.module';

import { SuperTabsModule } from 'ionic2-super-tabs';

@NgModule({
    declarations: [],
    imports: [
        SearchPageModule,
        FeaturedPageModule,
        SearchResultsPageModule,
        NotificationsPageModule,
        SavedPageModule,
        MenuPageModule,
        LoginPageModule,
        ShareSinglePageModule,
        SignUpPageModule,
        AuthPageModule,
        ConfirmationCodePageModule,
        FavoriteCategoriesPageModule,
        SocialConnectPageModule,
        PostedContentPageModule,
        LeadsPageModule,
        ProductPageModule,
        PointsPageModule,
        RewardsPageModule,
        NoConnectionPageModule,
        PreshareSocialConnectModule,
        SuperTabsModule,
        PhoneContactsModule
    ]    
  })
  export class PagesModule {}
