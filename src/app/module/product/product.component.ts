import {ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
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
import {SearchInventoryQueryInterface} from '../../api/inventory/search-inventory-query.interface';
import {ProductService} from '../../api/product/product.service';
import {ProductInterface} from '../../api/product/product.interface';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit, OnDestroy {
  @ViewChild('formProductContent', {static: true}) formProductContent: TemplateRef<DialogInterface> | undefined;
  productForm: UntypedFormGroup;
  #searchFormControl: FormControl = new FormControl<string>('');
  #displayedColumns: TableHeaderInterface[] = [];
  #dataSource: MatTableDataSource<ProductInterface> | undefined;
  #unsubscribeAll: Subject<void> = new Subject<void>();
  #pageSize: number = 10;
  #pageIndex: number = 0;
  #length: number = 0;
  #loading: boolean | undefined;

  constructor(private productService: ProductService,
              private dialogService: DialogService,
              private formBuilder: UntypedFormBuilder,
              private snackbarService: SnackBarService,
              private changeDetectorRefs: ChangeDetectorRef) {
    this.dataSource = new MatTableDataSource();
    this.displayedColumns.push({prop: 'name', name: 'Name', type: TableHeaderTypeEnum.link_action});
    this.displayedColumns.push({prop: 'price', name: 'Price', type: TableHeaderTypeEnum.plain});
    this.displayedColumns.push({prop: 'barCode', name: 'Bar Code', type: TableHeaderTypeEnum.plain});
    this.displayedColumns.push({prop: 'dateCreated', name: 'Date Created', type: TableHeaderTypeEnum.datetime});
    this.productForm = this.formBuilder.group({
      id: null,
      name: null,
      price: null,
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

  get dataSource(): MatTableDataSource<ProductInterface> | undefined {
    return this.#dataSource;
  }

  set dataSource(value: MatTableDataSource<ProductInterface> | undefined) {
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
        title: 'Add new stocks',
        saveTitle: 'Save',
        content: this.formProductContent
      }
      this.handleDialog(dialogConfig);
    }
  }

  handleAction(product: ProductInterface): void {
    if (this.formProductContent) {
      const dialogConfig: DialogInterface = {
        title: `Update ${product.name}`,
        saveTitle: 'Update',
        content: this.formProductContent
      }
      this.productForm.patchValue({title: product.inventoryId.name, ...product});
      this.handleDialog(dialogConfig);
    }
  }

  private handleDialog(dialogConfig: DialogInterface): void {
    this.dialogService.openDialog(dialogConfig).pipe(takeUntil(this.unsubscribeAll), switchMap((dialog) => {
      if (dialog && dialog.submit) {
        return this.productService.save(this.productForm.value).pipe(switchMap((product) => {
          if (this.dataSource instanceof MatTableDataSource) {
            const mapProduct = {
              ...product,
              name: product.inventoryId.name
            };
            const index: number = this.dataSource.data.findIndex(obj => obj.id === product.id);
            if (index >= 0) {
              this.dataSource.data[index] = mapProduct;
              this.snackbarService.openSnackBar(`${mapProduct.name} successfully updated.`, '');
            } else {
              this.dataSource.data.push(mapProduct);
              this.snackbarService.openSnackBar(`${mapProduct.name} successfully added.`, '');
            }
            this.dataSource.data = this.dataSource.data;
          }
          this.productForm.reset();
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
    this.productService.getAll().pipe(takeUntil(this.#unsubscribeAll)).subscribe(searchQueryResult => {
      if (this.dataSource instanceof MatTableDataSource) {
        this.dataSource.data = searchQueryResult.map((product) => {
          return {
            ...product,
            name: product.inventoryId.name,
          }
        });
        // this.length = searchQueryResult.length;
        this.loading = false;
      }
    });
  }
}
