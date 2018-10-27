import * as firebase from "firebase";
import {config} from './config'

firebase.initializeApp(config);

firebase
  .database()
  .ref()
  .child("asdf");
const databaseRef = firebase.database().ref();
export const todosRef = databaseRef.child("todos");
