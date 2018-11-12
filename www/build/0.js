webpackJsonp([0],{

/***/ 276:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MapaPageModule", function() { return MapaPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mapa__ = __webpack_require__(277);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var MapaPageModule = /** @class */ (function () {
    function MapaPageModule() {
    }
    MapaPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__mapa__["a" /* MapaPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__mapa__["a" /* MapaPage */]),
            ],
        })
    ], MapaPageModule);
    return MapaPageModule;
}());

//# sourceMappingURL=mapa.module.js.map

/***/ }),

/***/ 277:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapaPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__ = __webpack_require__(197);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






/**
 * Generated class for the MapaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var MapaPage = /** @class */ (function () {
    function MapaPage(navCtrl, navParams, zone, geolocation, loadingCtrl, toastCtrl, alertCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.zone = zone;
        this.geolocation = geolocation;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.alertCtrl = alertCtrl;
        this.charada_atual = 0;
        this.geocoder = new google.maps.Geocoder;
        var elem = document.createElement("div");
        this.GooglePlaces = new google.maps.places.PlacesService(elem);
        this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
        this.autocomplete = {
            input: ''
        };
        this.autocompleteItems = [];
        this.markers = [];
        this.loading = this.loadingCtrl.create();
        this.quiz_data = navParams.get('data');
    }
    MapaPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        this.loading.present();
        this.geolocation.getCurrentPosition()
            .then(function (resp) {
            _this.map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: resp.coords.latitude, lng: resp.coords.longitude },
                zoom: 18
            });
            _this.loading.dismiss();
            _this.presentAlert("Primeira charada:", _this.quiz_data.quiz[_this.charada_atual].charada);
        });
    };
    MapaPage.prototype.tryGeolocation = function () {
        var _this = this;
        this.loading.present();
        this.clearMarkers(); //remove previous markers
        this.geolocation.getCurrentPosition().then(function (resp) {
            var pos = {
                lat: resp.coords.latitude,
                lng: resp.coords.longitude
            };
            var marker = new google.maps.Marker({
                position: pos,
                map: _this.map,
                title: 'Estou aqui!'
            });
            _this.markers.push(marker);
            _this.map.setCenter(pos);
            _this.loading.dismiss();
        }).catch(function (error) {
            console.log('Error getting location', error);
            _this.loading.dismiss();
        });
    };
    MapaPage.prototype.updateSearchResults = function () {
        var _this = this;
        if (this.autocomplete.input == '') {
            this.autocompleteItems = [];
            return;
        }
        this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input }, function (predictions, status) {
            _this.autocompleteItems = [];
            if (predictions) {
                _this.zone.run(function () {
                    predictions.forEach(function (prediction) {
                        _this.autocompleteItems.push(prediction);
                    });
                });
            }
        });
    };
    MapaPage.prototype.selectSearchResult = function (item) {
        var _this = this;
        if (typeof (item) == 'undefined')
            return;
        this.clearMarkers();
        this.autocompleteItems = [];
        this.geocoder.geocode({ 'placeId': item.place_id }, function (results, status) {
            if (status === 'OK' && results[0]) {
                var marker = new google.maps.Marker({
                    position: results[0].geometry.location,
                    map: _this.map
                });
                _this.markers.push(marker);
                google.maps.event.addListener(marker, 'click', function () {
                    _this.zone.run(function () {
                        if (item.place_id.toLowerCase() == _this.quiz_data.quiz[_this.charada_atual].place_id) {
                            _this.charada_atual++;
                            if (_this.quiz_data.quiz.length == _this.charada_atual) {
                                _this.presentAlert("Parabéns!", "Você ganhou o jogo!");
                            }
                            else {
                                _this.presentAlert("Acertou! Próxima charada: ", _this.quiz_data.quiz[_this.charada_atual].charada);
                            }
                        }
                        else {
                            _this.presentAlert("Resposta incorreta!", "Dê outro palpite.");
                        }
                        _this.autocomplete.input = '';
                        _this.autocompleteItems = [];
                        _this.clearMarkers();
                    });
                });
                _this.map.setCenter(results[0].geometry.location);
                _this.presentToast("Toque no marcador escolhido.");
            }
        });
    };
    MapaPage.prototype.clearMarkers = function () {
        for (var i = 0; i < this.markers.length; i++) {
            console.log(this.markers[i]);
            this.markers[i].setMap(null);
        }
        this.markers = [];
    };
    MapaPage.prototype.lembrarCharada = function () {
        this.presentToast("Charada: " + this.quiz_data.quiz[this.charada_atual].charada);
    };
    MapaPage.prototype.presentToast = function (msg) {
        var toast = this.toastCtrl.create({
            message: msg,
            duration: 4000
        });
        toast.present();
    };
    MapaPage.prototype.presentAlert = function (alert_title, msg) {
        var alert = this.alertCtrl.create({
            title: alert_title,
            subTitle: msg,
            buttons: ['OK!']
        });
        alert.present();
    };
    MapaPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-mapa',template:/*ion-inline-start:"c:\Desenvolvimento\PSIs\Hackaixa2018\caca_tesouro_quiz\src\pages\mapa\mapa.html"*/'<!--\n  Generated template for the MapaPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-navbar>\n    <ion-title>Mapa</ion-title>\n  </ion-navbar>\n  <ion-toolbar>\n    <ion-searchbar [(ngModel)]="autocomplete.input" (ionInput)="updateSearchResults()" placeholder="Qual é o local?"></ion-searchbar>\n    <ion-buttons end>\n    	<button ion-button icon-only (click)="lembrarCharada()" >\n    		<ion-icon name="help-circle"></ion-icon>\n    	</button>\n    </ion-buttons>\n  </ion-toolbar>\n</ion-header>\n\n\n<ion-content>\n\n  <ion-list [hidden]="autocompleteItems.length == 0">\n    <ion-item *ngFor="let item of autocompleteItems" tappable (click)="selectSearchResult(item)">\n      {{ item.description }}\n    </ion-item>\n  </ion-list>\n\n  <div id=\'map\'></div>\n</ion-content>\n\n<!--<ion-footer>\n  <button class="geolocation-btn" ion-button full (click)="tryGeolocation()"> Local atual </button>\n</ion-footer>-->\n'/*ion-inline-end:"c:\Desenvolvimento\PSIs\Hackaixa2018\caca_tesouro_quiz\src\pages\mapa\mapa.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_0__angular_core__["M" /* NgZone */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__["a" /* Geolocation */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], MapaPage);
    return MapaPage;
}());

//# sourceMappingURL=mapa.js.map

/***/ })

});
//# sourceMappingURL=0.js.map