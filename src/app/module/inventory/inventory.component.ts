import {ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {InventoryService} from '../../api/inventory/inventory.service';
import {debounceTime, of, Subject, takeUntil} from 'rxjs';
import {SearchInventoryQueryInterface} from '../../api/inventory/search-inventory-query.interface';
import {PageEvent} from '@angular/material/paginator';
import {TableHeaderInterface} from '../../shared/table/table-header.interface';
import {TableHeaderTypeEnum} from '../../shared/table/table-header-type.enum';
import {FormControl, UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {DialogService} from '../../shared/dialog/dialog.service';
import {DialogInterface} from '../../shared/dialog/dialog.interface';
import {switchMap} from 'rxjs/operators';
import {InventoryInterface} from '../../api/inventory/inventory.interface';
import {SnackBarService} from '../../shared/snack-bar/snack-bar-service.service';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit, OnDestroy {
  @ViewChild('formInventoryContent', {static: true}) formInventoryContent: TemplateRef<DialogInterface> | undefined;
  inventoryForm: UntypedFormGroup;
  #searchFormControl: FormControl = new FormControl<string>('');
  #displayedColumns: TableHeaderInterface[] = [];
  #dataSource: MatTableDataSource<InventoryInterface> | undefined;
  #unsubscribeAll: Subject<void> = new Subject<void>();
  #pageSize: number = 50;
  #pageIndex: number = 0;
  #length: number = 0;
  #loading: boolean | undefined;

  constructor(private inventoryService: InventoryService,
              private dialogService: DialogService,
              private formBuilder: UntypedFormBuilder,
              private snackbarService: SnackBarService,
              private changeDetectorRefs: ChangeDetectorRef) {
    this.dataSource = new MatTableDataSource();
    this.displayedColumns.push({prop: 'name', name: 'Name', type: TableHeaderTypeEnum.link_action});
    this.displayedColumns.push({prop: 'quantity', name: 'Quantity', type: TableHeaderTypeEnum.plain});
    this.displayedColumns.push({prop: 'barCode', name: 'Bar Code', type: TableHeaderTypeEnum.plain});
    this.displayedColumns.push({prop: 'dateCreated', name: 'Date Created', type: TableHeaderTypeEnum.datetime});
    this.inventoryForm = this.formBuilder.group({
      id: null,
      name: null,
      quantity: null,
      barCode: null,
    });
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

  get dataSource(): MatTableDataSource<InventoryInterface> | undefined {
    return this.#dataSource;
  }

  set dataSource(value: MatTableDataSource<InventoryInterface> | undefined) {
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
    if (this.formInventoryContent) {
      const dialogConfig: DialogInterface = {
        title: 'Add new stocks',
        saveTitle: 'Save',
        content: this.formInventoryContent
      }
      this.handleDialog(dialogConfig);
    }
  }

  handleAction(inventory: InventoryInterface): void {
    if (this.formInventoryContent) {
      const dialogConfig: DialogInterface = {
        title: `Update ${inventory.name}`,
        saveTitle: 'Update',
        content: this.formInventoryContent
      }
      this.inventoryForm.patchValue(inventory);
      this.handleDialog(dialogConfig);
    }
  }

  private handleDialog(dialogConfig: DialogInterface): void {
    this.dialogService.openDialog(dialogConfig).pipe(takeUntil(this.unsubscribeAll), switchMap((dialog) => {
      if (dialog && dialog.submit) {
        return this.inventoryService.save(this.inventoryForm.value).pipe(switchMap((inventory) => {
          if (this.dataSource instanceof MatTableDataSource) {
            const index: number = this.dataSource.data.findIndex(obj => obj.id === inventory.id);
            if (index >= 0) {
              this.dataSource.data[index] = inventory;
              this.snackbarService.openSnackBar(`${inventory.name} successfully updated.`, '');
            } else {
              this.dataSource.data.push(inventory);
              this.snackbarService.openSnackBar(`${inventory.name} successfully added.`, '');
            }
            this.dataSource.data = this.dataSource.data;
          }
          this.inventoryForm.reset();
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
    const searchTranQuery: SearchInventoryQueryInterface = {
      name: searchByName,
      pageNo: this.pageIndex,
      pageSize: this.pageSize,
    };
    this.inventoryService.search(searchTranQuery).pipe(takeUntil(this.#unsubscribeAll)).subscribe(searchQueryResult => {
      if (this.dataSource instanceof MatTableDataSource) {
        this.dataSource.data = searchQueryResult.results;
        this.length = searchQueryResult.length;
        this.loading = false;
      }
    });
  }
}
