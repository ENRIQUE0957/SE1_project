export class Task {
    constructor(data, docId) {
      this.taskTitle = data.taskTitle;                       // Task title (e.g., "Finish homework")
      this.userId = data.userId;                             // User who created the task
      this.content = data.content || '';                     // Description of the task
      this.createdAt = data.createdAt;                       // Timestamp when created
      this.updatedAt = data.updatedAt;                       // Timestamp when last updated
  
      this.dueDate = data.dueDate || null;                   // Optional due date
      this.category = data.category || 'General';            // Task category (e.g., "Work", "School")
      this.categoryColor = data.categoryColor || '#000000';  // Category color (e.g., "#FF0000")
      this.isCompleted = data.isCompleted || false;          // Completion status
      this.notes = data.notes || '';                         // Optional notes
  
      this.docId = docId;                                    // Firestore document ID
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
  