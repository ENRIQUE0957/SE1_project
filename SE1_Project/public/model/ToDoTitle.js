export class ToDoTitle {
    constructor(data, docId) {
        this.title = data.title;
        this.uid = data.uid;
        this.timestamp = data.timestamp;
        this.docId = docId;
    }

    set_docId(id){
        this.docId = id;
    }

    toFirestore() {
        return {
            title: this.title,
            uid: this.uid,
            timestamp: this.timestamp,
        }
    }
}