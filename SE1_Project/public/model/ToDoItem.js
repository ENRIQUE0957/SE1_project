export class ToDoItem {
    constructor(data, docId) {
        this.titleId = data.titleId;
        this.uid = data.uid;
        this.content = data.content;
        this.timestamp = data.timestamp;
        this.docId = docId;
    }

    set_docId(id) {
        this.docId = id;
    }

    toFirestore() {
        return {
            titleId: this.titleId,
            content: this.content,
            uid: this.uid,
            timestamp: this.timestamp,
        }
    }
}