import { Component } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})


export class Tab1Page {
  // initialisation des variables nécessaires à la récupération des données + les timers
    minutes: number = 0;
    seconds: number = 0;
    isRunning: boolean = false;
    timer: any;
    numberOfZone!: number;
    pauseTime!: number;
    brushingTime!: number;
    name!: string;
    currentZone: number = 0
    timerPerZone: any
    pauseTimer: any
  
    // Au chargement de la page on récupère ce les paramètres stocké en mémoire
    async ionViewWillEnter() {
      this.numberOfZone = parseInt((await Preferences.get({ key: 'numberOfZone' })).value!, 10) ;
      this.pauseTime = parseInt((await Preferences.get({ key: 'pauseTime' })).value!, 10);
      this.brushingTime = parseInt((await Preferences.get({ key: 'brushingTime' })).value!, 10);
      this.name = (await Preferences.get({ key: 'name' })).value!
    }
  
    start() {
      if (!this.isRunning) {
        //si le temps de pause est écoulé, on détruit le timer correspondant à pauseTime
        if(this.pauseTimer){
          clearTimeout(this.pauseTimer)
        }
        this.isRunning = true;
        console.log("is running")
        //Lorsque le timer démarre les secondes s'incrémente
        this.timer = setInterval(() => {
          this.seconds++;
          //si le nombre de seconde est égal au temps de brossage et que la zone n'est pas la derniere
          if (this.seconds === this.brushingTime && !(this.currentZone === this.numberOfZone)) {
            //on incrémente la zone actuelle et on marque la pause
            this.currentZone++
            this.respectPauseTime()
          }
          // si la zone est la dernière on reset le timer
          if(this.currentZone === this.numberOfZone){
            clearInterval(this.timer)
            clearTimeout(this.pauseTimer)
            this.seconds = 0;
          }
          if (this.seconds === 60) {
            this.minutes++;
            this.seconds = 0;
          }
        }, 1000);
      }
    }
  
    pause() {
      if (this.isRunning) {
        console.log("is paused")
        this.isRunning = false;
        clearInterval(this.timer);
      }
    }
    // on appelle la pause() puis start() une fois le temps de pause écoulé
    respectPauseTime(){
      this.pause()
      this.seconds = 0
      this.pauseTimer = setTimeout(()=> {
        this.start()
      },(this.pauseTime * 1000) )

    }
  
    reset() {
      this.minutes = 0;
      this.seconds = 0;
      this.currentZone = 0
      this.isRunning = false;
      clearInterval(this.timer);
      clearInterval(this.timerPerZone)
      
    }
  }
  