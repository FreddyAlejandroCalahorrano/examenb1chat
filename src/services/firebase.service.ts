import {Injectable} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import * as CryptoJS from 'crypto-js';
import { Observable } from 'rxjs';
import {switchMap,map } from 'rxjs/operators';

  export interface User {
    uid: string;
    email: string;
  }
   
  export interface Message {
    createdAt: firebase.firestore.FieldValue;
    id: string;
    from: string;
    msg: string;
    fromName: string;
    myMsg: boolean;
  }
   
  @Injectable({
    providedIn: 'root'
  })
  export class FirebaseService {
    currentUser: User = null;
    msgDesEncryp:string;
   
    constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
      this.afAuth.onAuthStateChanged((user) => {
        console.log('Cambio: ', user)
        this.currentUser = user;
      });
    }
   
    async signup({ email, password }): Promise<any> {
      const credential = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
   
      console.log('resultado: ', credential)
      const uid = credential.user.uid;
   
      return this.afs.doc(
        
        `users/${uid}`
      ).set({
        uid,
        email: credential.user.email,
      });
    }
   
    logIn({ email, password }) {
      return this.afAuth.signInWithEmailAndPassword(email, password);
    }
   
    logOut(): Promise<void> {
      return this.afAuth.signOut();
    }
   
    addChatMessage(msg){
      return this.afs.collection('messages').add({
        msg,
        from: this.currentUser.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
    }
  
    getChatMessages(){
      let users =[];
  
      return this.getUsers().pipe(
        switchMap(res => {
          users = res;
          console.log('Todos los usuarios', users);
          return this.afs.collection('messages', ref => ref.orderBy('createdAt')).valueChanges({idField: 'id'}) as Observable<Message[]>;
        }),
        map(messages => {
          for (let m of messages){
            this.msgDesEncryp = CryptoJS.AES.decrypt(m.msg, "EstaEsUnaClave").toString(CryptoJS.enc.Utf8);
            m.msg = this.msgDesEncryp;
            //
            m.fromName = this.getUserForMsg(m.from, users);
            m.myMsg = this.currentUser.uid === m.from;
          }
          console.log('todos los mensajes: ', messages)
  
          return messages;
        })
      )
    }

    getUsers(){
      return this.afs.collection('users').valueChanges({idField: 'uid'}) as Observable<User[]>
    }
  
    getUserForMsg(msgFromId, users: User[]): string{
      for(let usr of users){
        if (usr.uid == msgFromId){
          return usr.email;
        }
      }
      return 'Eliminado';
    }
  
  }