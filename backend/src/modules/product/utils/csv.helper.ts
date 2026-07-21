import fs from 'fs';
import csv from 'csv-parser';

export const parseCSV = (filePath: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const products: any[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data: any) => products.push(data))
      .on('end', () => resolve(products))
      .on('error', (error) => reject(error));
  });
};

