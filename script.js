const myLibrary = [];
const inputButton = document.querySelector('.add-book');

inputButton.addEventListener('click', (e) => {
  const bookMeta = getBookMetaObject(e);
  const newBook = createNewbook(bookMeta);
});

// let JS look for input elements instead of manual search/query
const getBookMetaObject = function (e) {
  const form = e.target.form;
  // FormData returns an iterable object of key value pairs (name attribute of input is the key, the input value is the value)
  const formData = new FormData(form);

  form.reset();
  // Object.fromEntries transforms the iterable into an object of key value pairs
  return Object.fromEntries(formData);
};

// constructor to create book object
const Book = function (bookMeta) {
  this.title = bookMeta.title;
  this.author = bookMeta.author;
  this.pages = bookMeta.pages;
  this.ID = crypto.randomUUID();
};

// uses inputs and Book contructor to create book object
const createNewbook = function (bookMeta) {
  const newBook = new Book(bookMeta);
  myLibrary.push(newBook);
  console.log(myLibrary);
  return newBook;
};
