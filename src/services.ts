import * as csv from 'fast-csv';
import { cloneDeep, orderBy, partition } from 'lodash';
import { createCsvAndExport, parseCsv } from './csv.service';

export let authors: any[], books: any[], magazines: any[];

// dummy rows to create and append to a new csv file
const dummyBookRows: any[] = [
  { title: 'Test Title', isbn: '1234-5678-9012-3456', authors: 'hariveturi@testdomain.org', description: 'Test description' },
  { title: 'Test Title 2', isbn: '2222-9999-1111-0000', authors: 'test@somedom.org', description: 'Test description 2' },
];

const dummyMagazineRows: any[] = [
  { title: 'New Magazine 1', isbn: '7410-8520-9630-7452', authors: 'hariveturi@testdomain.org', publishedAt: '26.10.2021' },
  { title: 'New Magazine 2', isbn: '8541-2541-0125-8512', authors: 'foo@bar.org', publishedAt: '16.04.2021' },
];

(async () => {
  // Task #1
  try {
    authors = await parseCsv('authors');
  } catch (e) {
    console.error(e);
  }
  try {
    books = await parseCsv('books');
  } catch (e) {
    console.error(e);
  }
  try {
    magazines = await parseCsv('magazines');
  } catch (e) {
    console.error(e);
  }

  // books headers
  const booksHeaders: string[] = Object.keys(books[0]);
  // magazines headers
  const magazinesHeaders: string[] = Object.keys(magazines[0]);

  // truncate description longer than 30 chars and title longer than 10 chars
  // for pretty output
  const truncatedBooks = truncateText(books);
  // print as tables
  // Task #2
  console.table(truncatedBooks);
  console.table(authors);
  console.table(magazines);
  const sortedItems = sortByTitle(books, magazines);

  // Task #5
  // print sorted magazines
  console.table(sortedItems[0]);
  // print sorted books
  console.table(truncateText(sortedItems[1]));

  // Task #6
  // create new books csv file
  createCsvAndExport(booksHeaders, 'new_books', books, dummyBookRows);
  // create new magazines csv file
  createCsvAndExport(magazinesHeaders, 'new_magazines', magazines, dummyMagazineRows);
})();

function truncateText(items: any[]): any[] {
  // deepclone the array
  const copiedArray = cloneDeep(items);
  const truncatedArray: any[] = copiedArray.map(item => {
    if(item?.description) {
      item.description = item?.description.substring(0, 20) + '...';
    }
    item.title = item.title.substring(0, 10) + '...';
    return item;
  });
  return truncatedArray;
}

// Task #3
export function findItemByIsbn(isbn: string, items: any[]): any[] {
  const data: any[] = items.filter(element => element.isbn === isbn);
  return data;
}

// Task #4
export function findByAuthorEmail(authorEmail: string, items: any[]): any[] {
  const data: any[] = items.filter(element => element.authors === authorEmail);
  return data;
}

export function sortByTitle(booksArray: any[], magazinesArray: any[]) {
  const booksArrayClone = cloneDeep(booksArray);
  const magazinesArrayClone = cloneDeep(magazinesArray);
  // merge both books and magazines to sort together
  const mergedArray = [...booksArrayClone, ...magazinesArrayClone];
  const sorted = orderBy(mergedArray, [item => item.title.toLowerCase()]);
  // partition books and magazines using publishedAt property
  // index[0] -> magazines, index[1] -> books
  const parted = partition(sorted, function(o) { return o.publishedAt });
  return parted;
}
