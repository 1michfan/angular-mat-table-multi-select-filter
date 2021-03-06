import { Component, Input, OnChanges } from '@angular/core';
import { GridFilterService } from '../grid-filter.service';

@Component({
  selector: 'app-grid-filter',
  templateUrl: './grid-filter.component.html',
  styleUrls: ['./grid-filter.component.css'],
})
export class GridFilterComponent implements OnChanges {
  selected: any[] = [];
  options: any[] = [];
  @Input() fieldName: string;
  @Input() filterService: GridFilterService;

  constructor() {}

  ngOnChanges() {
    if (this.filterService) {
      this.filterService.data.subscribe(() => {
        this.options = this.filterService.getOptions(this.fieldName);
      });
    }
  }

  filterChanged() {
    this.filterService.filterChange(this.fieldName, this.selected);
  }
}
