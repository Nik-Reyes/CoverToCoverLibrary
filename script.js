const myLibrary = [];
const imageHandler = createImageHandler();

window.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#book-form');
  form.reset();

  const openDialog = document.querySelector('.open-dialog');
  const closeButton = document.querySelector('.close-button');
  const dialog = document.querySelector('#book-form-dialog');
  openDialog.addEventListener('click', () => dialog.showModal());
  closeButton.addEventListener('click', (e) => {
    if (e.target.closest('.close-button')) {
      closeDialog(dialog, form);
    }
  });
  dialog.addEventListener('click', (e) => {
    if (e.target.tagName === 'DIALOG') {
      closeDialog(dialog, form);
    }
  });

  const fileInput = document.querySelector('#file-input');
  fileInput.addEventListener('change', imageHandler.handleFileChange);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    closeDialog(dialog);
    const bookMeta = getBookMetaObject(e.target);
    const cleanedBook = cleanInput(bookMeta);
    const finalBookData = assignBookCover(cleanedBook);
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

  let previousButton = '';
  document.addEventListener('click', (e) => {
    const clickedButton = e.target.closest('.btn.read-state');
    const shelfMenus = document.querySelectorAll('.shelf-menu');

    // close all shelf menus
    shelfMenus.forEach((shelfMenu) => {
      if (shelfMenu && shelfMenu.style.display !== 'none') {
        shelfMenu.style.display = 'none';
      }
    });

    // open the clicked shelf menu
    if (
      clickedButton &&
      clickedButton.closest('.book').dataset.id !== previousButton
    ) {
      e.stopPropagation();
      previousButton = clickedButton.closest('.book').dataset.id;
      const shelf = clickedButton.querySelector('.shelf-menu');
      if (shelf.style.display !== 'none') {
        shelf.style.display = 'none';
      } else {
        shelf.style.display = 'grid';
      }
    } else {
      if (previousButton) previousButton = '';
    }
  });

  document.addEventListener('click', (e) => {
    e.stopPropagation();
    if (e.target.closest('.read, .w-t-r, .current-read')) {
      const currentBook = e.target.closest('.book');
      const bookCheck = bookExists(currentBook);
      if (bookCheck.result) {
        const newState = e.target.innerText;
        myLibrary[bookCheck.bookIndex].setReadState(newState);
        const parentButton = e.target.closest('.btn.read-state');
        const previousState = parentButton.querySelector('.button-text');
        previousState.innerText = newState;
        const shelfMenu = e.target.closest('.shelf-menu');
        shelfMenu.style.display = 'none';
      }
    }
  });

  document.addEventListener('click', (e) => {
    e.stopPropagation();
    if (e.target.closest('.delete-button img')) {
      const currentBook = e.target.closest('.book');
      const bookCheck = bookExists(currentBook);
      if (bookCheck.result) {
        myLibrary.splice(bookCheck.bookIndex, 1);
        currentBook.remove();
      }
    }
  });
});

function closeDialog(dialog, form) {
  dialog.setAttribute('termination', '');
  dialog.addEventListener(
    'animationend',
    () => {
      dialog.removeAttribute('termination');
      dialog.close();
      reset(form);
    },
    { once: true },
  );
}

function bookExists(element) {
  const elementID = parseInt(element.dataset.id);
  if (!elementID) {
    throw Error('Element has no dataset attribute');
  }
  const index = myLibrary.findIndex((book) => book.ID === elementID);
  if (index === -1) {
    return { result: false, bookIndex: index };
  }
  return { result: true, bookIndex: index };
}

function createImageHandler() {
  let imageURL = null;
  let fileValidity = false;
  const defaultImagePath = 'assets/images/defaultCover.jpg';
  const validfFileTypes = ['jpg', 'jpeg', 'webp', 'png'];

  return {
    handleFileChange: function (e) {
      const file = e.target.files[0];
      imageHandler.setFileValidity(file);
      const element = this;

      if (document.querySelector('.message')) {
        document.querySelector('.message').remove();
      }

      if (!imageHandler.getFileValidity()) {
        showMessage(
          element,
          'Unsupported file type. Supported file types: .jpg, .jpeg, .webp, .png',
          'error',
        );
        element.value = ''; //clear value when false so submit does not submit file
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file); //encode in base 64 (string)
      // when the FileReader encodes the file, reader.onload runs
      reader.onloadend = () => {
        imageURL = reader.result;
      };
      reader.onerror = () => {
        showMessage(
          element,
          'Error: unable to upload file. Please try again',
          'error',
        );
      };
    },
    getImageURL: function () {
      return imageURL;
    },
    getDefaultImagePath: function () {
      return defaultImagePath;
    },
    resetImgURL: function () {
      imageURL = null;
    },
    getFileValidity: function () {
      return fileValidity;
    },
    setFileValidity: function (file) {
      const fileType = file.type;
      if (validfFileTypes.some((type) => fileType.endsWith(type))) {
        fileValidity = true;
      }
    },
  };
}

function showMessage(element, message, type) {
  const messageBlock = document.createElement('div');
  messageBlock.className = 'message';
  const messageBlockSpan = document.createElement('span');
  messageBlockSpan.innerText = message;
  if (type === 'error') {
    messageBlockSpan.style.color = 'red';
    messageBlock.classList.add('error-message');
  }
  messageBlock.appendChild(messageBlockSpan);
  element.after(messageBlock);
}

function assignBookCover(obj) {
  if (!imageHandler.getImageURL()) {
    obj.image = imageHandler.getDefaultImagePath();
    return obj;
  }
  if (imageHandler.getImageURL()) {
    obj.image = imageHandler.getImageURL();
  }
  return obj;
}

const getBookMetaObject = function (form) {
  const formData = new FormData(form);
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
  this.readState = bookMeta.readState || 'Want to read';
  this.ID = Date.now() + Math.floor(Math.random() * 1000);
};

Book.prototype.setReadState = function (newState) {
  if (Object.hasOwn(this, 'readState')) {
    this.readState = newState;
  }
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
  const bookButton = createReadingStateButton(book);
  const editButton = createEditButton(book);
  const deleteButton = createDeleteButton();

  const buttonRow = document.createElement('div');
  buttonRow.className = 'book-button-row';
  buttonRow.append(bookButton, deleteButton);

  const rightColumn = document.createElement('div');
  rightColumn.className = 'right-column';
  rightColumn.append(bookMetaElement, buttonRow);

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

const createReadingStateButton = function () {
  const button = document.createElement('div');
  button.classList.add('btn', 'read-state');

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

  buttonMenu.append(readShelf, wantToReadShelf, currentReadShelf);
  button.appendChild(buttonMenu);

  return button;
};

const createDeleteButton = function () {
  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-button';
  const deleteButtonImg = document.createElement('img');
  deleteButtonImg.src = 'assets/svgs/delete.svg';
  deleteButtonImg.alt = 'delete button';
  deleteButtonImg.width = deleteButtonImg.naturalWidth;
  deleteButtonImg.height = deleteButtonImg.naturalHeight;
  deleteButton.appendChild(deleteButtonImg);
  return deleteButton;
};

function displayBooks() {
  const bookCollection = document.querySelector('.book-collection');
  deleteChildElements(bookCollection);
  myLibrary.forEach((book) => {
    const bookElement = createBookElement(book);
    bookCollection.appendChild(bookElement);
  });
}

function reset(form) {
  if (imageHandler.getImageURL()) imageHandler.resetImgURL();
  form.reset();
}
