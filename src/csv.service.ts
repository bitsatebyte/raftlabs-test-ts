import * as path from 'path';
import * as fs from 'fs';
import { FormatterOptionsArgs, Row, writeToStream } from '@fast-csv/format';
import * as csv from 'fast-csv';

type CsvFileOpts = {
    headers: string[];
    path: string;
};

export class CsvFile {
    static write(stream: NodeJS.WritableStream, rows: Row[], options: FormatterOptionsArgs<Row, Row>): Promise<void> {
        return new Promise((res, rej) => {
            writeToStream(stream, rows, options)
                .on('error', (err: Error) => rej(err))
                .on('finish', () => res());
        });
    }

    private readonly headers: string[];

    private readonly path: string;

    private readonly writeOpts: FormatterOptionsArgs<Row, Row>;

    constructor(opts: CsvFileOpts) {
        this.headers = opts.headers;
        this.path = opts.path;
        this.writeOpts = { headers: this.headers, includeEndRowDelimiter: true };
    }

    create(rows: Row[]): Promise<void> {
        return CsvFile.write(fs.createWriteStream(this.path), rows, { ...this.writeOpts });
    }

    append(rows: Row[]): Promise<void> {
        return CsvFile.write(fs.createWriteStream(this.path, { flags: 'a' }), rows, {
            ...this.writeOpts,
            // dont write the headers when appending
            writeHeaders: false,
        } as FormatterOptionsArgs<Row, Row>);
    }

    read(): Promise<Buffer> {
        return new Promise((res, rej) => {
            fs.readFile(this.path, (err, contents) => {
                if (err) {
                    return rej(err);
                }
                return res(contents);
            });
        });
    }
}


export function createCsvAndExport(headers: string[], fileName: string, ...rows: any[]) {
  const csvFile = new CsvFile({
      path: `${fileName}.csv`,
      // headers to write
      headers,
  });

  // 1. create the csv
  csvFile
      .create(rows[0])
      // 2. append new rows to file
      .then(() => csvFile.append(rows[1]))
      .then(() => csvFile.read())
      .catch(err => {
        console.error(err);
        process.exit(1);
      })
}

export const parseCsv = (fileName: string): Promise<any> => {
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