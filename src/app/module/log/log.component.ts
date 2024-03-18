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
import {RateService} from '../../api/rate/rate.service';
import {LogService} from '../../api/log/log.service';
import {LogInterface} from '../../api/log/log.interface';
import {RateInterface} from '../../api/rate/rate.interface';
import {EnumNameDescription} from '../../shared/enum/enum';
import {StatusLogEnum, StatusLogEnumUtil} from '../../api/log/status-log.enum';

@Component({
  selector: 'app-truck-type',
  templateUrl: './log.component.html',
  styleUrl: './log.component.scss'
})
export class LogComponent implements OnInit, OnDestroy {
  @ViewChild('content', {static: true}) formProductContent: TemplateRef<DialogInterface> | undefined;
  form: UntypedFormGroup;
  #searchFormControl: FormControl = new FormControl<string>('');
  #displayedColumns: TableHeaderInterface[] = [];
  #dataSource: MatTableDataSource<LogInterface> | undefined;
  #unsubscribeAll: Subject<void> = new Subject<void>();
  #pageSize: number = 50;
  #pageIndex: number = 0;
  #length: number = 0;
  #loading: boolean | undefined;
  #trucks: TruckInterface[] | undefined
  #rates: RateInterface[] | undefined
  #statusEnum: EnumNameDescription[] = StatusLogEnumUtil.list();

  constructor(private logService: LogService,
              private truckService: TruckService,
              private rateService: RateService,
              private dialogService: DialogService,
              private formBuilder: UntypedFormBuilder,
              private snackbarService: SnackBarService,) {
    this.dataSource = new MatTableDataSource();
    this.displayedColumns.push({prop: 'dateCreated', name: 'Dispatch Date', type: TableHeaderTypeEnum.datetime});
    this.displayedColumns.push({prop: 'voucherCode', name: 'Voucher Code', type: TableHeaderTypeEnum.link_action});
    this.displayedColumns.push({prop: 'plateNumber', name: 'Plate Number', type: TableHeaderTypeEnum.plain});
    this.displayedColumns.push({prop: 'truckType', name: 'Trip Type', type: TableHeaderTypeEnum.plain});
    this.displayedColumns.push({prop: 'rateCode', name: 'Rate Code', type: TableHeaderTypeEnum.plain});
    this.displayedColumns.push({prop: 'amount', name: 'Amount', type: TableHeaderTypeEnum.plain});
    this.displayedColumns.push({prop: 'status', name: 'Status', type: TableHeaderTypeEnum.statusLog});
    this.form = this.formBuilder.group({
      id: null,
      voucherCode: null,
      truck: this.formBuilder.group({
        id: null,
        plateNumber: null,
      }),
      rate: this.formBuilder.group({
        id: null,
        voucherCode: null,
      }),
      status: null,
    });
  }

  @HostBinding('class')
  get hostClasses(): string {
    return 'flex flex-col w-11/12';
  }

  get statusEnum(): EnumNameDescription[] {
    return this.#statusEnum;
  }

  set statusEnum(value: EnumNameDescription[]) {
    this.#statusEnum = value;
  }

  get rates(): RateInterface[] | undefined {
    return this.#rates;
  }

  set rates(value: RateInterface[] | undefined) {
    this.#rates = value;
  }

  get trucks(): TruckInterface[] | undefined {
    return this.#trucks;
  }

  set trucks(value: TruckInterface[] | undefined) {
    this.#trucks = value;
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

  get dataSource(): MatTableDataSource<LogInterface> | undefined {
    return this.#dataSource;
  }

  set dataSource(value: MatTableDataSource<LogInterface> | undefined) {
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
    this.getTruck();
    this.getRates();
    this.buildSearchQuery('');
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  getTruck(): void {
    this.truckService.getAll().pipe(takeUntil(this.unsubscribeAll)).subscribe(trucks => this.trucks = trucks);
  }

  getRates(): void {
    this.rateService.getAll().pipe(takeUntil(this.unsubscribeAll)).subscribe(rates => this.rates = rates);
  }

  handlePageEvent(pageEvent: PageEvent) {
    this.pageSize = pageEvent.pageSize;
    this.pageIndex = pageEvent.pageIndex;
    this.buildSearchQuery(this.searchFormControl.value);
  }

  handleAddNew(): void {
    if (this.formProductContent) {
      this.form.reset();
      const dialogConfig: DialogInterface = {
        title: 'Add new Truck Type',
        saveTitle: 'Save',
        content: this.formProductContent
      }
      this.handleDialog(dialogConfig);
    }
  }

  handleAction(log: LogInterface): void {
    if (this.formProductContent) {
      const dialogConfig: DialogInterface = {
        title: `Update ${log.voucherCode}`,
        saveTitle: 'Update',
        content: this.formProductContent
      }
      this.form.patchValue({
        ...log,
        plateNumber: log.truck.id,
        truckType: log.truck.type.type,
        rateCode: log.rate.rateCode,
        amount: log.rate.amount,
      });
      this.handleDialog(dialogConfig);
    }
  }

  private handleDialog(dialogConfig: DialogInterface): void {
    this.dialogService.openDialog(dialogConfig).pipe(takeUntil(this.unsubscribeAll), switchMap((dialog) => {
      if (dialog && dialog.submit) {
        const findTruck = this.trucks?.find(truck => truck.id === this.form.value.truck.id);
        const findRate = this.rates?.find(rate => rate.id === this.form.value.rate.id);
        const post = {
          ...this.form.value,
          truck: findTruck,
          rate: findRate
        };

        return this.logService.save(post).pipe(switchMap((log) => {
          if (this.dataSource instanceof MatTableDataSource) {
            const index: number = this.dataSource.data.findIndex(obj => obj.id === log.id);
            const mapLog = {
              ...log,
              plateNumber: log.truck.plateNumber,
              truckType: log.truck.type.type,
              rateCode: log.rate.rateCode,
              amount: log.rate.amount,
            };
            if (index >= 0) {
              this.dataSource.data[index] = mapLog;
              this.snackbarService.openSnackBar(`${mapLog.voucherCode} successfully updated.`, '');
            } else {
              this.dataSource.data.push(mapLog);
              this.snackbarService.openSnackBar(`${mapLog.voucherCode} successfully added.`, '');
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
    this.logService.getAll().pipe(takeUntil(this.#unsubscribeAll)).subscribe(logs => {
      if (this.dataSource instanceof MatTableDataSource) {
        this.dataSource.data = logs.map(log => {
          return {
            ...log,
            plateNumber: log.truck.plateNumber,
            truckType: log.truck.type.type,
            rateCode: log.rate.rateCode,
            amount: log.rate.amount,
          };
        });
        this.loading = false;
      }
    });
  }
}
