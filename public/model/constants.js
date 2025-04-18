export const DEV = true; // or false in production

export const collectionNames = {
    USERS: 'users',
    TASKS: 'tasks',
    NOTES: 'notes',
    CATEGORIES: 'categories',
    SETTINGS: 'settings' // optional, if user preferences are added
  };
  
  export const fieldNames = {
    CREATED_AT: 'createdAt',
    UPDATED_AT: 'updatedAt',
    USER_ID: 'userId',
    TITLE: 'title',
    DUE_DATE: 'dueDate',
    CATEGORY_ID: 'categoryId',
    IS_COMPLETED: 'isCompleted',
  };
  