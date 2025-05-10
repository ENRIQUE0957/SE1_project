export class Task {
  constructor(data, docId) {
    this.taskTitle = data.taskTitle;
    this.userId = data.userId;
    this.content = data.content || '';
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;

    this.dueDate = data.dueDate || null;
    this.category = data.category || 'General';
    this.categoryColor = data.categoryColor || '#000000';
    this.isCompleted = data.isCompleted || false;

    this.notes = data.notes || '';

    
    this.reminderTime = data.reminderTime || null; 
    this.reminderMethod = data.reminderMethod || 'popup'; 
    this.reminderSent = data.reminderSent || false;

    this.docId = docId;
  }

    set_docId(id) {
      this.docId = id;
    }
  
    toFirestore() {
      return {
        taskTitle: this.taskTitle,
        userId: this.userId,
        content: this.content,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
  
        dueDate: this.dueDate,
        category: this.category,
        categoryColor: this.categoryColor,
        isCompleted: this.isCompleted,
        notes: this.notes,
      };
    }
}
  