import {Component, HostBinding, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DialogInterface} from '../../shared/dialog/dialog.interface';
import {FormControl, UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {TableHeaderInterface} from '../../shared/table/table-header.interface';
import {MatTableDataSource} from '@angular/material/table';
import {debounceTime, of, Subject, takeUntil} from 'rxjs';
import {DialogService} from '../../shared/dialog/dialog.service';
import {SnackBarService} from '../../shared/snack-bar/snack-bar-service.service';
import {TableHeaderTypeEnum} from '../../shared/table/table-header-type.enum';
import {PageEvent} from '@angular/material/paginator';
import {switchMap} from 'rxjs/operators';
import {TruckTypeInterface} from '../../api/truck-type/truck-type.interface';
import {TruckTypeService} from '../../api/truck-type/truck-type.service';

@Component({
  selector: 'app-truck-type',
  templateUrl: './truck-type.component.html',
  styleUrl: './truck-type.component.scss'
})
export class TruckTypeComponent implements OnInit, OnDestroy {
  @ViewChild('content', {static: true}) formProductContent: TemplateRef<DialogInterface> | undefined;
  form: UntypedFormGroup;
  #searchFormControl: FormControl = new FormControl<string>('');
  #displayedColumns: TableHeaderInterface[] = [];
  #dataSource: MatTableDataSource<TruckTypeInterface> | undefined;
  #unsubscribeAll: Subject<void> = new Subject<void>();
  #pageSize: number = 50;
  #pageIndex: number = 0;
  #length: number = 0;
  #loading: boolean | undefined;

  constructor(private truckTypeService: TruckTypeService,
              private dialogService: DialogService,
              private formBuilder: UntypedFormBuilder,
              private snackbarService: SnackBarService,) {
    this.dataSource = new MatTableDataSource();
    this.displayedColumns.push({prop: 'type', name: 'Type', type: TableHeaderTypeEnum.link_action});
    this.displayedColumns.push({prop: 'dateCreated', name: 'Date Created', type: TableHeaderTypeEnum.datetime});
    this.form = this.formBuilder.group({
      id: null,
      type: null,
    });
  }

  @HostBinding('class')
  get hostClasses(): string {
    return 'flex flex-col w-6/12';
  }

  get unsubscribeAll(): Subject<void> {
    return this.#unsubscribeAll;
  }

  set unsubscribeAll(value: Subject<void>) {
    this.#unsubscribeAll = value;
  }

  get length(): number {
    return this.#length;
  }

  set length(value: number) {
    this.#length = value;
  }

  get searchFormControl(): FormControl {
    return this.#searchFormControl;
  }

  set searchFormControl(value: FormControl) {
    this.#searchFormControl = value;
  }

  get displayedColumns(): TableHeaderInterface[] {
    return this.#displayedColumns;
  }

  set displayedColumns(value: TableHeaderInterface[]) {
    this.#displayedColumns = value;
  }

  get dataSource(): MatTableDataSource<TruckTypeInterface> | undefined {
    return this.#dataSource;
  }

  set dataSource(value: MatTableDataSource<TruckTypeInterface> | undefined) {
    this.#dataSource = value;
  }

  get loading(): boolean | undefined {
    return this.#loading;
  }

  set loading(value: boolean | undefined) {
    this.#loading = value;
  }

  get pageSize(): number {
    return this.#pageSize;
  }

  set pageSize(value: number) {
    this.#pageSize = value;
  }

  get pageIndex(): number {
    return this.#pageIndex;
  }

  set pageIndex(value: number) {
    this.#pageIndex = value;
  }

  ngOnInit(): void {
    this.initFormGroup();
    this.buildSearchQuery('');
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  handlePageEvent(pageEvent: PageEvent) {
    this.pageSize = pageEvent.pageSize;
    this.pageIndex = pageEvent.pageIndex;
    this.buildSearchQuery(this.searchFormControl.value);
  }

  handleAddNew(): void {
    if (this.formProductContent) {
      const dialogConfig: DialogInterface = {
        title: 'Add new Truck Type',
        saveTitle: 'Save',
        content: this.formProductContent
      }
      this.handleDialog(dialogConfig);
    }
  }

  handleAction(truckType: TruckTypeInterface): void {
    if (this.formProductContent) {
      const dialogConfig: DialogInterface = {
        title: `Update ${truckType.type}`,
        saveTitle: 'Update',
        content: this.formProductContent
      }
      this.form.patchValue(truckType);
      this.handleDialog(dialogConfig);
    }
  }

  private handleDialog(dialogConfig: DialogInterface): void {
    this.dialogService.openDialog(dialogConfig).pipe(takeUntil(this.unsubscribeAll), switchMap((dialog) => {
      if (dialog && dialog.submit) {
        return this.truckTypeService.save(this.form.value).pipe(switchMap((truckType) => {
          if (this.dataSource instanceof MatTableDataSource) {
            const index: number = this.dataSource.data.findIndex(obj => obj.id === truckType.id);
            if (index >= 0) {
              this.dataSource.data[index] = truckType;
              this.snackbarService.openSnackBar(`${truckType.type} successfully updated.`, '');
            } else {
              this.dataSource.data.push(truckType);
              this.snackbarService.openSnackBar(`${truckType.type} successfully added.`, '');
            }
            this.dataSource.data = this.dataSource.data;
          }
          this.form.reset();
          return of(dialog);
        }))
      }
      return of(dialog);
    })).subscribe();
  }

  private initFormGroup(): void {
    if (this.searchFormControl) {
      this.searchFormControl.valueChanges
        .pipe(takeUntil(this.#unsubscribeAll), debounceTime(300))
        .subscribe(value => {
          this.buildSearchQuery(value);
        });
    }
  }

  private buildSearchQuery(searchByName: string | undefined): void {
    this.loading = true;
    this.truckTypeService.getAll().pipe(takeUntil(this.#unsubscribeAll)).subscribe(truckTypes => {
      if (this.dataSource instanceof MatTableDataSource) {
        this.dataSource.data = truckTypes;
        // this.length = searchQueryResult.length;
        this.loading = false;
      }
    });
  }
}
