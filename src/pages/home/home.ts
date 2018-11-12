import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  dificuldade: number = 1;
  quiz: any;
  constructor(public navCtrl: NavController) { 

    this.quiz = [
      [ {'charada': 'Sou um Centro Universitário em Águas Claras - Brasília/DF.', 'place_id': 'chijq1-dkwcwwpmrqdvepmutqjo' },
          {'charada': 'Sou um parque de diversões em Brasília/DF.', 'place_id': 'chijp9cwr4g6wpmrs61cjidrzpu'} 
      ],
      [ {'charada': 'Sou um monumento importante de um ex-presidente do Brasil localizado em Brasília/DF.', 'place_id': 'chijsandbnw6wpmrbwufqruycim' },
          {'charada': 'Sou um Palácio do Poder Executivo.', 'place_id': 'chij0-cd45owwpmremqbww9axmc'} ] 
      ,
      [ {'charada': 'Sou o Principal Templo Católico em Brasília/DF.', 'place_id': 'chijkzoftci7wpmrgy1p6tgy-1u' },
          {'charada': 'Sou um Palácio onde mora o Presidente da República.', 'place_id': 'chij_44khsc8wpmrq18tqqajby0'} ] 
    ];
  }

  ionViewDidLoad() {
    
  }

  iniciarJogo() {

    this.navCtrl.push('MapaPage', {
      data: {'quiz': this.quiz[this.dificuldade] }
    });
  }

}
