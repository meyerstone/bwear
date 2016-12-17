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

  imageblob: any;
  imageurls: any;
  imagepath: any;
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


    // Get the shared link for the items.json file in current path
    this.dropbox.getItemsJsonSharedlink(this.itemsPath + '/items.json').subscribe(data => {
      this.sharedlinks = data.links;

      // Only 1 link will return but it returns an object of [links], so iterate
      for(let link of this.sharedlinks) {

        // replace the public domain with the api one
        let pattern = /www.dropbox.com/i;
        this.itemsjsonlink = link.url.replace( pattern, "dl.dropboxusercontent.com" );

        // take the shared link returned and call it
        this.getItems(this.itemsjsonlink).subscribe(data => {

          // assign the returned data to items object
          this.items = data;

          // get the images inside each of the item's image folders
          for(let item of this.items) {

            let imagespath = this.itemsPath +'/'+ item.folder_alias;

            this.getImages(imagespath).subscribe(data => {

              let images = data.entries;

              for (let image of images) {
                this.imagepath = image.path_lower;
              }

              loading.dismiss();

              this.getThumbnails(this.imagepath).subscribe(data => {

                this.imageblob = data['_body'];
                item.link = this.imageblob;

                //var base64Img = require('base64-img');
                //this.img.response = base64Img.base64(data['_body'], function(err, data) {});


              }, (err) => {
                console.log(err);
              });

              /*
              // get the temporary link of each image returned above (link lasts for 4 hours) and assign it to the item
              this.getTempLink(this.imagepath).subscribe(data => {
                this.imagepath = data.link;
                item.link = this.imagepath;
              }, (err) => {
                console.log(err);
              });
              */

            }, (err) => {
              console.log(err);
            });

          }

        }, (err) => {
          console.log(err);
        });

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

  getImages(path) {

    let headers = new Headers();

    headers.append('Authorization', 'Bearer ' + this.accesstoken);
    headers.append('Content-Type', 'application/json');

    let folderPath;

    if(typeof(path) == "undefined" || !path){

      folderPath = {
        path: "",
        "recursive" : false
      };

    } else {

      folderPath = {
        path: path,
        "recursive" : false
      };

    }

    return this.http.post('https://api.dropboxapi.com/2-beta-2/files/list_folder', JSON.stringify(folderPath), {headers: headers})
      .map(res => res.json());

  }

  getThumbnails(path?) {

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

    return this.http.post('https://content.dropboxapi.com/2/files/get_thumbnail', '', {headers: headers})
      .map(res => res);

  }

  getTempLink(url) {

    let headers = new Headers();

    headers.append('Authorization', 'Bearer ' + this.accesstoken);
    headers.append('Content-Type', 'application/json');

    let linkPath;

    if(typeof(url) == "undefined" || !url){

      linkPath = {
        path: ""
      };

    } else {

      linkPath = {
        path: url
      };

    }

    return this.http.post('https://api.dropboxapi.com/2/files/get_temporary_link', JSON.stringify(linkPath), {headers: headers})
      .map(res => res.json());

  }

}
