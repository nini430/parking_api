const errorMessages = {
  noRegister:
    'Could not register the user - მომხმარებლის დარეგისტრირება ვერ მოხერხდა',
  internalError: 'Something went wrong - დაფიქსირდა შეცდომა',
  uniqueConstraintError:
    'Duplicate detected - მონაცემები უკვე არსებობს',
  missingFields: 'Missing required fields - შეავსეთ სავალდებულო ველები',
  invalidCredentials: 'Invalid Credentials - არასწორი მონაცემები',
  invalidRequest: 'Invalid Request - არასწორი მოთხოვნა',
  expiredLink: 'Link is expired - ბმული აღარ არის ვალიდური',
  unauthenticated:'Unauthenticated - არაავტორიზებული მოთხოვნა',
  notFound:'Not Found - არ მოიძებნა',
  seedError:'Error seeding',
  notEnoughBalance:'Not enough balance on account - ანგარიშზე საკმარისი თანხა არ არის'
};

const successMessages = {
  registerSuccess: 'User registered - მომხმარებელი დარეგისტრირდა',
  emailSent:
    'E-mail has been sent,Please check - ვერიფიკაციის ლინკი გამოგზავნილია. გთხოვთ შეამოწმეთ ელ-ფოსტა',
  passwordResetSuccess:
    'Password changed succesfully - პაროლი წარმატებით შეიცვალა',
  automobileDeleteSuccess:'Automobile deleted succesfully - ავტომობილი წარმატებით წაიშალა',
  seedSuccess:'Seed completed succesfully',
  zoneDeleteSuccess:'Zone deleted succesfully - პარკირების ზომა წარმატებით წაიშალა',
  parkingCreateSuccess:'Parking card created - თქვენ შეიძინეთ ზონაზე პარკირება',
  parkingDeleteSuccess:'Parking canceled succesfully - ზონაზე თქვენი პარკირება გაუქმდა'
};

export { errorMessages, successMessages };
