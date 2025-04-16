export class ToDoItem {
    constructor(data, docId) {
        this.titleId = data.titleId;
        this.uid = data.uid;
        this.content = data.content;
        this.timestamp = data.timestamp;

        
        this.category = data.category || 'General';           //e.g., "School", "Health"
        this.categoryColor = data.categoryColor || '#000000'; //e.g., "#FF0000"
        this.isCompleted = data.isCompleted || false;         //true if marked as done
        this.notes = data.notes || '';                        // additional user notes

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

          
            category: this.category,
            categoryColor: this.categoryColor,
            isCompleted: this.isCompleted,
            notes: this.notes,
        }
    }
}
