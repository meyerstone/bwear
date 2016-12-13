import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { Dropbox } from '../../providers/dropbox';
import convertToBase64 = ts.convertToBase64;

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
  accesstoken: string;

  constructor(public navCtrl: NavController, public dropbox: Dropbox, public loadingCtrl: LoadingController, public http: Http) {
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

        if (folder['.tag'] == 'file' && folder.name != 'items.json') {

          this.path_lower = folder.path_lower;
          this.getImage(this.path_lower).then(data => {this.img.response = data});

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

  getImage(path?) {

    let imagePath;

    if(typeof(path) == "undefined" || !path){

      imagePath = {
        path: ""
      };

    } else {

      imagePath = {
        path: path,
        "format": "jpeg",
        "size": "w64h64"
      };

    }

    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.accesstoken);
    headers.append('Dropbox-API-Arg', JSON.stringify(imagePath));
    headers.append('Content-Type', '');

    return new Promise(resolve => {

      this.http.post('https://content.dropboxapi.com/2/files/get_thumbnail', '', {headers: headers})
          .map(res => res).subscribe(data => {

        this.img.response = data['_body'];
        console.log(this.img.response);
        resolve(this.img.response);
      }, (err) => {
        console.log(err);
      });

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
