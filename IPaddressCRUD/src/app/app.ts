import { Component} from '@angular/core';
import { IPaddress } from './models/IPaddress.models';
import { CommonModule } from '@angular/common';
import { IPaddressForm } from './components/ipaddress-form/ipaddress-form';
import { IPaddressList } from './components/ipaddress-list/ipaddress-list';
import { APIResultInfo } from './models/APIResultInfo.models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, IPaddressForm, IPaddressList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
selectedIP?: IPaddress;
  message: string | null = null;
  messageType: 'success' | 'danger' | 'info' = 'success';

  editIP(ip: IPaddress) {
    this.selectedIP = ip;
  }


  announceResult(resultInfo: APIResultInfo) {
    if (resultInfo.success) {
      this.showMessage(`IP address ${resultInfo.action} successfully!`, 'success');
      this.selectedIP = undefined;
    } else {
      this.showMessage(`Error occurred while ${resultInfo.action} IP address. ${resultInfo.errormessage}`, 'danger');
    }
  }
  showMessage(msg: string, type: 'success' | 'danger' | 'info' = 'success') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => (this.message = null), 2500);
  }
}
