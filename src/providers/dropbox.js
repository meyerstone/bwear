"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
var Dropbox = (function () {
    function Dropbox(http) {
        this.http = http;
        this.folderHistory = [];
        this.data = null;
    }
    Object.defineProperty(Dropbox, "parameters", {
        get: function () {
            return [[http_1.Http]];
        },
        enumerable: true,
        configurable: true
    });
    Dropbox.prototype.setAccessToken = function (token) {
        this.accessToken = token;
    };
    Dropbox.prototype.getFolders = function (path) {
        var headers = new http_1.Headers();
        headers.append('Authorization', 'Bearer ' + this.accessToken);
        headers.append('Content-Type', 'application/json');
        var folderPath;
        if (typeof (path) == "undefined" || !path) {
            folderPath = {
                path: ""
            };
        }
        else {
            folderPath = {
                path: path
            };
            if (this.folderHistory[this.folderHistory.length - 1] != path) {
                this.folderHistory.push(path);
            }
        }
        return this.http.post('https://api.dropboxapi.com/2-beta-2/files/list_folder', JSON.stringify(folderPath), { headers: headers })
            .map(function (res) { return res.json(); });
    };
    Dropbox.prototype.getItemsJsonSharedlink = function (path) {
        var itemsPath;
        if (typeof (path) == "undefined" || !path) {
            itemsPath = {
                path: ""
            };
        }
        else {
            itemsPath = {
                path: path
            };
        }
        var headers = new http_1.Headers();
        headers.append('Authorization', 'Bearer ' + this.accessToken);
        headers.append('Content-Type', 'application/json');
        return this.http.post('https://api.dropboxapi.com/2/sharing/get_shared_links', JSON.stringify(itemsPath), { headers: headers })
            .map(function (res) { return res.json(); });
    };
    Dropbox.prototype.goBackFolder = function () {
        if (this.folderHistory.length > 0) {
            this.folderHistory.pop();
            var path = this.folderHistory[this.folderHistory.length - 1];
            return this.getFolders(path);
        }
        else {
            return this.getFolders();
        }
    };
    return Dropbox;
}());
Dropbox = __decorate([
    core_1.Injectable()
], Dropbox);
exports.Dropbox = Dropbox;
//# sourceMappingURL=dropbox.js.map