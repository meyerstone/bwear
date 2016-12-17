import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { Dropbox } from '../../providers/dropbox';

@Component({
  selector: 'page-items',
  templateUrl: 'items.html',
  providers: [Dropbox]
})
export class Items {

  items: any;
  itemsName: any;
  itemsPath: any;
  itemsjsonlink: any;
  sharedlinks: any;
  accesstoken: string;

  constructor(public navCtrl: NavController, public params: NavParams, public dropbox: Dropbox, public loadingCtrl: LoadingController, public http: Http) {

    this.itemsName = this.params.get('name');
    this.itemsPath = this.params.get('path');
    this.accesstoken = 'sBkG526oY1AAAAAAAAAACQGhbUFvvoU2gdYHwZ5SRBK4cTomj9oZVGPuIw_B8T5P';

  }

  ionViewDidLoad() {

    this.dropbox.setAccessToken(this.accesstoken);

    let loading = this.loadingCtrl.create({
      content: 'Syncing from Dropbox...'
    });
    loading.present();


    this.dropbox.getItemsJsonSharedlink(this.itemsPath + '/items.json').subscribe(data => {
      this.sharedlinks = data.links;
      loading.dismiss();

      for(let link of this.sharedlinks) {

        let pattern = /www.dropbox.com/i;
        this.itemsjsonlink = link.url.replace( pattern, "dl.dropboxusercontent.com" );

        this.getItems(this.itemsjsonlink).subscribe(data => {
          this.items = data;
          console.log(this.items);
        }, (err) => {
          console.log(err);
        });;

      }

    }, (err) => {
      loading.dismiss();
      console.log(err);
    });

  }

  getItems(link) {

    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.post(link, {headers: headers})
      .map(res => res.json());

  }

}
