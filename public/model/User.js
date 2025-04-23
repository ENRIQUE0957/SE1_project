export class User {
    constructor(data, docId) {
      this.userId = data.userId;
      this.email = data.email;
      this.displayName = data.displayName || 'New User';
      this.role = data.role || 'user';
      this.createdAt = data.createdAt;
      this.updatedAt = data.updatedAt;
      this.pfpUrl = data.pfpUrl || ''; // optional profile picture
  
      this.docId = docId;
    }
  
    set_docId(id) {
      this.docId = id;
    }
  
    toFirestore() {
      return {
        userId: this.userId,
        email: this.email,
        displayName: this.displayName,
        role: this.role,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        pfpUrl: this.pfpUrl,
      };
    }
  }
  