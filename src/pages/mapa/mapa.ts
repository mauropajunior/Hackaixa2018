import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

declare var google;
/**
 * Generated class for the MapaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html',
})
export class MapaPage {

  map: any;
  markers: any;
  autocomplete: any;
  GoogleAutocomplete: any;
  GooglePlaces: any;
  geocoder: any
  autocompleteItems: any;
  loading: any;

  quiz_data: any;

  charada_atual: number = 0;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public zone: NgZone,
    public geolocation: Geolocation,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    this.geocoder = new google.maps.Geocoder;
    let elem = document.createElement("div")
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

  ionViewDidEnter(){
    
    this.loading.present();
    this.geolocation.getCurrentPosition()
      .then((resp) => {
        this.map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: resp.coords.latitude, lng: resp.coords.longitude},
          zoom: 18
        });
        this.loading.dismiss();
        this.presentAlert("Primeira charada:", this.quiz_data.quiz[this.charada_atual].charada);
    });
    
  }

  tryGeolocation(){
    this.loading.present();
    this.clearMarkers();//remove previous markers

    this.geolocation.getCurrentPosition().then((resp) => {
      let pos = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };
      let marker = new google.maps.Marker({
        position: pos,
        map: this.map,
        title: 'Estou aqui!'
      });
      this.markers.push(marker);
      this.map.setCenter(pos);
      this.loading.dismiss();

    }).catch((error) => {
      console.log('Error getting location', error);
      this.loading.dismiss();
    });
  }

  updateSearchResults(){
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteItems = [];
        if(predictions){
          this.zone.run(() => {
            predictions.forEach((prediction) => {
              this.autocompleteItems.push(prediction);
            });
          });
        }
    });
  }

  selectSearchResult(item){

    if (typeof(item)=='undefined') return;

    this.clearMarkers();
    this.autocompleteItems = [];

    this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
      if(status === 'OK' && results[0]){
        
        let marker = new google.maps.Marker({
          position: results[0].geometry.location,
          map: this.map
        });

        this.markers.push(marker);

        google.maps.event.addListener(marker, 'click', () => {
          this.zone.run(() => {
            if (item.place_id.toLowerCase() == this.quiz_data.quiz[this.charada_atual].place_id) {
              
              this.charada_atual++;
              if (this.quiz_data.quiz.length == this.charada_atual) {
                this.presentAlert("Parabéns!", "Você ganhou o jogo!");
              } else {
                this.presentAlert("Acertou! Próxima charada: ", this.quiz_data.quiz[this.charada_atual].charada);
              }
            } else {
              this.presentAlert("Resposta incorreta!", "Dê outro palpite.");
            }

            this.autocomplete.input = '';
            this.autocompleteItems = [];
            this.clearMarkers();
          });
        });
    
        this.map.setCenter(results[0].geometry.location);
        this.presentToast("Toque no marcador escolhido.");
      }
    })
  }

  clearMarkers(){
    for (var i = 0; i < this.markers.length; i++) {
      console.log(this.markers[i])
      this.markers[i].setMap(null);
    }
    this.markers = [];
  }

  lembrarCharada() {
    this.presentToast("Charada: " + this.quiz_data.quiz[this.charada_atual].charada);
  }

  presentToast(msg: string) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }

  presentAlert(alert_title: string, msg: string) {
    let alert = this.alertCtrl.create({
      title: alert_title,
      subTitle: msg,
      buttons: ['OK!']
    });
    alert.present();
  }
}
