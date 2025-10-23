import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IPaddressService } from '../../services/IPaddress.service';
import { IPaddress } from '../../models/IPaddress.models';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { APIResultInfo } from '../../models/APIResultInfo.models';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'ipaddress-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ipaddress-list.html',
  styleUrl: './ipaddress-list.css'
})
export class IPaddressList implements OnInit {
  IPaddresses$!: Observable<IPaddress[]>;
  filteredIPList$!: Observable<IPaddress[]>;
  @Output() 
  editRequested = new EventEmitter<IPaddress>();

  @Output() 
  deleteResultInfo = new EventEmitter<APIResultInfo>();


  private searchTerm$ = new BehaviorSubject<string>('');
  private sortColumn$ = new BehaviorSubject<keyof IPaddress>('id');
  private sortDirection$ = new BehaviorSubject<'asc' | 'desc'>('asc');

  constructor(private IPaddressService: IPaddressService, private router: Router) {
  this.IPaddresses$ = this.IPaddressService.ipList;

  }

  ngOnInit(): void {
    //this.IPaddresses$ = this.IPaddressService.ipList;
     this.filteredIPList$ = combineLatest([
      this.IPaddresses$,
      this.searchTerm$,
      this.sortColumn$,
      this.sortDirection$
    ]).pipe(
      map(([ipList, searchTerm, sortColumn, sortDirection]) => {
        let filtered = ipList;
        // Search (case-insensitive)
        if (searchTerm.trim()) {
          const lower = searchTerm.toLowerCase();
          filtered = filtered.filter(ip =>
            ip.IP.toLowerCase().includes(lower) ||
            ip.Description?.toLowerCase().includes(lower) ||
            ip.VLAN?.toLowerCase().includes(lower)
          );
        }

        // Sort
        return [...filtered].sort((a, b) => {
          const aVal = (a[sortColumn] ?? '').toString().toLowerCase();
          const bVal = (b[sortColumn] ?? '').toString().toLowerCase();
          if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
          if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
          return 0;
        });
      })
    );
  }

  setSearch(term: string) {
    this.searchTerm$.next(term);
    console.log('Search term set to:', this.searchTerm$);
  }

  setSort(column: keyof IPaddress) {
    if (this.sortColumn$.value === column) {
      this.sortDirection$.next(this.sortDirection$.value === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn$.next(column);
      this.sortDirection$.next('asc');
    }
  }

  async deleteIPaddress(ip: IPaddress) {
    if (confirm('Are you sure you want to delete this IPaddress?')) {
      if(ip.id === undefined){ 
        Error('IPaddress id is undefined'); 
        return; 
      }
      try {
        await this.IPaddressService.deleteIPaddress(ip.id);
        this.deleteResultInfo.emit({success: true, action: 'deleted', errormessage: undefined});
      } catch (error) {
        this.deleteResultInfo.emit({success: false, action: 'deleted', errormessage: error instanceof HttpErrorResponse ? '\n'+error.message : '\nUnknown error'});
      
      }
    }
  }

  onEditIPaddress(ip: IPaddress) {
    this.editRequested.emit(ip);
  }
}