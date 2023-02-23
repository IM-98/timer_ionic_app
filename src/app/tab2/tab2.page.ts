import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  settingsForm!: FormGroup
  // injection de la dépendence FormBuilder
  constructor(private formbuilder: FormBuilder) {}

  // initialisation des variables nécessaires à la récupération des données
  numberOfZone!: number;
  pauseTime!: number;
  brushingTime!: number;
  name!: string;

  // Au chargement de la page on récupère ce les paramètres stocké en mémoire
  async ionViewWillEnter() {
    this.numberOfZone = parseInt((await Preferences.get({ key: 'numberOfZone' })).value!, 10) ;
    this.pauseTime = parseInt((await Preferences.get({ key: 'pauseTime' })).value!, 10);
    this.brushingTime = parseInt((await Preferences.get({ key: 'brushingTime' })).value!, 10);
    this.name = (await Preferences.get({ key: 'name' })).value!
  }

  // enregistrement de la valeur des inputs en mémoire
  async saveSettings() {
    await Preferences.set({
      key: 'numberOfZone', value: JSON.stringify(this.settingsForm.get("numberOfZone")?.value),
    })
    await Preferences.set({
      key: 'pauseTime', value: JSON.stringify(this.settingsForm.get("pauseTime")?.value),
    })
    await Preferences.set({
      key: 'brushingTime', value: JSON.stringify(this.settingsForm.get("brushingTime")?.value),
    })
    await Preferences.set({
      key: 'name', value: this.settingsForm.get("name")?.value,
    })
  }
  // clear de la mémoire
  async resetParam(){
    await Preferences.remove({ key: 'name' });
    await Preferences.remove({ key: 'pauseTime' });
    await Preferences.remove({ key: 'brushingTime' });
    await Preferences.remove({ key: 'numberOfZone' });
  }


  ngOnInit(): void {

    //création du formulaire réactif et de la validation
    this.settingsForm = this.formbuilder.group({
      numberOfZone: ['', [
        Validators.required,
        Validators.pattern("^([1-9]|[1-5][0-9]|60|all)$")
      ]],
      pauseTime: ['', [
        Validators.required,
        Validators.pattern("^([1-9]|[1-5][0-9]|60|all)$")
      ]],
      brushingTime: ['', [
        Validators.required,
        Validators.pattern("^([1-9]|[1-5][0-9]|60|all)$")
      ]],
      name: ['', [
        Validators.required,
        Validators.pattern("/^[a-z ,.'-]+$/i")
      ]]
    })
  }

  // soumission du formulaire qui enregistre les paramètres
  submitForm() {
    if (!this.settingsForm.valid) {
      console.log('error')
      console.log(this.settingsForm.controls['name'].errors)
      console.log(this.settingsForm.controls['pauseTime'].errors)
      console.log(this.settingsForm.controls['brushingTime'].errors)
      console.log(this.settingsForm.controls['numberOfZone'].errors)
    } else {
      console.log("success")
      this.saveSettings()
    }
  }

}
