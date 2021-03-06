import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class GridFilterService {
  filterValues = {};
  public data = new BehaviorSubject<any>([]);

  constructor(private dataSource: MatTableDataSource<any>) {
    dataSource.connect().subscribe((data) => {
      this.data.next(data);
    });
    dataSource.filterPredicate = this.createFilter();
  }

  private createFilter() {
    const filterFunction = function (data: any, filter: string): boolean {
      const searchTerms = JSON.parse(filter);

      const search = () => {
        const rowMatch = [];
        for (const col in searchTerms) {
          if (searchTerms.hasOwnProperty(col)) {
            const columnMatch = [];
            searchTerms[col].forEach((option) => {
              const val = GridFilterService.getProperty(data, col);
              let isMatch = val === option;
              if (val && val?.toString().includes(',')) {
                isMatch = val.includes(option);
              }
              columnMatch.push(isMatch);
            });
            rowMatch.push(columnMatch.some(Boolean));
          }
        }
        return rowMatch.every(Boolean);
        // use .some(Boolean) to use an OR filter
      };
      return search();
    };
    return filterFunction;
  }

  filterChange(fieldName: string, selected) {
    if (selected.length > 0) {
      this.filterValues[fieldName] = selected;
    } else {
      delete this.filterValues[fieldName];
    }
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  // Get unique values from columns to build filter
  private getUnique(fullObj, key: string) {
    const uniqChk = [];
    fullObj.filter((obj) => {
      const prop = GridFilterService.getProperty(obj, key);
      if (!uniqChk.includes(prop)) {
        uniqChk.push(prop);
      }
      return obj;
    });
    return uniqChk.sort();
  }

  getOptions(fieldName: string) {
    return this.getUnique(this.dataSource.data, fieldName);
  }

  static getProperty(obj, path: string): any[] {
    const separator = '.';
    const properties = Array.isArray(path) ? path : path.split(separator);
    return properties.reduce((prev, curr) => prev && prev[curr], obj);
  }
}
