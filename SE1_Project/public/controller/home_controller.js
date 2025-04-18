import { DEV } from "../model/constants.js";
import { ToDoTitle } from "../model/ToDoTitle.js";
import { currentUser } from "./firebase_auth.js";
import { addToDoTitle, deleteToDoItem, getToDoItemList, updateToDoItem } from "./firestore_controller.js";
import { progressMessage } from "../view/progress_message.js";
import { buildCard, buildCardText, createToDoItemElement } from "../view/home_page.js";
import { ToDoItem } from "../model/ToDoItem.js";
import { addToDoItem } from "./firestore_controller.js";

export async function onSubmitCreateForm(e) {
    e.preventDefault();
    const title = e.target.title.value;
    const uid = currentUser.uid;
    const timestamp = Date.now();
    const todoTitle = new ToDoTitle({title, uid, timestamp});

    const progress = progressMessage('Creating...');
    e.target.prepend(progress);

    let docId;
    try {
        docId = await addToDoTitle(todoTitle);
        todoTitle.set_docId(docId);
    } catch (e){
        if (DEV) console.log('failed to create: ', e);
        alert('Failed to creat: ' + JSON.stringify(e));
        progress.remove();
        return;
    }
    progress.remove();

    const container = document.getElementById('todo-container');
    container.prepend(buildCard(todoTitle));
    e.target.title.value = '';
}

export async function onClickExpandButton(e) {
    const button = e.target;
    const cardBody = button.parentElement;
    if (button.textContent == '+') {
        const cardText = cardBody.querySelector('.card-text');
        if (!cardText) {
            // read all existing todoItems
            const progress = progressMessage('Loading item list...');
            button.parentElement.prepend(progress);
            let itemList;
            try{
                itemList = await getToDoItemList(cardBody.id, currentUser.uid);
            } catch(e) {
                if (DEV) console.log('failed to get item list', e);
                alert('Failed to get item list: ' + JSON.stringify(e));
                progress.remove();
                return;
            }
            progress.remove();

            cardBody.appendChild(buildCardText(cardBody.id, itemList)); //titleDocId
        } else {
            cardText.classList.replace('d-none', 'd-block');
        }
        button.textContent = '-';
    } else {
        const cardText= cardBody.querySelector('.card-text');
        cardText.classList.replace('d-block', 'd-none');
        button.textContent = '+';
    }
}

export async function onKeyDownNewItemInput(e, titleDocId) {
    if (e.key != "Enter") return;
    const content = e.target.value;
    const titleId = titleDocId;
    const uid = currentUser.uid;
    const timestamp = Date.now();
    const todoItem = new ToDoItem({
        titleId, uid, content, timestamp,
    });

    const progress = progressMessage('Adding item...');
    e.target.parentElement.prepend(progress);
    try {
        const docId = await addToDoItem(todoItem);
        todoItem.set_docId(docId);
    } catch(e) {
        if (DEV) console.log('Failed to add item,', e);
        alert('Failed to save ToD0 Item ' + JSON.stringify(e));
        progress.remove();
        return;
    }

    progress.remove();

    const li = createToDoItemElement(todoItem);
    const cardBody = document.getElementById(e.target.id.substring(5));
    cardBody.querySelector('ul').appendChild(li);
    e.target.value = '';
}

export function onMouseOverItem(e) {
    const span = e.currentTarget.children[0];
    const input = e.currentTarget.children[1];
    span.classList.replace('d-block', 'd-none');
    input.classList.replace('d-none', 'd-block');
}

export function onMouseOutItem(e) {
    const span = e.currentTarget.children[0];
    const input = e.currentTarget.children[1];
    input.value = span.textContent; //reset if changed without saving
    span.classList.replace('d-none', 'd-block');
    input.classList.replace('d-block', 'd-none');
}

export async function onKeyDownUpdateItem(e) {
    if (e.key != 'Enter') return;

    const li = e.target.parentElement;
    const progress = progressMessage('Updating...');
    li.parentElement.prepend(progress);

    const content = e.target.value.trim();
    if(content.length == 0) {
        // delete the item if empty
        try {
            await deleteToDoItem(li.id);
            li.remove();
        } catch(e) {
            if (DEV) console.log('failed to delete', e);
            alert('Failed to delete: ' + JSON.stringify(e));
        }
    } else{
        //update the item
        const update = {content};
        try {
            await updateToDoItem(li.id, update);
            const span = li.children[0];
            span.textContent = content;
            const input = li.children[1];
            input.value = content;
        } catch (e) {
            if (DEV) console.log('failed to update', e);
            alert('Failed to update: ' + JSON.stringify(e));
        }
    }

    progress.remove();
}