import { Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Socket}from 'ngx-socket-io'
import {Camera, CameraResultType} from '@capacitor/camera'


import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions, CameraSampleOptions  } from '@capacitor-community/camera-preview';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})
export class CameraPage implements OnInit, OnDestroy {

     picture:any;
     cameraActive=false;
     canva:any; //variable para uso web
     context:any;
     video2:any;
     videoInterval:any;

     myPic:any;

  /*
  // Canvas en android
  @ViewChild('imageCanvas', {static:false}) canvas: ElementRef={} as ElementRef;
  canvasElement: any;
  // video en android
  @ViewChild('video') video: ElementRef={} as ElementRef;;
  videoElement: any;
  */

 /* @ViewChild('video', {static: true}) myVideo!: any;
  private _VIDEO  : any;*/

  foto:any;
  constructor(private socketService:Socket) { }

  ngOnInit() {

    /* Esto solo funciona en web
    this.canva=document.querySelector('#canva');
    this.context=this.canva.getContext('2d');
    //this.canva.style.display='none';
    this.canva.width=640; //this.video.videoWidth;
    this.canva.height=480; //this.video.videoHeight;
    this.context.width=this.canva.width;
    this.context.height=this.canva.height;
    */

  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

    this.canva=document.getElementById("canvas");
    this.context=this.canva.getContext("2d");
    //this.canva.style.display='none';
    this.canva.width=640; //this.video.videoWidth;
    this.canva.height=480; //this.video.videoHeight;
    this.context.width=this.canva.width;
    this.context.height=this.canva.height
  }

  async openCameraPrev(){
    this.socketService.connect();
    const cameraPreviewOptions: CameraPreviewOptions = {
      position: 'rear',
      parent:'cameraPreview',
      className:'video-element',
      enableZoom:true,
      width: window.screen.width, //width of the camera display
      height: window.screen.height - 200, //height of the camera
      enableOpacity: true,
      disableAudio:true,
      //toBack:true
    };

    CameraPreview.start(cameraPreviewOptions);
    CameraPreview.setOpacity({opacity:0.4});
    this.cameraActive=true;



  }

