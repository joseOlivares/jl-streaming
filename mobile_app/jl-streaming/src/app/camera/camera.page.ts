import { Component, OnDestroy, OnInit } from '@angular/core';
import { SocketioService } from '../services/socketio.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})
export class CameraPage implements OnInit, OnDestroy {
  canva:any;
  context:any;
  video:any;

  videoInterval:any;

    // video constraints
   constraints = {
      video: {
        width: {
          min: 1280,
          ideal: 1920,
          max: 2560,
        },
        height: {
          min: 720,
          ideal: 1080,
          max: 1440,
        },
        facingMode:'user'
      },
    };

    // use front face camera
    useFrontCamera :boolean = true;

    // current video stream
     videoStream:any;


  constructor(private socketService:SocketioService) { }


  ngOnInit() {
    this.canva=document.querySelector('#canva');
    this.context=this.canva.getContext('2d');
    this.video=document.querySelector('#video');

    this.canva.style.display='none';
    this.canva.width=1280; //this.video.videoWidth;
    this.canva.height=720; //this.video.videoHeight;
    this.context.width=this.canva.width;
    this.context.height=this.canva.height;


   this.initializeCamera();

  }


  async initializeCamera(){
    const navigator = window.navigator as any;//se agregó solo para pruebas, no es necesario
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      console.log("initializeCamera");
       this.constraints.video.facingMode=this.useFrontCamera ? "user" : "environment";
      try {
        this.videoStream = await navigator.mediaDevices.getUserMedia(this.constraints);
        this.video.srcObject = this.videoStream;
        this.streamVideo();
        //emitiendo imagen para video
        //this.socketService.streamVideo(this.canva);

      } catch (err) {
        alert("No se puede acceder a la camara");
      }

    }else{
        alert("No se puede acceder a la cámara, revise los permisos");

    }

  }

  streamVideo(){
    this.videoInterval=setInterval(()=>{
      this.context.drawImage(this.video,0,0,this.context.width, this.context.height);
      //emitiendo imagen para video
      this.socketService.streamVideo(this.canva);
    },30)
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    clearInterval(this.videoInterval);
    console.log("onDestroy");

  }

  /*
  ionViewWillLeave():void{
    clearInterval(this.videoInterval);
    console.log("ionViewWillLeave");

  }*/
}
