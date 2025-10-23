import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, Observable, tap} from 'rxjs';
import { IPaddress } from '../models/IPaddress.models';

@Injectable({
  providedIn: 'root'
})

export class IPaddressService {
  private apiUrl = 'http://localhost:3000/ipaddress';
  private ipaddresses$ = new BehaviorSubject<IPaddress[]>([]);  
  public ipList = this.ipaddresses$.asObservable()
  constructor(private http: HttpClient) {
    this.loadIPaddresses();
  }
  
   loadIPaddresses() {
    this.http.get<IPaddress[]>(this.apiUrl).subscribe(result =>{
      this.ipaddresses$.next(result)
    });
      
  }


  async createIPaddress(IPaddress: IPaddress): Promise<IPaddress>{
    const { id, ...nonIDdata } = IPaddress; // Exclude id from the data sent to the server
    const created = await firstValueFrom(this.http.post<IPaddress>(this.apiUrl, nonIDdata ));
    this.loadIPaddresses();
    return created;

  }

  async updateIPaddress(IPaddress: IPaddress): Promise<IPaddress> {

    const updated = await firstValueFrom(this.http.put<IPaddress>(`${this.apiUrl}/${IPaddress.id}`, IPaddress));
    this.loadIPaddresses();
    return updated;
  }

  async deleteIPaddress(id: number): Promise<void> {
    await firstValueFrom( this.http.delete<void>(`${this.apiUrl}/${id}`));
    this.loadIPaddresses();
  }
}