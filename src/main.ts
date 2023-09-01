import 'zone.js/dist/zone';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { MultipleDatePickerComponent } from './components/multiple-date-picker/multiple-date-picker.component';
import moment from 'moment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, MultipleDatePickerComponent, FormsModule],
  template: `

  <div class="calendar-container">
    <div class="calendar-container-item">
      <ngx-multiple-date-picker [month]="months[0]" [sundayFirstDay]="true" [weekDaysOff]="weekDaysOff" [(ngModel)]="january"></ngx-multiple-date-picker>
    </div>
    <div class="calendar-container-item">
      <ngx-multiple-date-picker [month]="months[1]" [sundayFirstDay]="true" [weekDaysOff]="weekDaysOff" [(ngModel)]="february"></ngx-multiple-date-picker>
    </div>
    <div class="calendar-container-item">
      <ngx-multiple-date-picker [month]="months[2]" [sundayFirstDay]="true" [weekDaysOff]="weekDaysOff" [(ngModel)]="april"></ngx-multiple-date-picker>
    </div>
    <div class="calendar-container-item">
      <ngx-multiple-date-picker [month]="months[3]" [sundayFirstDay]="true" [weekDaysOff]="weekDaysOff" [(ngModel)]="march"></ngx-multiple-date-picker>
    </div>
    <div class="calendar-container-item">
      <ngx-multiple-date-picker [month]="months[4]" [sundayFirstDay]="true" [weekDaysOff]="weekDaysOff" [(ngModel)]="may"></ngx-multiple-date-picker>
    </div>
    <div class="calendar-container-item">
      <ngx-multiple-date-picker [month]="months[5]" [sundayFirstDay]="true" [weekDaysOff]="weekDaysOff" [(ngModel)]="june"></ngx-multiple-date-picker>
    </div>
    <div class="calendar-container-item">
      <ngx-multiple-date-picker [month]="months[6]" [sundayFirstDay]="true" [weekDaysOff]="weekDaysOff" [(ngModel)]="july"></ngx-multiple-date-picker>
    </div>
    <div class="calendar-container-item">
      <ngx-multiple-date-picker [month]="months[7]" [sundayFirstDay]="true" [weekDaysOff]="weekDaysOff" [(ngModel)]="august"></ngx-multiple-date-picker>
    </div>
    <div class="calendar-container-item">
      <ngx-multiple-date-picker [month]="months[8]" [sundayFirstDay]="true" [weekDaysOff]="weekDaysOff" [(ngModel)]="september"></ngx-multiple-date-picker>
    </div>
    <div class="calendar-container-item">
      <ngx-multiple-date-picker [month]="months[9]" [sundayFirstDay]="true" [weekDaysOff]="weekDaysOff" [(ngModel)]="october"></ngx-multiple-date-picker>
    </div>
    <div class="calendar-container-item">
      <ngx-multiple-date-picker [month]="months[10]" [sundayFirstDay]="true" [weekDaysOff]="weekDaysOff" [(ngModel)]="november"></ngx-multiple-date-picker>
    </div>
    <div class="calendar-container-item">
      <ngx-multiple-date-picker [month]="months[11]" [sundayFirstDay]="true" [weekDaysOff]="weekDaysOff" [(ngModel)]="december"></ngx-multiple-date-picker>
    </div>
  </div>
<br>
  <button class="button  large-button" (click)="onSend()">Send</button>

  `,
})
export class App {
  //calendar vars
  months: Array<moment.Moment>;
  weekDaysOff: Array<number>;

  name = 'Angular';

  january!: any;
  february!: any;
  march!: any;
  april!: any;
  may!: any;
  june!: any;
  july!: any;
  august!: any;
  september!: any;
  october!: any;
  november!: any;
  december!: any;

  constructor() {
    this.months = this.getMonthsCurrentYear();
    this.weekDaysOff = [];
  }

  private getMonthsCurrentYear() {
    let listMonths = [];

    for (let i = 0; i < 12; i++) {
      listMonths.push(moment().month(i));
    }

    return listMonths;
  }

  onSend = () => {
    console.log('onSend', this.january);
    console.log('onSend', this.february);
    console.log('onSend', this.march);
    console.log('onSend', this.april);
  };
}

bootstrapApplication(App);
