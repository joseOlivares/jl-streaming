import { Component, OnDestroy, OnInit } from '@angular/core';
import {Socket}from 'ngx-socket-io'

//@ts-ignore
import Webcam from '../../../node_modules/webcam-easy/dist/webcam-easy.min.js';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})
export class CameraPage implements OnInit, OnDestroy {

  videoInterval:any;
  cameraActive=false;

  webCam:any;
  FRONT_CAMERA='user';
  REAR_CAMERA='environment'
  camera=this.REAR_CAMERA;

  webCamHeight= window.screen.height - 200; //height of the camera
  webCamWidth= window.screen.width;//width of the camera display

  canvasElement:any;






  constructor(private socketService:Socket) { }


  ngOnInit() {


  }


  async initializeCamera(){
    this.socketService.connect();
    const webcamElement = document.getElementById('webcam');
    this.canvasElement = document.getElementById('canvas');
    const snapSoundElement = document.getElementById('snapSound');
    this.webCam = new Webcam(webcamElement, this.camera, this.canvasElement, snapSoundElement);

      this.webCam.start()
        .then((result: any)=>{
            console.log("webcam started");
            this.cameraActive=true;
        })
        .catch((err:any) => {
            console.log(err);
            this.cameraActive=false;
        });

  }

  startCamera(){
    this.socketService.connect();

    this.webCam.start()
      .then((result: any)=>{
        console.log("webcam started");
        this.cameraActive=true;
      })
      .catch((err:any) => {
          console.log(err);
          this.cameraActive=false;
      });
  }

  streamVideo(){
    let x=this.canvasElement.toDataURL('image/webp');
    debugger;
    /*
    this.videoInterval=setInterval(()=>{
        this.socketService.emit('stream',this.canvasElement.toDataURL('image/webp'));
    },30)
    */
  }

  flipCamera(){
    this.webCam.flip();
    this.webCam.start();
  }

  stopCamera(){
    this.webCam.stop();
    this.cameraActive=false;
    this.socketService.disconnect();
  }


  ngAfterViewInit(): void {
      this.initializeCamera(); //inicializando camara
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    clearInterval(this.videoInterval);
    console.log("onDestroy");

  }




}
