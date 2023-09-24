const errorMessages = {
  noRegister:
    'Could not register the user - მომხმარებლის დარეგისტრირება ვერ მოხერხდა',
  internalError: 'Something went wrong - დაფიქსირდა შეცდომა',
  uniqueAuthConstraintError:
    'User already exists with this info - მომხმარებელი ამ მონაცემებით უკვე არსებობს',
  missingFields: 'Missing required fields - შეავსეთ სავალდებულო ველები',
  invalidCredentials: 'Invalid Credentials - არასწორი მონაცემები',
  invalidRequest: 'Invalid Request - არასწორი მოთხოვნა',
  expiredLink: 'Link is expired - ბმული აღარ არის ვალიდური',
  unauthenticated:'Unauthenticated - არაავტორიზებული მოთხოვნა'
};

const successMessages = {
  registerSuccess: 'User registered - მომხმარებელი დარეგისტრირდა',
  emailSent:
    'E-mail has been sent,Please check - ვერიფიკაციის ლინკი გამოგზავნილია. გთხოვთ შეამოწმეთ ელ-ფოსტა',
  passwordResetSuccess:
    'Password changed succesfully - პაროლი წარმატებით შეიცვალა',
};

export { errorMessages, successMessages };
