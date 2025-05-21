const myLibrary = [];
const imageHandler = createImageHandler();

// make the image.width/height that of the default image in case none is uploaded
window.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#book-form');
  const imgElement = document.querySelector('#image');
  const showFormButton = document.querySelector('.show-form');
  showFormButton.addEventListener('click', showForm);
  imgElement.addEventListener('change', imageHandler.handleFileChange);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const bookMeta = getBookMetaObject(e.target);
    const cleanedBook = cleanInput(bookMeta);
    const finalBookData = processImageData(cleanedBook);
    const newBook = createNewBook(finalBookData);
    displayBooks();
    reset(e.target);
  });

  [
    {
      image: 'assets/images/dune(penguinGalaxy).jpg',
      title: 'Dune (Penguin Galaxy Edition)',
      author: 'Frank Herbert',
      pages: 694,
      imageWidth: 420,
      imageHeight: 650,
    },
    {
      image: 'assets/images/neuromancer(penguinGalaxy).jpg',
      title: 'Neuromancer (Penguin Galaxy Edition)',
      author: 'William Gibson',
      pages: 277,
      imageWidth: 420,
      imageHeight: 650,
    },
    {
      image: 'assets/images/hyperion(delRey).jpg',
      title: 'Hyperion',
      author: 'Dan Simmons',
      pages: 483,
      imageWidth: 420,
      imageHeight: 650,
    },
  ].forEach((book) => {
    createNewBook(book);
  });

  displayBooks(form);

  const bookCollection = document.querySelector('.book-collection');
  bookCollection.addEventListener('click', (e) => {
    const button = e.target.closest('.btn.read-opt');
    if (button && bookCollection.contains(button)) {
      const currentShelfMenu = button.querySelector('.shelf-menu');
      if (currentShelfMenu) {
        currentShelfMenu.style.display =
          currentShelfMenu.style.display === 'none' ? 'grid' : 'none';
      }
    }
  });
});

function createImageHandler() {
  let imageData = null;
  const defaultImagePath = 'assets/images/defaultCover.jpg';

  return {
    handleFileChange: function (e) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/') === false) return;

      const reader = new FileReader();
      reader.readAsDataURL(file); //encode in base 64 (string)
      // when the FileReader encodes the file, reader.onload runs
      reader.onloadend = () => {
        imageData = reader.result;
      };
    },
    getImageData: function () {
      return imageData;
    },
    getDefaultImagePath: function () {
      return defaultImagePath;
    },
    resetImgData: function () {
      imageData = null;
    },
  };
}

function showForm() {
  const form = document.querySelector('#book-form');
  form.classList.remove('hide');
}

function processImageData(obj) {
  if (!imageHandler.getImageData()) {
    obj.image = imageHandler.getDefaultImagePath();
    return obj;
  }
  if (imageHandler.getImageData()) {
    obj.image = imageHandler.getImageData();
  }
  return obj;
}

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

const Book = function (bookMeta) {
  if (!new.target) {
    throw Error("Cannot use constructor without the 'new' keyword");
  }
  this.title = bookMeta.title;
  this.author = bookMeta.author;
  this.pages = parseInt(bookMeta.pages) || '';
  this.image = bookMeta.image;
  this.imageWidth = bookMeta.imageWidth || 420;
  this.imageHeight = bookMeta.imageHeight || 650;
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

const createBookElement = function (book) {
  const bookElement = document.createElement('div');
  bookElement.dataset.id = book.ID;
  bookElement.className = 'book';

  const bookCoverWrapper = createBookCover(book);
  const bookMetaElement = createBookMetaElement(book);
  const bookButton = createBookReadStateButton(book);
  const editButton = createEditButton(book);

  const rightColumn = document.createElement('div');
  rightColumn.className = 'right-column';
  rightColumn.append(bookMetaElement, bookButton);

  bookElement.append(bookCoverWrapper, rightColumn, editButton);
  return bookElement;
};

const createEditButton = function () {
  const editButton = document.createElement('button');
  editButton.className = 'book-edit';
  const editButtonSpan = document.createElement('span');
  editButtonSpan.innerText = 'Edit';
  editButton.appendChild(editButtonSpan);
  return editButton;
};

const createBookCover = function (book) {
  const bookCoverWrapper = document.createElement('div');
  bookCoverWrapper.className = 'book-cover-wrapper';

  const bookCover = document.createElement('img');
  bookCover.className = 'book-cover';
  bookCover.alt = `${book.title.toLowerCase()} book cover`;
  bookCover.src = book.image;
  bookCover.width = book.imageWidth;
  bookCover.height = book.imageHeight;
  bookCoverWrapper.appendChild(bookCover);
  return bookCoverWrapper;
};

const createBookMetaElement = function (book) {
  const bookMetaElement = document.createElement('div');
  bookMetaElement.className = 'book-meta';

  const bookMetaChildTitle = document.createElement('div');
  bookMetaChildTitle.className = 'title';
  const bookSpanTitle = document.createElement('span');
  bookSpanTitle.innerText = book.title;
  bookMetaChildTitle.appendChild(bookSpanTitle);

  const bookMetaChildAuthor = document.createElement('div');
  bookMetaChildAuthor.className = 'author';
  const bookSpanAuthor = document.createElement('span');
  bookSpanAuthor.innerText = `by ${book.author}`;
  bookMetaChildAuthor.appendChild(bookSpanAuthor);

  const bookMetaChildPages = document.createElement('div');
  bookMetaChildPages.className = 'pages';
  const bookSpanPages = document.createElement('span');
  bookSpanPages.innerText = !book.pages ? '' : `pages ${book.pages}`;
  bookMetaChildPages.appendChild(bookSpanPages);

  bookMetaElement.append(
    bookMetaChildTitle,
    bookMetaChildAuthor,
    bookMetaChildPages,
  );

  return bookMetaElement;
};

const createBookReadStateButton = function () {
  const button = document.createElement('div');
  button.classList.add('btn', 'read-opt');

  const buttonSpan = document.createElement('span');
  buttonSpan.className = 'button-text';
  buttonSpan.innerText = 'Want to read';
  button.appendChild(buttonSpan);

  const buttonMenu = document.createElement('div');
  buttonMenu.className = 'shelf-menu';
  buttonMenu.style.display = 'none';

  const readShelf = document.createElement('button');
  readShelf.className = 'read';
  readShelf.innerText = 'Read';
  const wantToReadShelf = document.createElement('button');
  wantToReadShelf.className = 'w-t-r';
  wantToReadShelf.innerText = 'Want to read';
  const currentReadShelf = document.createElement('button');
  currentReadShelf.className = 'current-read';
  currentReadShelf.innerText = 'Currently reading';

  buttonMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    const shelfButton = e.target.closest('.read, .w-t-r, .current-read');
    if (shelfButton) {
      const buttonText = e.target.closest('.btn').querySelector('.button-text');
      buttonText.innerText = shelfButton.innerText;
      buttonMenu.style.display = 'none';
    }
  });
  buttonMenu.append(readShelf, wantToReadShelf, currentReadShelf);
  button.appendChild(buttonMenu);

  return button;
};

// clearing all child elements to refresh cards
function displayBooks() {
  const bookCollection = document.querySelector('.book-collection');
  deleteChildElements(bookCollection);
  myLibrary.forEach((book) => {
    const bookElement = createBookElement(book);
    bookCollection.appendChild(bookElement);
  });
}

function reset(form) {
  if (imageHandler.getImageData()) imageHandler.resetImgData();
  form.reset();
  form.classList.add('hide');
}
