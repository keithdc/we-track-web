import {AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatInputModule} from '@angular/material/input';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';
import {Subject} from 'rxjs';
import {DatePipe, NgForOf, NgIf, NgSwitch, NgSwitchCase} from '@angular/common';
import {TableHeaderInterface} from './table-header.interface';
import {TableHeaderTypeEnum} from './table-header-type.enum';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatInputModule,
    MatSortModule,
    MatIconModule,
    ReactiveFormsModule,
    NgIf,
    DatePipe,
    MatSortModule,
    NgForOf,
    NgSwitch,
    NgSwitchCase,
    MatProgressSpinnerModule,
    NgIf,
  ]
})
export class TableComponent<T> implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort | undefined;
  @Output() pageEvent: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();
  @Output() action: EventEmitter<T> = new EventEmitter<T>();
  @Input() dataSource: MatTableDataSource<T> | undefined;
  @Input() loading: boolean | undefined;
  @Input() displayedColumns: TableHeaderInterface[] | undefined;
  @Input() length: number = 50;
  @Input() pageSize: number = 50;
  @Input() pageIndex: number = 0;
  #displayedColumnProps: string[] | undefined;
  #type: typeof TableHeaderTypeEnum = TableHeaderTypeEnum
  #unsubscribeAll: Subject<void> = new Subject<void>();

  constructor() {
  }

  get displayedColumnProps(): string[] | undefined {
    return this.#displayedColumnProps;
  }

  set displayedColumnProps(value: string[] | undefined) {
    this.#displayedColumnProps = value;
  }

  get type(): typeof TableHeaderTypeEnum {
    return this.#type;
  }

  set type(value: typeof TableHeaderTypeEnum) {
    this.#type = value;
  }

  ngOnInit(): void {
    this.buildDisplayedColumnProps();
  }

  ngAfterViewInit() {
    if (this.dataSource && this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  ngOnDestroy(): void {
    this.#unsubscribeAll.next();
    this.#unsubscribeAll.complete();
  }

  handlePageEvent(pageEvent: PageEvent) {
    this.pageEvent.emit(pageEvent);
  }

  identifyColumn(index: number, column: TableHeaderInterface): string {
    return column.prop;
  }

  handleAction(obj: T) {
    this.action.emit(obj);
  }

  private buildDisplayedColumnProps(): void {
    if (this.displayedColumns) {
      this.displayedColumnProps = this.displayedColumns.map(columnProp => columnProp.prop);
    }
  }
}
