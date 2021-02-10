import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService, AuthResponseData } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  isLoading = false;
  isLogin = true;
  
    constructor(
      private authService: AuthService,
      private route: Router, 
      private loadingCtrl:LoadingController,
      private alertCtrl: AlertController) { }
  
    ngOnInit() {
    }
    authenticate(email:string,password:string){
      this.isLoading = true;
      this.loadingCtrl.create({keyboardClose:true,message:'Signing in...'})
      .then(loadingEl =>{ 
        loadingEl.present(); 
        
        let authObs : Observable<AuthResponseData>;
        
         authObs = this.authService.signUp(email,password);
        
  
       
       authObs.subscribe(resData => {
          console.log(resData);
          
          loadingEl.dismiss();
          this.isLoading = false;
        
        this.route.navigateByUrl('/equipment/tabs/discover');
        },
          errRes => {
            loadingEl.dismiss();
            console.log(errRes);
          
          const code = errRes.error.error.message;
          let message = 'Could not sign you up. please try again';
  
          if(code ==='EMAIL_EXISTS'){
            message = 'This email address already exists!';
          } else if (code ==='INVALID_EMAIL'){
            message = 'This is email is invalid!';
          }
          else if (code ==='INVALID_PASSWORD'){
            message = 'This is password is invalid!';
          }
          else if (code ==='EMAIL_NOT_FOUND'){
            message = 'This is email address could not be found!';
          }
           this.showAlert(message);
        }
        );
  
      });
     
     
    }
    onSubmit(form:NgForm){
      if(!form.valid){
        return;
      }
      const email = form.value.email;
      const password = form.value.password;
  
     this.authenticate(email,password);
     form.reset();
    }
    
    private showAlert(message:string){
      this.alertCtrl.create({header:'Authentication Failed', 
      message:message,
    buttons:['Okay']}).then(alertEl => 
        alertEl.present());
    }
    onReset(){
      this.route.navigateByUrl('/auth/reset');
    }
   
  }
  