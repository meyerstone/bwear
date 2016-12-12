import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class Dropbox {

  accessToken: any;
  folderHistory: any = [];
  data: any;

  static get parameters() {
    return [[Http]];
  }

  constructor(public http: Http) {
    this.data = null;
  }

  setAccessToken(token) {
    this.accessToken = token;
  }

  getFolders(path?){

    let headers = new Headers();

    headers.append('Authorization', 'Bearer ' + this.accessToken);
    headers.append('Content-Type', 'application/json');

    let folderPath;

    if(typeof(path) == "undefined" || !path){

      folderPath = {
        path: ""
      };

    } else {

      folderPath = {
        path: path
      };

      if(this.folderHistory[this.folderHistory.length - 1] != path){
        this.folderHistory.push(path);
      }

    }

    return this.http.post('https://api.dropboxapi.com/2-beta-2/files/list_folder', JSON.stringify(folderPath), {headers: headers})
        .map(res => res.json());

  }

  goBackFolder(){

    if(this.folderHistory.length > 0){

      this.folderHistory.pop();
      let path = this.folderHistory[this.folderHistory.length - 1];

      return this.getFolders(path);
    }
    else {
      return this.getFolders();
    }
  }

}