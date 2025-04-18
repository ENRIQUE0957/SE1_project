import { 
    getFirestore,
    collection,
    addDoc,
    query,
    where,
    orderBy,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js"

import { app } from "./firebase_core.js";
import { ToDoItem } from "../model/ToDoItem.js";
import { ToDoTitle } from "../model/ToDoTitle.js";


const db = getFirestore(app);
const TODO_TITLE_COLLECTION = 'todo_titles';
const TODO_ITEM_COLLECTION = 'todo_items';

export async function addToDoTitle(todoTitle) {
   const docRef = await addDoc(collection(db, TODO_TITLE_COLLECTION), todoTitle.toFirestore());
   return docRef.id;
}

export async function addToDoItem(todoItem) {
    const docRef = await addDoc(collection(db, TODO_ITEM_COLLECTION), todoItem.toFirestore());
    return docRef.id;
 }

 export async function getToDoItemList(titleDocId, uid) {
    let itemList = [];
    const q = query(collection(db, TODO_ITEM_COLLECTION),
    where('uid', '==', uid), 
    where('titleId', '==', titleDocId), 
    orderBy('timestamp'),
    );
    const snapShot = await getDocs(q);
    snapShot.forEach(doc => {
        const item = new ToDoItem(doc.data(), doc.id);
        itemList.push(item);
    });
    return itemList;
 }

 export async function getToDoTitleList(uid) {
    let titleList = [];
    const q = query(collection(db, TODO_TITLE_COLLECTION),
        where('uid', '==', uid),
        orderBy('timestamp', 'desc')
    );

    const snapShot = await getDocs(q);
    snapShot.forEach(doc => {
        const t = new ToDoTitle(doc.data(), doc.id);
        titleList.push(t);
    });

    return titleList;
 }

 export async function updateToDoItem(docId, update) {
    const docRef = doc(db, TODO_ITEM_COLLECTION, docId);
    await updateDoc(docRef, update);
 }

 export async function deleteToDoItem(itemId) {
    const docRef = doc(db, TODO_ITEM_COLLECTION, itemId);
    await deleteDoc(docRef);
 }

 export async function getAllToDoTitles(uid) {
   const db = getFirestore();
   const titlesCollection = collection(db, "todoTitles");
   const snapshot = await getDocs(titlesCollection);
   const titles = snapshot.docs
       .map((doc) => ({ docId: doc.id, ...doc.data() }))
       .filter((title) => title.uid === uid); // Filter by user ID
   return titles;
}