import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { FirebaseService } from 'src/services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  validationsForm: FormGroup;
  constructor(private fromBuilder: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private FirebaseService: FirebaseService) { }

  ngOnInit() {
    this.validationsForm = this.fromBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
  }
  validation_messages = {
    'email': [
      { type: 'required', message: 'El correo es Requerido.' },
      { type: 'pattern', message: 'Por Favor ingrese un correo valido.' }
    ],
    'password': [
      { type: 'required', message: 'La contraseña es Requerida.' },
      { type: 'minlength', message: 'La contraseña debe tener alemeno 5 Caracteres.' }
    ]
  }; 

  async signUp(){
    const loading = await this.loadingController.create();
    await loading.present();

    this.FirebaseService.signup(this.validationsForm.value).then(user=>{
      loading.dismiss();
      this.router.navigateByUrl('/chat', {replaceUrl:true});
    }, async err =>{
      loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Registro Fallido',
        message: 'LLene los campos con los valores requeridos.',
        buttons: ['Aceptar'],
      });

      await alert.present();
    });
  }
  async logIn(){
    const loading = await this.loadingController.create();
    await loading.present();

    this.FirebaseService.logIn(this.validationsForm.value).then((res)=>{
      loading.dismiss();
      this.router.navigateByUrl('/chat', {replaceUrl:true});
    }, async (err) =>{
      loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Contraseña Incorrecta',
        message: 'Por favor revise su contraseña e intente de nuevo.',
        buttons: ['Aceptar'],
      });

      await alert.present();
    });
  }
}
