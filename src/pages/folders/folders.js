"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var dropbox_1 = require("../../providers/dropbox");
var items_1 = require("../items/items");
var Folders = (function () {
    function Folders(navCtrl, dropbox, loadingCtrl, http, navParams) {
        this.navCtrl = navCtrl;
        this.dropbox = dropbox;
        this.loadingCtrl = loadingCtrl;
        this.http = http;
        this.navParams = navParams;
        this.depth = 0;
        this.itemsPage = items_1.Items;
        this.level = 0;
        this.img = {};
        this.img.response = '';
        this.accesstoken = 'sBkG526oY1AAAAAAAAAACQGhbUFvvoU2gdYHwZ5SRBK4cTomj9oZVGPuIw_B8T5P';
    }
    Folders.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.dropbox.setAccessToken(this.accesstoken);
        this.folders = [];
        var loading = this.loadingCtrl.create({
            content: 'Syncing from Dropbox...'
        });
        loading.present();
        this.dropbox.getFolders().subscribe(function (data) {
            _this.folders = data.entries;
            _this.level = _this.level += 1;
            loading.dismiss();
        }, function (err) {
            console.log(err);
        });
    };
    Folders.prototype.openFolder = function (path) {
        var _this = this;
        var loading = this.loadingCtrl.create({
            content: 'Syncing from Dropbox...'
        });
        loading.present();
        this.dropbox.getFolders(path).subscribe(function (data) {
            _this.folders = data.entries;
            _this.level = _this.level += 1;
            for (var _i = 0, _a = _this.folders; _i < _a.length; _i++) {
                var folder = _a[_i];
                if (folder.name == 'items.json')
                    continue;
            }
            _this.depth++;
            loading.dismiss();
        }, function (err) {
            console.log(err);
        });
    };
    Folders.prototype.goBack = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({
            content: 'Syncing from Dropbox...'
        });
        loading.present();
        this.dropbox.goBackFolder().subscribe(function (data) {
            _this.folders = data.entries;
            _this.level = _this.level -= 1;
            _this.depth--;
            loading.dismiss();
        }, function (err) {
            console.log(err);
        });
    };
    Folders.prototype.itemTapped = function (name, path_lower) {
        this.navCtrl.push(items_1.Items, { name: name, path: path_lower });
    };
    return Folders;
}());
Folders = __decorate([
    core_1.Component({
        selector: 'page-folders',
        templateUrl: 'folders.html',
        providers: [dropbox_1.Dropbox]
    })
], Folders);
exports.Folders = Folders;
//# sourceMappingURL=folders.js.map