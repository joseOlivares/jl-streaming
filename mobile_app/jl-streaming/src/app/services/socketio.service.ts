import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';


@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  constructor(private socket: Socket) { }

 intervalo:any;

  streamVideo(canva:any){
    //debugger;
      this.socket.emit('stream',canva.toDataURL('image/webp'));

  }

  /*stopStreming(){
    clearInterval(this.intervalo);
  }*/
}
