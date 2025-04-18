export class Category {
    constructor(data, docId) {
      this.name = data.name;
      this.color = data.color || '#000000';
      this.userId = data.userId;
      this.createdAt = data.createdAt;
      this.updatedAt = data.updatedAt;
  
      this.docId = docId;
    }
  
    set_docId(id) {
      this.docId = id;
    }
  
    toFirestore() {
      return {
        name: this.name,
        color: this.color,
        userId: this.userId,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      };
    }
  }
  