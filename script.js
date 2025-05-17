const myLibrary = [];
const inputButton = document.querySelector('.add-book');

inputButton.addEventListener('click', (e) => {
  e.preventDefault();
  const bookInfo = getInputControls(e);
  bookObject(bookInfo);
});

// let JS look for input elements instead of manual search/query
const getInputControls = function (e) {
  const formElements = Array.from(e.target.form.elements);
  return formElements
    .filter((element) => element instanceof HTMLInputElement)
    .map((input) => input.value);
};

// constructor to create book object
const Book = function (title, author, pages) {
  this.title = title;
  this.author = author;
  this.pages = pages;
};

// uses inputs and Book contructor to create book object
const bookObject = function (bookInfo) {
  myLibrary.push(new Book(bookInfo[0], bookInfo[1], bookInfo[2]));
  console.log(myLibrary);
};

//  Then, add a separate function to the script (not inside the constructor) that
//  can take some arguments , create a book from those arguments (bookObject), and store the new book
//  object into an array (storeBook).
