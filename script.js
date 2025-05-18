const myLibrary = [
  { title: 'Dune', author: 'Frank Herbert', pages: 694 },
  { title: 'Neuromancer', author: 'William Gibson', pages: 277 },
  { title: 'Hyperion', author: 'Dan Simmons', pages: 483 },
];
const form = document.querySelector('#book-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const bookMeta = getBookMetaObject(e.target);
  const cleanedBook = cleanInput(bookMeta);
  createNewBook(cleanedBook);
  displayBooks(myLibrary);
  e.target.reset();
});

// let JS look for input elements instead of manual search/query
const getBookMetaObject = function (form) {
  // FormData returns an iterable object of key value pairs (name attribute of input is the key, the input value is the value)
  const formData = new FormData(form);

  // Object.fromEntries transforms the iterable into an object of key value pairs
  return Object.fromEntries(formData);
};

// constructor to create book object
const Book = function (bookMeta) {
  if (!new.target) {
    throw Error("Cannot use constructor without the 'new' keyword");
  }
  this.title = bookMeta.title;
  this.author = bookMeta.author;
  this.pages = parseInt(bookMeta.pages);
  this.ID = crypto.randomUUID();
};

// uses inputs and Book contructor to create book object
const createNewBook = function (bookMeta) {
  const newBook = new Book(bookMeta);
  myLibrary.push(newBook);
  return newBook;
};

// remove whitespaces from front and back of string
const cleanInput = function (obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      return [key, value.trim()];
    }),
  );
};

// clearing all child elements of the book container and in the same veign
// using the myLibrary array to place them all back acts as a refresh
function displayBooks() {
  const bookCollection = document.querySelector('.book-collection');

  // clear all child elements
  deleteChildElements(bookCollection);

  // get the book keys (all books have the same keys)
  const bookKeys = Object.keys(myLibrary[0]);

  myLibrary.forEach((book) => {
    // get the book values from the key value pair, excluding the ID
    const bookValues = getBookValues(book);

    // create the book element with the book object keys and values
    const bookElement = createBookElement(book, bookValues, bookKeys);
    console.log(bookElement);
    bookCollection.append(bookElement);
  });
}

function deleteChildElements(parent) {
  while (parent.hasChildNodes()) {
    parent.removeChild(parent.firstChild);
  }
}

const getBookValues = function (book) {
  return Object.values(
    Object.fromEntries(
      Object.entries(book)
        .filter(([key, value]) => key !== 'ID')
        .map(([key, value]) => {
          return [key, value === undefined || Number.isNaN(value) ? '' : value];
        }),
    ),
  );
};

const createBookElement = function (book, bookValues, bookKeys) {
  const bookElement = document.createElement('div');
  bookElement.dataset.idx = book.ID;
  for (let i = 0; i < bookValues.length; i++) {
    const bookChild = document.createElement('div');
    const bookSpan = document.createElement('span');
    const value = bookValues[i];
    bookSpan.innerText = value;
    bookChild.className = bookKeys[i];
    bookChild.appendChild(bookSpan);
    bookElement.append(bookChild);
    bookElement.className = 'book';
  }
  return bookElement;
};

displayBooks(myLibrary);
