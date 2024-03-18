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
import {RateService} from '../../api/rate/rate.service';
import {RateInterface} from '../../api/rate/rate.interface';
import {CompanyInterface} from '../../api/company/company.interface';
import {CompanyService} from '../../api/company/company.service';

@Component({
  selector: 'app-rate-type',
  templateUrl: './rate.component.html',
  styleUrl: './rate.component.scss'
})
export class RateComponent implements OnInit, OnDestroy {
  @ViewChild('content', {static: true}) formProductContent: TemplateRef<DialogInterface> | undefined;
  form: UntypedFormGroup;
  #searchFormControl: FormControl = new FormControl<string>('');
  #companyFormControl: FormControl = new FormControl<string>('');
  #displayedColumns: TableHeaderInterface[] = [];
  #dataSource: MatTableDataSource<RateInterface> | undefined;
  #unsubscribeAll: Subject<void> = new Subject<void>();
  #pageSize: number = 50;
  #pageIndex: number = 0;
  #length: number = 0;
  #loading: boolean | undefined;
  #companies: CompanyInterface[] | undefined

  constructor(private rateService: RateService,
              private companyService: CompanyService,
              private dialogService: DialogService,
              private formBuilder: UntypedFormBuilder,
              private snackbarService: SnackBarService,) {
    this.dataSource = new MatTableDataSource();
    this.displayedColumns.push({prop: 'name', name: 'Company Name', type: TableHeaderTypeEnum.link_action});
    this.displayedColumns.push({prop: 'fromDestination', name: 'From', type: TableHeaderTypeEnum.plain});
    this.displayedColumns.push({prop: 'toDestination', name: 'To', type: TableHeaderTypeEnum.plain});
    this.displayedColumns.push({prop: 'rateCode', name: 'Trip Code', type: TableHeaderTypeEnum.plain});
    this.displayedColumns.push({prop: 'amount', name: 'Amount', type: TableHeaderTypeEnum.plain});
    this.displayedColumns.push({prop: 'dateCreated', name: 'Date Created', type: TableHeaderTypeEnum.plain});
    this.form = this.formBuilder.group({
      id: null,
      fromDestination: null,
      toDestination: null,
      rateCode: null,
      amount: null,
      company: this.formBuilder.group({
        id: null,
        name: null,
      })
    });
  }

  @HostBinding('class')
  get hostClasses(): string {
    return 'flex flex-col w-11/12';
  }

  get companyFormControl(): FormControl {
    return this.#companyFormControl;
  }

  set companyFormControl(value: FormControl) {
    this.#companyFormControl = value;
  }

  get companies(): CompanyInterface[] | undefined {
    return this.#companies;
  }

  set companies(value: CompanyInterface[] | undefined) {
    this.#companies = value;
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

  get dataSource(): MatTableDataSource<RateInterface> | undefined {
    return this.#dataSource;
  }

  set dataSource(value: MatTableDataSource<RateInterface> | undefined) {
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
    this.companyService.getAll().pipe(takeUntil(this.unsubscribeAll)).subscribe(companies => {
      this.companies = companies
      if (companies.length > 0) {
        this.companyFormControl.setValue(companies[0].id);
      }
    });
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
        title: 'Add new Rate',
        saveTitle: 'Save',
        content: this.formProductContent
      }
      this.handleDialog(dialogConfig);
    }
  }

  handleAction(rate: RateInterface): void {
    if (this.formProductContent) {
      const dialogConfig: DialogInterface = {
        title: `Update ${rate.rateCode}`,
        saveTitle: 'Update',
        content: this.formProductContent
      }
      this.form.patchValue(rate);
      this.handleDialog(dialogConfig);
    }
  }

  private handleDialog(dialogConfig: DialogInterface): void {
    this.dialogService.openDialog(dialogConfig).pipe(takeUntil(this.unsubscribeAll), switchMap((dialog) => {
      if (dialog && dialog.submit) {
        const result = this.companies?.find(company => company.id === this.companyFormControl.value);
        const post = {
          ...this.form.value,
          company: this.form.value.id ? this.form.value.company : result,
        };

        return this.rateService.save(post).pipe(switchMap((rate) => {
          if (this.dataSource instanceof MatTableDataSource) {
            const index: number = this.dataSource.data.findIndex(obj => obj.id === rate.id);
            const mapRate = {
              ...rate,
              name: rate.company.name
            };
            if (index >= 0) {
              this.dataSource.data[index] = mapRate;
              this.snackbarService.openSnackBar(`${rate.rateCode} successfully updated.`, '');
            } else {
              this.dataSource.data.push(mapRate);
              this.snackbarService.openSnackBar(`${rate.rateCode} successfully added.`, '');
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
    this.rateService.getAll().pipe(takeUntil(this.#unsubscribeAll)).subscribe(rates => {
      if (this.dataSource instanceof MatTableDataSource) {
        this.dataSource.data = rates.map((rate) => {
          return {
            ...rate,
            name: rate.company.name,
          }
        });
        this.loading = false;
      }
    });
  }
}
