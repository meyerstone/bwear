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
  img_path: any;
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
        this.path_lower = folder.path_lower;
        this.img_path =  this.getImage(this.path_lower);
      }
      console.log(this.img_path);

      this.depth++;
      loading.dismiss();
    }, err => {
      console.log(err);
    });

  }

  getImage(path?){

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

    return this.http.post('https://content.dropboxapi.com/2/files/get_thumbnail', JSON.stringify(imagePath))
        .map(res => res.json());

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
