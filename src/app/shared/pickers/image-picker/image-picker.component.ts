import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import {Capacitor,Plugins, CameraSource, CameraResultType} from '@capacitor/core';
import { Platform, ActionSheetController, AlertController } from '@ionic/angular';



@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  @ViewChild('filePicker',{static: false}) filePickerRef:ElementRef<HTMLInputElement>;
  @Output() imagePick = new EventEmitter<string | File>();
  @Input() showPreview = false;
  selectedImage : string;
  
  usePicker =  false;

  constructor(private platform:Platform, 
    private alertCtrl:AlertController,
    private actionsheetCtrl: ActionSheetController) { }

  ngOnInit() {
    console.log('Mobile',this.platform.is('mobile'));
    console.log('Hybrid',this.platform.is('hybrid'));
    console.log('IOS',this.platform.is('ios'));
    console.log('Android',this.platform.is('android'));
    console.log('Desktop',this.platform.is('desktop'));

    if((this.platform.is('mobile')&&this.platform.is('android')&& !this.platform.is('hybrid')) ||this.platform.is('desktop')
    ){
      this.usePicker = true;
    }
  }

  onPickImage(){

    this.actionsheetCtrl.create({header:'Please choose',
    buttons: [{text:'Take Picture' , 
    handler: () =>  {
      this.onTakePhoto();
      
    } } ,
    {text:'Choose from Gallery' , handler: () =>  {
        this.onChoosePhoto();

    } } ,
    {text:'Cancel' , role:'cancel' }]
  }).then( actionSheetEl => {
    actionSheetEl.present();
  });

  }

  onTakePhoto(){
    if (!Capacitor.isPluginAvailable('Camera') ) {
      return;
      this.showErrorAlert();
      
    }
     
      Plugins.Camera.getPhoto({
        quality:50,
        source: CameraSource.Prompt,
        correctOrientation: true,
       height: 600,
        width: 600,
        allowEditing:true,
        resultType:CameraResultType.DataUrl

      })
      .then(image => {  
        //this.selectedImage.push(image.dataUrl);
        
        this.selectedImage = image.dataUrl;
        this.imagePick.emit(image.dataUrl);
        
      })
      .catch(error => {
        console.log(error);
       this.showErrorAlert();
      });
  }

  private showErrorAlert() {

    this.alertCtrl.create({header:'Could not get picture', 
       message:'Please try again',
      buttons:['Okay']})
      .then( 
         alertEl => alertEl.present()
       );
    
  }

  onChoosePhoto(){

    if(this.usePicker){

      this.filePickerRef.nativeElement.click();
    }
    
    return false;
    this.showErrorAlert();

  }


  onFileChosen(event: Event){

   const pickedFile = (event.target as HTMLInputElement).files[0];
   if(!pickedFile){

     return;
   }
   const  fr = new FileReader();
   fr.onload = () => {

    const dataUrl = fr.result.toString();
    //this.selectedImage.push(dataUrl);
   this.selectedImage = dataUrl;
    this.imagePick.emit(pickedFile);
   };
   fr.readAsDataURL(pickedFile);
  }

}
 