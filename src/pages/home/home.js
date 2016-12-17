"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var dropbox_1 = require("../../providers/dropbox");
//import { base64Img } from 'base64-img';
var Home = (function () {
    function Home(navCtrl, dropbox, loadingCtrl, http) {
        this.navCtrl = navCtrl;
        this.dropbox = dropbox;
        this.loadingCtrl = loadingCtrl;
        this.http = http;
        this.depth = 0;
        this.img = {};
        this.img.response = '';
        this.accesstoken = 'sBkG526oY1AAAAAAAAAACQGhbUFvvoU2gdYHwZ5SRBK4cTomj9oZVGPuIw_B8T5P';
    }
    Home.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.dropbox.setAccessToken(this.accesstoken);
        this.folders = [];
        var loading = this.loadingCtrl.create({
            content: 'Syncing from Dropbox...'
        });
        loading.present();
        this.dropbox.getFolders().subscribe(function (data) {
            _this.folders = data.entries;
            loading.dismiss();
        }, function (err) {
            console.log(err);
        });
    };
    Home.prototype.openFolder = function (path) {
        var _this = this;
        var loading = this.loadingCtrl.create({
            content: 'Syncing from Dropbox...'
        });
        loading.present();
        this.dropbox.getFolders(path).subscribe(function (data) {
            _this.folders = data.entries;
            for (var _i = 0, _a = _this.folders; _i < _a.length; _i++) {
                var folder = _a[_i];
                if (folder.name == 'items.json')
                    continue;
                if (folder['.tag'] == 'file' && folder.name != 'items.json') {
                    _this.path_lower = folder.path_lower;
                    _this.getImage(_this.path_lower);
                }
            }
            _this.depth++;
            loading.dismiss();
        }, function (err) {
            console.log(err);
        });
        this.dropbox.getSharedlink().subscribe(function (data) {
            _this.sharedlinks = data.links;
            for (var _i = 0, _a = _this.sharedlinks; _i < _a.length; _i++) {
                var link = _a[_i];
                var pattern = /www.dropbox.com/i;
                _this.sharedlink = link.url.replace(pattern, "dl.dropboxusercontent.com");
            }
        }, function (err) {
            console.log(err);
        });
    };
    Home.prototype.getImage = function (path) {
        var _this = this;
        var imagePath;
        if (!path) {
            imagePath = {
                path: ""
            };
        }
        else {
            imagePath = {
                path: path,
                "format": "jpeg",
                "size": "w64h64"
            };
        }
        var headers = new http_1.Headers();
        headers.append('Authorization', 'Bearer ' + this.accesstoken);
        headers.append('Dropbox-API-Arg', JSON.stringify(imagePath));
        headers.append('Content-Type', '');
        this.http.post('https://content.dropboxapi.com/2/files/get_thumbnail', '', { headers: headers })
            .map(function (res) { return res; }).subscribe(function (data) {
            var base64Img = require('base64-img');
            _this.img.response = base64Img.base64(data['_body'], function (err, data) { });
            console.log(_this.img.response);
        }, function (err) {
            console.log(err);
        });
    };
    Home.prototype.goBack = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({
            content: 'Syncing from Dropbox...'
        });
        loading.present();
        this.dropbox.goBackFolder().subscribe(function (data) {
            _this.folders = data.entries;
            _this.depth--;
            loading.dismiss();
        }, function (err) {
            console.log(err);
        });
    };
    return Home;
}());
Home = __decorate([
    core_1.Component({
        selector: 'page-home',
        templateUrl: 'home.html',
        providers: [dropbox_1.Dropbox]
    })
], Home);
exports.Home = Home;
//# sourceMappingURL=home.js.map