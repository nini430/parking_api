const errorMessages = {
  noRegister:
    'Could not register the user - მომხმარებლის დარეგისტრირება ვერ მოხერხდა',
  internalError: 'Something went wrong - დაფიქსირდა შეცდომა',
  uniqueAuthConstraintError:
    'User already exists with this info - მომხმარებელი ამ მონაცემებით უკვე არსებობს',
  missingFields:'Missing required fields - შეავსეთ სავალდებულო ველები'
};

const successMessages = {
  registerSuccess: 'User registered - მომხმარებელი დარეგისტრირდა',
};

export { errorMessages, successMessages };
