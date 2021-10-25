import * as csv from 'fast-csv';

const parseCsv = (fileName: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const data: any[] = [];
    csv
      .parseFile(`${fileName}.csv`, { headers: true })
      .on('error', (error) => { 
        console.error(error);
        reject(error);
      })
      .on('data', (row: any) => {
        data.push(row);
      })
      .on('end', () => {
        resolve(data);
      });
  });
}

// prints to the console using console table
// however, since books have a lot of data, the console output looks ugly
(async () => {
  let authors: any[], books: any[], magazines: any[];
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

  // print as tables
  console.table(books);
  console.table(authors);
  console.table(magazines);
})();