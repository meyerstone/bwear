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
        this.dropbox.getItemsJsonSharedlink(this.itemsPath + '/items.json').subscribe(function (data) {
            _this.sharedlinks = data.links;
            loading.dismiss();
            for (var _i = 0, _a = _this.sharedlinks; _i < _a.length; _i++) {
                var link = _a[_i];
                var pattern = /www.dropbox.com/i;
                _this.itemsjsonlink = link.url.replace(pattern, "dl.dropboxusercontent.com");
                _this.getItems(_this.itemsjsonlink).subscribe(function (data) {
                    _this.items = data;
                    console.log(_this.items);
                }, function (err) {
                    console.log(err);
                });
                ;
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