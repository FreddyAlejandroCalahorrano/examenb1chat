import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService, Message } from 'src/services/firebase.service';
import {Observable} from 'rxjs'
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  @ViewChild("content") content: any;


  messages: Observable<Message[]>;
  msgEncript:'';
  newMsg = '';
  passwordAES = 'EstaEsUnaClave';

  constructor(private chat: FirebaseService, private router: Router) { }

  ngOnInit() {

    this.messages =  this.chat.getChatMessages();
  }
  ejecutar(){
    this.sendMessage();
    this.scrollToBottom();
  }
  
  async sendMessage(){
    this.msgEncript = CryptoJS.AES.encrypt(this.newMsg.trim(),this.passwordAES.trim()).toString();
    this.chat.addChatMessage(this.msgEncript).then(()=>{
      this.newMsg = '';
      this.msgEncript='';
    })
  }

  scrollToBottom(){
    var contenEnd = document.getElementById("endContent").offsetTop;
    this.content.scrollToBottom(0, contenEnd, 300);
  }

  logOut(){
    this.chat.logOut().then(()=>{
      this.router.navigateByUrl('/', {replaceUrl: true});
    })
  }
}

