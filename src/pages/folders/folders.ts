import { Component } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Dropbox } from '../../providers/dropbox';
import {Items} from "../items/items";

@Component({
  selector: 'page-folders',
  templateUrl: 'folders.html',
  providers: [Dropbox]
})
export class Folders {

  depth: number = 0;
  folders: any;
  path_lower: any;
  img: any;
  accesstoken: string;
  itemsPage = Items;
  level: number = 0;

  constructor(public navCtrl: NavController, public dropbox: Dropbox, public loadingCtrl: LoadingController, public http: Http, public navParams: NavParams) {

    this.img = {};
    this.img.response = '';
    this.accesstoken = 'sBkG526oY1AAAAAAAAAACQGhbUFvvoU2gdYHwZ5SRBK4cTomj9oZVGPuIw_B8T5P';

  }

  ionViewDidLoad(){

    this.dropbox.setAccessToken(this.accesstoken);
    this.folders = [];

    let loading = this.loadingCtrl.create({
      content: 'Syncing from Dropbox...'
    });

    loading.present();

    this.dropbox.getFolders().subscribe(data => {
      this.folders = data.entries;
      this.level = this.level += 1;
      loading.dismiss();
    }, (err) => {
      console.log(err);
    });

  }

  openFolder(path){

    let loading = this.loadingCtrl.create({
      content: 'Syncing from Dropbox...'
    });

    loading.present();

    this.dropbox.getFolders(path).subscribe(data => {
      this.folders = data.entries;
      this.level = this.level += 1;

      for(let folder of this.folders) {

        if (folder.name == 'items.json')
          continue;

        /*if (folder['.tag'] == 'file' && folder.name != 'items.json') {

          this.path_lower = folder.path_lower;

        }*/

      }

      this.depth++;
      loading.dismiss();
    }, err => {
      console.log(err);
    });

  }

  goBack(){

    let loading = this.loadingCtrl.create({
      content: 'Syncing from Dropbox...'
    });

    loading.present();

    this.dropbox.goBackFolder().subscribe(data => {
      this.folders = data.entries;
      this.level = this.level -= 1;
      this.depth--;
      loading.dismiss();
    }, err => {
      console.log(err);
    });

  }

  itemTapped(name, path_lower) {
    this.navCtrl.push(Items, {name: name, path: path_lower});
  }

}
