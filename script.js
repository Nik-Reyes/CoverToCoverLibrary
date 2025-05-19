const myLibrary = [
  {
    image: 'assets/images/dune(penguinGalaxy).jpg',
    title: 'Dune',
    author: 'Frank Herbert',
    pages: 694,
  },
  {
    image: 'assets/images/neuromancer(penguinGalaxy).jpg',
    title: 'Neuromancer',
    author: 'William Gibson',
    pages: 277,
  },
  {
    image: 'assets/images/hyperion(delRey).jpg',
    title: 'Hyperion',
    author: 'Dan Simmons',
    pages: 483,
  },
];
const form = document.querySelector('#book-form');
const imgElement = document.querySelector('#image');
const imageReader = createImageReader();

imgElement.addEventListener('change', imageReader.handleFileChange);
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const bookMeta = getBookMetaObject(e.target);
  const cleanedBook = cleanInput(bookMeta);
  const finalBookData = processImageData(cleanedBook);
  createNewBook(finalBookData);
  // displayBooks(myLibrary);
  // e.target.reset();
  // console.log('test');
});

// let JS look for input elements instead of manual search/query
const getBookMetaObject = function (form) {
  // FormData returns an iterable object of key value pairs (name attribute of input is the key, the input value is the value)
  const formData = new FormData(form);

  // Object.fromEntries transforms the FormData iterable into an object of key value pairs
  return Object.fromEntries(formData);
};

const cleanInput = function (obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (value instanceof Object) return [key, value];
      return [key, value.trim()];
    }),
  );
};

function createImageReader() {
  let imageData = null;

  return {
    handleFileChange: function (e) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        imageData = reader.result;
      };
      reader.readAsDataURL(file);
    },
    getImageData: function () {
      return imageData;
    },
  };
}

function processImageData(obj) {
  if (obj.image) {
    obj.image = imageReader.getImageData() || 'assets/images/defaultCover.jpg';
    return obj;
  }
}

const Book = function (bookMeta) {
  if (!new.target) {
    throw Error("Cannot use constructor without the 'new' keyword");
  }
  this.title = bookMeta.title;
  this.author = bookMeta.author;
  this.pages = parseInt(bookMeta.pages);
  this.image = bookMeta.image;
  this.ID = crypto.randomUUID();
};

const createNewBook = function (bookMeta) {
  const newBook = new Book(bookMeta);
  myLibrary.push(newBook);
  console.log(myLibrary);
  return newBook;
};

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
  // create div.book
  const bookElement = document.createElement('div');
  bookElement.dataset.idx = book.ID;
  // div.book-cover-wrapper
  const bookCoverWrapper = document.createElement('div');
  // div.book-cover
  const bookCover = document.createElement('img');
  bookCover.src = book.image;
  bookCover.alt = 'Count Zero Book Cover';
  bookCover.className = 'book-cover';
  bookCover.onload = function () {
    const height = this.naturalHeight;
    const width = this.naturalWidth;
  };
  // div.book-meta
  const bookMeta = document.createElement(div);

  // Create all meta data (title, author, pages)
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

// clearing all child elements of the book container and in the same veign
// using the myLibrary array to place them all back acts as a refresh
function displayBooks() {
  // div.book-collection
  const bookCollection = document.querySelector('.book-collection');

  // clear all child elements
  deleteChildElements(bookCollection);

  // get the book keys (all books have the same keys)
  const bookKeys = Object.keys(myLibrary[0]);

  myLibrary.forEach((book) => {
    // get the book values from the key value pair, excluding the ID
    const bookValues = getBookValues(book);

    // create the book element with the book object keys and values
    // const bookElement = createBookElement(book, bookValues, bookKeys);
    // bookCollection.append(bookElement);
  });
}

// displayBooks(myLibrary);
