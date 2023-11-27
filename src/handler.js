/* eslint-disable linebreak-style */
/* eslint-disable eqeqeq */
/* eslint-disable no-else-return */
/* eslint-disable linebreak-style */
// eslint-disable-next-line linebreak-style
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */
// eslint-disable-next-line import/no-extraneous-dependencies
const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading, 
  } = request.payload;

  const id = nanoid(16);

  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  // Server Gagal Bila Nama tidak dilampirkan
  if (name === undefined) {
    const response = h.response({
      status: 'fail', message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (readPage >= pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  } else {
    const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
    };
  
    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
    }
  }
};
// Kriteria 4 : API dapat menampilkan seluruh buku
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  if (name === undefined) {
    const response = h
      .response({
        status: 'success',
        data: {
          books: books.map((book) => ({
            id: book.id, name: book.name, publisher: book.publisher,
          })),
        },
      });
    response.code(200);
    return response;
  } else if (reading === undefined) {
    const Readings = books.filter((book) => book.reading === false);
    const response = h.response({
      status: 'success',
      data: {
        books: Readings.map((book) => ({
          id: book.id, name: book.name, publisher: book.publisher,
        })),
      },
    });
    return response;
  } else if (finished === undefined) {
    const finisheds = books.filter(
      (book) => book.finished == false,
    );
    const response = h
      .response({
        status: 'success',
        data: {
          books: finisheds.map((book) => ({
            id: book.id, name: book.name, publisher: book.publisher,
          })),
        },
      });
    return response;
  } else if (reading === '1') {
    const Readings = books.filter(
      (book) => book.reading === true,
    );

    const response = h
      .response({
        status: 'success',
        data: {
          books: Readings.map((book) => ({
            id: book.id, name: book.name, publisher: book.publisher,
          })),
        },
      });
    response.code(200);
    return response;
  } else if (reading == '0') {
    const Readings = books.filter((book) => book.reading === false);
    const response = h.response({
      status: 'success',
      data: {
        books: Readings.map((book) => ({
          id: book.id, name: book.name, publisher: book.publisher,
        })),
      },
    });
    return response;
  } else if (finished === '1') {
    const finisheds = books.filter((book) => book.finished === true);
    const response = h.response({
      status: 'succes',
      data: {
        books: finisheds.map((book) => ({
          id: book.id, name: book.name, publisher: book.publisher,
        })),
      },
    });
    return response;
  } else if (finished === '0') {
    const finisheds = books.filter((book) => book.finished === true);
    const response = h.response({
      status: 'succes',
      data: {
        books: finisheds.map((book) => ({
          id: book.id, name: book.name, publisher: book.publisher,
        })),
      },
    });
    return response;
  } else {
    const response = h
      .response({
        status: 'fail',
        message: 'Buku gagal didapatkan',
      });
    response.code(500);
    return response;
  }
};
// Kriteria ke 5 Menampilkan detail by Id

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
 
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Kriteria Ke 6

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading, 
  } = request.payload;

  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === id);

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } if (readPage >= pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
 
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
 
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Kriteria 7 : API dapat menghapus buku

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;
 
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler,
};
