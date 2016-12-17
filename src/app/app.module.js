"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var ionic_angular_1 = require("ionic-angular");
var app_component_1 = require("./app.component");
var home_1 = require("../pages/home/home");
var folders_1 = require("../pages/folders/folders");
var dropbox_1 = require("../providers/dropbox");
var items_1 = require("../pages/items/items");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        declarations: [
            app_component_1.MyApp,
            home_1.Home,
            folders_1.Folders,
            items_1.Items
        ],
        imports: [
            ionic_angular_1.IonicModule.forRoot(app_component_1.MyApp)
        ],
        bootstrap: [ionic_angular_1.IonicApp],
        entryComponents: [
            app_component_1.MyApp,
            home_1.Home,
            folders_1.Folders,
            items_1.Items
        ],
        providers: [{ provide: core_1.ErrorHandler, useClass: ionic_angular_1.IonicErrorHandler }, [dropbox_1.Dropbox]]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map