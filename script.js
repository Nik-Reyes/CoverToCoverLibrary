const myLibrary = [];
const imageReader = createImageReader();

// make the image.width/height that of the default image in case none is uploaded
window.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#book-form');
  const imgElement = document.querySelector('#image');

  imgElement.addEventListener('change', imageReader.handleFileChange);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const bookMeta = getBookMetaObject(e.target);
    const cleanedBook = cleanInput(bookMeta);
    const finalBookData = processImageData(cleanedBook);
    const newBook = createNewBook(finalBookData);
    displayBooks(e.target);
  });

  imageReader.loadDefaultImageData();

  [
    {
      image: 'assets/images/dune(penguinGalaxy).jpg',
      title: 'Dune',
      author: 'Frank Herbert',
      pages: 694,
      imageWidth: 1557,
      imageHeight: 2495,
    },
    {
      image: 'assets/images/neuromancer(penguinGalaxy).jpg',
      title: 'Neuromancer',
      author: 'William Gibson',
      pages: 277,
      imageWidth: 1571,
      imageHeight: 2504,
    },
    {
      image: 'assets/images/hyperion(delRey).jpg',
      title: 'Hyperion',
      author: 'Dan Simmons',
      pages: 483,
      imageWidth: 267,
      imageHeight: 400,
    },
  ].forEach((book) => {
    createNewBook(book);
  });
  displayBooks(form);
});

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
  let imageWidth = 0;
  let imageHeight = 0;
  const defaultImagePath = 'assets/images/defaultCover.jpg';
  let loadDefaultImage = false;

  return {
    handleFileChange: function (e) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/') === false) return;

      const reader = new FileReader();
      reader.readAsDataURL(file); //encode in base 64 (string)
      // when the FileReader encodes the file, reader.onload runs
      reader.onloadend = () => {
        imageData = reader.result;
        const img = new Image();
        img.src = imageData; // browser parses base 64 string (decodes it)
        // when its finished decoding img.onload runs
        img.onloadend = () => {
          imageWidth = img.width;
          imageHeight = img.height;
        };
      };
    },

    loadDefaultImageData: function () {
      if (loadDefaultImage) return;
      loadDefaultImage = true;

      const defaultImage = new Image();
      defaultImage.src = defaultImagePath; // browser makes HTTP request to fetch the image
      // when the image is fetched and decoded, onload runs
      defaultImage.onload = () => {
        // make sure no image was uploaded
        if (!imageData) {
          imageWidth = defaultImage.width;
          imageHeight = defaultImage.height;
        }
        loadDefaultImage = false;
      };
    },

    getImageData: function () {
      return imageData;
    },
    getImageWidth: function () {
      return imageWidth;
    },
    getImageHeight: function () {
      return imageHeight;
    },

    getDefaultImagePath: function () {
      return defaultImagePath;
    },
  };
}

function processImageData(obj) {
  if (obj.image) {
    if (imageReader.getImageData()) {
      obj.image = imageReader.getImageData();
      obj.imageWidth = imageReader.getImageWidth();
      obj.imageHeight = imageReader.getImageHeight();
    } else if (imageReader.getDefaultImagePath()) {
      obj.image = imageReader.getDefaultImagePath();
      imageReader.loadDefaultImageData(); // assures that the defualt width/height is loaded (user uploads --> cancels: make sure we have the default width height)
      obj.imageWidth = imageReader.getImageWidth();
      obj.imageHeight = imageReader.getImageHeight();
    }
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
  this.imageWidth = bookMeta.imageWidth;
  this.imageHeight = bookMeta.imageHeight;
  this.ID = Date.now() + Math.floor(Math.random() * 1000);
};

const createNewBook = function (bookMeta) {
  const newBook = new Book(bookMeta);
  myLibrary.push(newBook);
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

const createBookElement = function (book) {
  // create div.book
  const bookElement = document.createElement('div');
  bookElement.dataset.id = book.ID;
  bookElement.className = 'book';

  // div.book-cover-wrapper
  const bookCoverWrapper = document.createElement('div');
  bookCoverWrapper.className = 'book-cover-wrapper';

  // div.book-cover
  const bookCover = document.createElement('img');
  bookCover.className = 'book-cover';
  bookCover.alt = 'Count Zero Book Cover';
  bookCover.src = book.image;
  bookCover.width = book.imageWidth;
  bookCover.height = book.imageHeight;
  bookCoverWrapper.append(bookCover);

  // div.book-meta
  const bookMetaElement = document.createElement('div');
  bookMetaElement.className = 'book-meta';

  // meta data (title, author, pages)
  const bookMetaChildTitle = document.createElement('div');
  bookMetaChildTitle.className = 'title';
  const bookSpanTitle = document.createElement('span');
  bookSpanTitle.innerText = book.title;
  bookMetaChildTitle.append(bookSpanTitle);

  const bookMetaChildAuthor = document.createElement('div');
  bookMetaChildAuthor.className = 'author';
  const bookSpanAuthor = document.createElement('span');
  bookSpanAuthor.innerText = book.author;
  bookMetaChildAuthor.append(bookSpanAuthor);

  const bookMetaChildPages = document.createElement('div');
  bookMetaChildPages.className = 'pages';
  const bookSpanPages = document.createElement('span');
  bookSpanPages.innerText = book.pages;
  bookMetaChildPages.append(bookSpanPages);

  bookMetaElement.append(
    bookMetaChildTitle,
    bookMetaChildAuthor,
    bookMetaChildPages,
  );

  bookElement.append(bookCoverWrapper, bookMetaElement);

  return bookElement;
};

// clearing all child elements of the book container and in the same veign
// use the myLibrary array to place them all back, forcing a refresh
function displayBooks(form) {
  const bookCollection = document.querySelector('.book-collection');
  deleteChildElements(bookCollection);
  const bookKeys = Object.keys(myLibrary[0]);
  myLibrary.forEach((book) => {
    const bookValues = getBookValues(book);

    const bookElement = createBookElement(book, bookValues, bookKeys);
    bookCollection.append(bookElement);
  });
  form.reset();
}
