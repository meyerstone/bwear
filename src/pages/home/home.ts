import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Dropbox } from '../../providers/dropbox';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [Dropbox]
})
export class Home {

  depth: number = 0;
  folders: any;
  path_lower: any;
  img: any;
  sharedlink: any;
  sharedlinks: any;
  nav: any;

  constructor(public navCtrl: NavController, public dropbox: Dropbox, public loadingCtrl: LoadingController, public http: Http) {

  }

  ionViewDidLoad(){

    this.dropbox.setAccessToken("sBkG526oY1AAAAAAAAAACQGhbUFvvoU2gdYHwZ5SRBK4cTomj9oZVGPuIw_B8T5P");
    this.folders = [];

    let loading = this.loadingCtrl.create({
      content: 'Syncing from Dropbox...'
    });

    loading.present();

    this.dropbox.getFolders().subscribe(data => {
      this.folders = data.entries;
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

      for(let folder of this.folders) {

        if (folder.name == 'items.json')
          continue;

        console.log(folder);

        if (folder['.tag'] == 'file' && folder.name != 'items.json') {

          this.path_lower = folder.path_lower;
          this.dropbox.getImage(this.path_lower).subscribe(data => {
            this.img = data;
          }, (err) => {
            console.log(err);
          });

        }

      }

      this.depth++;
      loading.dismiss();
    }, err => {
      console.log(err);
    });

    this.dropbox.getSharedlink().subscribe(data => {
      this.sharedlinks = data.links;

      for(let link of this.sharedlinks) {
        var pattern = /www.dropbox.com/i;
        this.sharedlink = link.url.replace( pattern, "dl.dropboxusercontent.com" );
      }

    }, (err) => {
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
      this.depth--;
      loading.dismiss();
    }, err => {
      console.log(err);
    });

  }

}
