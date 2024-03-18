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
import {TruckService} from '../../api/truck/truck.service';
import {TruckInterface} from '../../api/truck/truck.interface';
import {TruckTypeService} from '../../api/truck-type/truck-type.service';
import {TruckTypeInterface} from '../../api/truck-type/truck-type.interface';

@Component({
  selector: 'app-truck-type',
  templateUrl: './truck.component.html',
  styleUrl: './truck.component.scss'
})
export class TruckComponent implements OnInit, OnDestroy {
  @ViewChild('content', {static: true}) formProductContent: TemplateRef<DialogInterface> | undefined;
  form: UntypedFormGroup;
  #searchFormControl: FormControl = new FormControl<string>('');
  #displayedColumns: TableHeaderInterface[] = [];
  #dataSource: MatTableDataSource<TruckInterface> | undefined;
  #unsubscribeAll: Subject<void> = new Subject<void>();
  #pageSize: number = 50;
  #pageIndex: number = 0;
  #length: number = 0;
  #loading: boolean | undefined;
  #truckTypes: TruckTypeInterface[] | undefined

  constructor(private truckService: TruckService,
              private truckTypeService: TruckTypeService,
              private dialogService: DialogService,
              private formBuilder: UntypedFormBuilder,
              private snackbarService: SnackBarService,) {
    this.dataSource = new MatTableDataSource();
    this.displayedColumns.push({prop: 'plateNumber', name: 'Plate Number', type: TableHeaderTypeEnum.link_action});
    this.displayedColumns.push({prop: 'truckType', name: 'Type', type: TableHeaderTypeEnum.plain});
    this.displayedColumns.push({prop: 'dateCreated', name: 'Date Created', type: TableHeaderTypeEnum.datetime});
    this.form = this.formBuilder.group({
      id: null,
      plateNumber: null,
      type: null,
      truckType: null,
    });
  }

  @HostBinding('class')
  get hostClasses(): string {
    return 'flex flex-col w-6/12';
  }

  get truckTypes(): TruckTypeInterface[] | undefined {
    return this.#truckTypes;
  }

  set truckTypes(value: TruckTypeInterface[] | undefined) {
    this.#truckTypes = value;
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

  get dataSource(): MatTableDataSource<TruckInterface> | undefined {
    return this.#dataSource;
  }

  set dataSource(value: MatTableDataSource<TruckInterface> | undefined) {
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
    this.getTruckTypes();
    this.buildSearchQuery('');
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  getTruckTypes(): void {
    this.truckTypeService.getAll().pipe(takeUntil(this.unsubscribeAll)).subscribe(truckTypes => this.truckTypes = truckTypes);
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

  handleAction(truckType: TruckInterface): void {
    if (this.formProductContent) {
      const dialogConfig: DialogInterface = {
        title: `Update ${truckType.type}`,
        saveTitle: 'Update',
        content: this.formProductContent
      }
      this.form.patchValue({
        ...truckType,
        type: truckType.type.id
      });
      this.handleDialog(dialogConfig);
    }
  }

  private handleDialog(dialogConfig: DialogInterface): void {
    this.dialogService.openDialog(dialogConfig).pipe(takeUntil(this.unsubscribeAll), switchMap((dialog) => {
      if (dialog && dialog.submit) {
        const findType = this.truckTypes?.find(type => type.id === this.form.value.type);
        const post = {
          ...this.form.value,
          type: findType
        };

        return this.truckService.save(post).pipe(switchMap((truck) => {
          if (this.dataSource instanceof MatTableDataSource) {
            const index: number = this.dataSource.data.findIndex(obj => obj.id === truck.id);
            const mapProduct = {
              ...truck,
              truckType: truck.type.type
            };
            if (index >= 0) {
              this.dataSource.data[index] = mapProduct;
              this.snackbarService.openSnackBar(`${truck.plateNumber} successfully updated.`, '');
            } else {
              this.dataSource.data.push(mapProduct);
              this.snackbarService.openSnackBar(`${truck.plateNumber} successfully added.`, '');
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
    this.truckService.getAll().pipe(takeUntil(this.#unsubscribeAll)).subscribe(trucks => {
      if (this.dataSource instanceof MatTableDataSource) {
        this.dataSource.data = trucks.map((truck) => {
          return {
            ...truck,
            truckType: truck.type.type,
          }
        });
        this.loading = false;
      }
    });
  }
}
