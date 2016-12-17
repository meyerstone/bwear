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
var Items = (function () {
    function Items(navCtrl, params, dropbox, loadingCtrl, http) {
        this.navCtrl = navCtrl;
        this.params = params;
        this.dropbox = dropbox;
        this.loadingCtrl = loadingCtrl;
        this.http = http;
        this.itemsName = this.params.get('name');
        this.itemsPath = this.params.get('path');
        this.accesstoken = 'sBkG526oY1AAAAAAAAAACQGhbUFvvoU2gdYHwZ5SRBK4cTomj9oZVGPuIw_B8T5P';
    }
    Items.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.dropbox.setAccessToken(this.accesstoken);
        var loading = this.loadingCtrl.create({
            content: 'Syncing from Dropbox...'
        });
        loading.present();
        // Get the shared link for the items.json file in current path
        this.dropbox.getItemsJsonSharedlink(this.itemsPath + '/items.json').subscribe(function (data) {
            _this.sharedlinks = data.links;
            // Only 1 link will return but it returns an object of [links], so iterate
            for (var _i = 0, _a = _this.sharedlinks; _i < _a.length; _i++) {
                var link = _a[_i];
                // replace the public domain with the api one
                var pattern = /www.dropbox.com/i;
                _this.itemsjsonlink = link.url.replace(pattern, "dl.dropboxusercontent.com");
                // take the shared link returned and call it
                _this.getItems(_this.itemsjsonlink).subscribe(function (data) {
                    // assign the returned data to items object
                    _this.items = data;
                    var _loop_1 = function (item) {
                        var imagespath = _this.itemsPath + '/' + item.folder_alias;
                        _this.getImages(imagespath).subscribe(function (data) {
                            var images = data.entries;
                            for (var _i = 0, images_1 = images; _i < images_1.length; _i++) {
                                var image = images_1[_i];
                                _this.imagepath = image.path_lower;
                            }
                            loading.dismiss();
                            _this.getThumbnails(_this.imagepath).subscribe(function (data) {
                                _this.imageblob = data['_body'];
                                item.link = _this.imageblob;
                                //var base64Img = require('base64-img');
                                //this.img.response = base64Img.base64(data['_body'], function(err, data) {});
                            }, function (err) {
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
                        }, function (err) {
                            console.log(err);
                        });
                    };
                    // get the images inside each of the item's image folders
                    for (var _i = 0, _a = _this.items; _i < _a.length; _i++) {
                        var item = _a[_i];
                        _loop_1(item);
                    }
                }, function (err) {
                    console.log(err);
                });
            }
        }, function (err) {
            loading.dismiss();
            console.log(err);
        });
    };
    Items.prototype.getItems = function (link) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        return this.http.post(link, { headers: headers })
            .map(function (res) { return res.json(); });
    };
    Items.prototype.getImages = function (path) {
        var headers = new http_1.Headers();
        headers.append('Authorization', 'Bearer ' + this.accesstoken);
        headers.append('Content-Type', 'application/json');
        var folderPath;
        if (typeof (path) == "undefined" || !path) {
            folderPath = {
                path: "",
                "recursive": false
            };
        }
        else {
            folderPath = {
                path: path,
                "recursive": false
            };
        }
        return this.http.post('https://api.dropboxapi.com/2-beta-2/files/list_folder', JSON.stringify(folderPath), { headers: headers })
            .map(function (res) { return res.json(); });
    };
    Items.prototype.getThumbnails = function (path) {
        var imagePath;
        if (typeof (path) == "undefined" || !path) {
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
        return this.http.post('https://content.dropboxapi.com/2/files/get_thumbnail', '', { headers: headers })
            .map(function (res) { return res; });
    };
    Items.prototype.getTempLink = function (url) {
        var headers = new http_1.Headers();
        headers.append('Authorization', 'Bearer ' + this.accesstoken);
        headers.append('Content-Type', 'application/json');
        var linkPath;
        if (typeof (url) == "undefined" || !url) {
            linkPath = {
                path: ""
            };
        }
        else {
            linkPath = {
                path: url
            };
        }
        return this.http.post('https://api.dropboxapi.com/2/files/get_temporary_link', JSON.stringify(linkPath), { headers: headers })
            .map(function (res) { return res.json(); });
    };
    return Items;
}());
Items = __decorate([
    core_1.Component({
        selector: 'page-items',
        templateUrl: 'items.html',
        providers: [dropbox_1.Dropbox]
    })
], Items);
exports.Items = Items;
//# sourceMappingURL=items.js.map