  async streamVideo(){
    this.video2=document.getElementById('video'); //valor del video es undefined en Android- Revisar

    let img="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE0klEQVR4nO1aS4gcRRhuH6Ciorc9OGz/X3XPc2d2Z6bnabIuigEfEUzEQ7xtxMVXUFFUkktMDooeRFDxAaL4AvUgeJDVmOAhqMREg0GMWaKJO6JgPCjRRIwl/2zXTKd3pl8zszsbLfjZnuq/qr6vqv5HVa+m/V/O0EJE9wD4kYWINmkrqQCYBCAd8o8QYrW2EophGBaAORcBlu8Nw7hcG9ZCRDoRvc6z3QF8ayVYh3W1YSmZTOYiAFsB/MEgiegkgAP8nBSiKTb4vS6dp3Rdv3TZgE9NTZ1LRDNE9JOaXQBvjY6OrgVwKg7ITytFuadiycTC+1NCiOsBPM/PdptjRPSQaZrnLSl4AFcT0VeOrfGJvb/PAvAx123JZmSjXm7K5mymqUdEu1nHtpNdqj0RHQRw88CB+w0shLiF64uGIb+tlVoEDtVKsmQazTZCiA0BJqK/xTTNmN/Sx2KxC4joCL9/MT/eAq/khfy4Ajk/MjJyYYCtiEEZaEfjA7Cdda5JxOUPLvAsXHddIq5IbOtlrCDu8CMAJ+xOnLMiOrURQowCOC4A+X6psAi8klkrL1kHwJ/dZth0rTYR/QXgJGPicYIQ2OHy3b8CKPu0eYd178ikuoJXcnsmpeznba8+hRAle+wWFiL6IAiB312N/ubOuunrun4l66WFkPsqli+BLytFmRat/td4EeCxXVh+C0Lgw04RtIthnUNE+1nnsfGsL3glj45nFaADbMQ+DiP0CuiORrydnuxmWADu4vrVcVN+53CbfnKkXpaTpqnGuNPDiF8CsFPhCWQDNrBmA49ZOabr+lYi+oV/v1lY7Db95I3CglsVQnBf93m5UTee0AS6BTKWq+JmaPBKrk0k3Fu1YyDrGwHH+1udWefaZELOerhPt+wsF+T65CLw90fFE4XALL+/KZmQlmGnCIDcmE7JPZVidw9UteS9Y2lp2P1PGIa8wQ5u7OeXhIAQYr0a/OuqJedqZbk9NyZTdtrMWeiD2YzcW7HksxO5puyvljrqHKyW5DdVS+btel3X1w2UAOc+RHSI3z2Tz502uwx4Jp1SkbY1y81nGyC/Yx3WdbZ9eiKndA/run7+wAgA2KIM96jH/r7Czjydsso0u9rJ0VpJrmnnSZsHQiAWi12movS7Vt7TSHnbuAk851oxt7xXnFC6x93+vi8EiOg1rptOJ329DO9tDm7t2T/9fNBNptNJZdCv9pWArut1dptshJ97eBmnMGDVTxDwjXpZflG1mjmV7aIn+0XgbCL6jH9vy42FClSqnzBtHsmNtS4BeOyeCQDYyM8Vw5BzIfKdqAQO10qy3j5+TvdEIJlMXmxfD8pXIuQ7UQg06mX5sp0nEdHPQohLIhMA8AT/5Wg5HxJELwTm62W5rp1qPB6ZABGd4IC0I0Se0w8CjXpZ7ioVmgHQcawNRsB1HpAzAY6JgyDQqJflbemF46eSSGdiXsrlInBjOzpHPxMPk1APZ+KhEAp6JmYSbMAd7oVC3ZaF9h5a53shxsGYAp+J+3VbFoZApl83c1HvRqMSmBrk3ai7hL0W9yOApbqdjjpwNwLL9n0g7NK7CUTdigMtHsb3sGOGHxiYgWr/9a+UZ8x3Ymfhr/LumRdCrNJWUiGiTep/JQDcvdx4tGEt/wKO5eLzYT2JLgAAAABJRU5ErkJggg==";
    this.foto=document.getElementById('foto');

    //this.context.drawImage(this.video2,0,0, this.context.width, this.context.height);
    //this.canva.toDataURL('image/jpeg');

    const cameraSampleOptions: CameraSampleOptions = {
      quality: 50
    };

    /*const result = await CameraPreview.capture(cameraSampleOptions);
    const base64PictureData = result.value;
    this.myPic=`data:image/webp;base64,${base64PictureData}`;*/

    this.videoInterval=setInterval(async()=>{
      /*this.context.drawImage(this.video,0,0,this.context.width, this.context.height);
      //emitiendo imagen para video
      this.socketService.emit('stream',this.canva.toDataURL('image/webp'));*/

      const result = await CameraPreview.capture(cameraSampleOptions);
      const base64PictureData = `data:image/webp;base64,${result.value}`;
      this.myPic=`data:image/webp;base64,${base64PictureData}`;

      this.socketService.emit('stream',base64PictureData);

    },30);
  }

  stopCamera(){
    CameraPreview.stop();
    this.socketService.disconnect();
    this.cameraActive=false;
  }

  flipCamera(){
    CameraPreview.flip();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    clearInterval(this.videoInterval);
    console.log("onDestroy");

  }



  async takePicture(){
    const cameraPreviewPictureOptions: CameraPreviewPictureOptions = {
      quality: 50
    };
    const result = await CameraPreview.capture(cameraPreviewPictureOptions);
    const base64PictureData = result.value;
    this.myPic=`data:image/jpeg;base64,${base64PictureData}`;
  }


  /*
  ionViewWillLeave():void{
    clearInterval(this.videoInterval);
    console.log("ionViewWillLeave");

  }*/
}
