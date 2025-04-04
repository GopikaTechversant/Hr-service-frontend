import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTreeModule } from '@angular/material/tree';
import { MatListModule } from '@angular/material/list';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MAT_DATE_LOCALE } from '@angular/material/core';
@NgModule({
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    MatCardModule,
    MatButtonModule,
    MatDatepickerModule,
    MatRippleModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatTableModule,
    MatTreeModule,
    MatListModule,
    DragDropModule,
    MatPaginatorModule
  ],
  exports: [
    MatTabsModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    MatCardModule,
    MatButtonModule,
    MatDatepickerModule,
    MatRippleModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatTableModule,
    MatTreeModule,
    MatListModule,
    DragDropModule,
    MatPaginatorModule
  ]
})
export class MaterialModule { }
