const bookslist = document.getElementById("booksList");
const form = document.getElementById("form");
const searchBox = document.getElementById("searchBox");
const searchBtn = document.getElementById("searchBtn");

class Book {
  constructor(title, author, info) {
    this.title = title;
    this.author = author;
    this.info = info;
  }
}

searchBtn.addEventListener("click", e => {
  e.preventDefault();
  if (bookslist.hasChildNodes) {
    bookslist.innerHTML = "";
  }
  let name = searchBox.value;
  trimmed_name = name.toLowerCase().replace(/\s+/g, "-");
  console.log(trimmed_name);
  fetch(`https://www.googleapis.com/books/v1/volumes?q=${trimmed_name}`)
    .then(function(res) {
      return res.json();
    })
    .then(function(data) {
      //The following three lines get only first book result.
      // console.log(data.items[0].volumeInfo.title);
      // console.log(data.items[0].volumeInfo.authors[0]);
      // console.log(data.items[0].volumeInfo.imageLinks.thumbnail);

      //The follwoing code gets all the book results.
      books = data.items;
      books.slice(0, 4).forEach(book => {
        console.log(book.volumeInfo.title);
        console.log(book.volumeInfo.authors[0]);
        console.log(book.volumeInfo.imageLinks.thumbnail);
        card_output = `	
						<div class="card">
							<img class="card-img-top h-50 w-50 mx-auto px-1" src="${book.volumeInfo.imageLinks.smallThumbnail}" alt="Card image cap">
							<div class="card-body">
						  		<h5 class="card-title">Title: ${book.volumeInfo.title}</h5>
						  		<p class="card-text">Author: ${book.volumeInfo.authors[0]}</p>
						  		<a href="#" class="btn btn-primary" id="resulted_book">Add To My List</a>
							</div>
						  </div>
		`;
        bookslist.innerHTML += card_output;
      });
      buttons = document.querySelectorAll("#resulted_book");

      Array.from(buttons).forEach(button => {
        button.addEventListener("click", e => {
          const book = new Book(
            e.target.parentElement.childNodes[1].innerText.substring(7),
            e.target.parentElement.childNodes[3].innerText.substring(8),
            e.target.parentElement.parentElement.childNodes[1].src
          );
          console.log(book);
          UI.addBooks(book);
          Storage.addBook(book);
        });
      });
    });
});

class Storage {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    const books = Storage.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }
}

class UI {
  //Display book in the book-list table
  static showBooks() {
    const books = Storage.getBooks();

    books.forEach(book => UI.addBooks(book));
  }

  //Add book to the book-list table
  static addBooks(book) {
    const list = document.getElementById("books-list");

    const row = document.createElement("tr");

    row.innerHTML = `
            <td>${book.title} </td>
            <td>${book.author} </td>
            <td><img src="${book.info}"></td>            
            `;

    list.appendChild(row);
  }
}

// Show stored books event
document.addEventListener("DOMContentLoaded", UI.showBooks);
