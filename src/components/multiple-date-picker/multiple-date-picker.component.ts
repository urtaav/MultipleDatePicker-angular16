import { CommonModule } from '@angular/common';
import {
  Component,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Provider,
  SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import moment from 'moment';

moment.locale('es-ES');

const NGX_MULTIPLE_DATE_PICKER_CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MultipleDatePickerComponent),
  multi: true,
};
@Component({
  selector: 'ngx-multiple-date-picker',
  templateUrl: './multiple-date-picker.component.html',
  styleUrls: ['./multiple-date-picker.component.scss'],
  standalone: true,
  imports: [CommonModule],
  providers: [NGX_MULTIPLE_DATE_PICKER_CONTROL_VALUE_ACCESSOR],
})
export class MultipleDatePickerComponent
  implements OnInit, ControlValueAccessor, OnChanges
{
  private onTouched = () => {};
  private onChanged = (_: any) => {};
  /*
   * Type : Array of moment dates
   * Array will mutate when user select/unselect a date
   */
  @Input()
  daysNgModel: any;
  /*
   * Type : function
   * Will be called to manage (un)selection of a date
   */
  dayClick: any;
  /*
   * Type : function
   * Will be called to manage hover of a date
   */
  dayHover: any;
  /*
   * Type: moment date
   * Month to be displayed
   * Default is current month
   */
  @Input()
  month: any = moment().startOf('day');
  /*
   * Type: array of integers
   * Recurrent week days not selectables
   * /!\ Sunday = 0, Monday = 1 ... Saturday = 6
   * */
  @Input()
  weekDaysOff: any;
  /*
   * Type: boolean
   * Sunday be the first day of week, default will be Monday
   * */
  @Input()
  sundayFirstDay: boolean;
  /*
   * Type: boolean
   * if true can't navigate
   * */
  disableNavigation: boolean = true;
  /*
   * Type: boolean
   * Set all days off
   * */
  @Input()
  allDaysOff: any = false;
  /*
   * Type: array of moment dates
   * Set days allowed (only thos dates will be selectable)
   * */
  @Input()
  daysAllowed: Array<any>;
  /*
   * Type: any type moment can parse
   * If filled will disable all days before this one (not included)
   * */
  @Input()
  disableDaysBefore!: any;
  /*
   * Type: any type moment can parse
   * If filled will disable all days after this one (not included)
   * */
  @Input()
  disableDaysAfter!: any;
  /*
   * Type: boolean
   * if true empty boxes will be filled with days of previous/next month
   * */
  @Input()
  showDaysOfSurroundingMonths!: boolean;
  /*
   * Type: boolean
   * if true events on empty boxes (or next/previous month) will be fired
   * */
  @Input()
  fireEventsForDaysOfSurroundingMonths!: boolean;
  /*
   * Type: string
   * CSS classes to apply to days of next/previous months
   * */
  @Input()
  cssDaysOfSurroundingMonths: string;

  monthToDisplay: string = 'monthToDisplay';
  yearToDisplay: any = 'yearToDisplay';
  daysOfWeek: any;
  days!: Array<any>;
  daysOff!: Array<any>;

  constructor() {
    //default values
    this.daysNgModel = [];
    this.days = [];
    this.daysOff = [];
    this.daysAllowed = [];
    this.sundayFirstDay = true;
    this.cssDaysOfSurroundingMonths = '';
  }
  ngOnInit(): void {
    this.daysOfWeek = this.getDaysOfWeek();
    this.cssDaysOfSurroundingMonths = this.cssDaysOfSurroundingMonths
      ? this.cssDaysOfSurroundingMonths
      : 'picker-empty';
    // this.generate();
  }

  writeValue(value: any): void {
    console.log('value', value);
    if (value) {
      this.daysNgModel = value;
      this.generate();
    }
  }
  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.allDaysOff = isDisabled;
  }

  /*Generate the calendar*/
  generate() {
    this.monthToDisplay = this.getMonthYearToDisplay();
    this.yearToDisplay = this.month.format('YYYY');

    let previousDay = moment(this.month)
      .date(0)
      .day(this.sundayFirstDay ? 0 : 1)
      .subtract(1, 'day');

    if (moment(this.month).date(0).diff(previousDay, 'day') > 6) {
      previousDay = previousDay.add(1, 'week');
    }

    let firstDayOfMonth = moment(this.month).date(1),
      days = [],
      now = moment(),
      lastDay = moment(firstDayOfMonth).endOf('month');

    let maxDays = lastDay.diff(previousDay, 'days');
    let lastDayOfWeek = this.sundayFirstDay ? 6 : 0;

    if (lastDay.day() !== lastDayOfWeek) {
      maxDays += (this.sundayFirstDay ? 6 : 7) - lastDay.day();
    }

    for (var j = 0; j < maxDays; j++) {
      days.push(this.createDate(previousDay, now));
    }

    this.days = days;
  }

  createDate(previousDay: any, now: any) {
    let day: any = {
      date: moment(previousDay.add(1, 'day')),
      mdp: {
        selected: false,
      },
    };

    day.selectable = !this.isDayOff(day);
    day.mdp.selected = this.isSelected(day);
    day.mdp.today = day.date.isSame(now, 'day');
    day.mdp.past = day.date.isBefore(now, 'day');
    day.mdp.future = day.date.isAfter(now, 'day');
    if (!day.date.isSame(this.month, 'month')) {
      day.mdp.otherMonth = true;
    }
    return day;
  }

  /*Check if the date is off : unselectable*/
  private isDayOff(day: any) {
    // console.log("isDayOff")
    return (
      this.allDaysOff ||
      (!!this.disableDaysBefore &&
        moment(day.date).isBefore(this.disableDaysBefore, 'day')) ||
      (!!this.disableDaysAfter &&
        moment(day.date).isAfter(this.disableDaysAfter, 'day')) ||
      (Array.isArray(this.weekDaysOff) &&
        this.weekDaysOff.some(function (dayOff) {
          return day.date.day() === dayOff;
        })) ||
      (Array.isArray(this.daysOff) &&
        this.daysOff.some(function (dayOff) {
          return day.date.isSame(dayOff, 'day');
        }))
    );

    // ||
    // (Array.isArray(this.daysAllowed) && !this.daysAllowed.some(function (dayAllowed) {
    //   return day.date.isSame(dayAllowed, 'day');
    // }))
  }

  /*Check if the date is selected*/
  private isSelected(day: any) {
    return this.daysNgModel.some(function (d: any) {
      return day.date.isSame(d, 'day');
    });
  }

  getMonthYearToDisplay() {
    let month: any = this.month.format('MMMM');
    return month.charAt(0).toUpperCase() + month.slice(1);
  }

  getDaysOfWeek() {
    /*To display days of week names in moment.lang*/
    let momentDaysOfWeek: any = moment().localeData().weekdaysMin();
    let days = [];
    // console.log("momentDaysOfWeek",momentDaysOfWeek);
    for (var i = 1; i < 7; i++) {
      days.push(momentDaysOfWeek[i]);
    }

    if (this.sundayFirstDay) {
      days.splice(0, 0, momentDaysOfWeek[0]);
    } else {
      days.push(momentDaysOfWeek[0]);
    }

    // console.log("days",days)
    return days;
  }

  getDayClasses(day: any) {
    let css = '';
    if (day.css && (!day.mdp.otherMonth || this.showDaysOfSurroundingMonths)) {
      css += ' ' + day.css;
    }
    if (this.cssDaysOfSurroundingMonths && day.mdp.otherMonth) {
      css += ' ' + this.cssDaysOfSurroundingMonths;
    }
    if (day.mdp.selected) {
      css += ' picker-selected';
    }
    if (!day.selectable) {
      css += ' picker-off';
    }
    if (day.mdp.today) {
      css += ' today';
    }
    if (day.mdp.past) {
      css += ' past';
    }
    if (day.mdp.future) {
      css += ' future';
    }
    if (day.mdp.otherMonth) {
      css += ' picker-other-month';
    }
    return css;
  }

  /**
   * Called when user clicks a date
   * @param event event the click event
   * @param day "complex" mdp object with all properties
   */
  toggleDay(event: any, day: any) {
    event.preventDefault();
    this.onTouched();

    if (day.mdp.otherMonth && !this.fireEventsForDaysOfSurroundingMonths) {
      return;
    }

    let prevented = false;

    event.preventDefault = function () {
      prevented = true;
    };

    if (day.selectable && !prevented) {
      day.mdp.selected = !day.mdp.selected;

      if (day.mdp.selected) {
        this.daysNgModel.push(day.date);
      } else {
        let idx = -1;
        for (var i = 0; i < this.daysNgModel.length; ++i) {
          if (moment.isMoment(this.daysNgModel[i])) {
            if (this.daysNgModel[i].isSame(day.date, 'day')) {
              idx = i;
              break;
            }
          } else {
            if (this.daysNgModel[i].date.isSame(day.date, 'day')) {
              idx = i;
              break;
            }
          }
        }
        if (idx !== -1) this.daysNgModel.splice(idx, 1);
      }

      this.onChanged(this.daysNgModel);
    }
  }

  /**
   * Hover day
   * @param event hover event
   * @param day "complex" mdp object with all properties
   */
  hoverDay(event: any, day: any) {
    event.preventDefault();
    var prevented = false;

    event.preventDefault = function () {
      prevented = true;
    };

    if (typeof this.dayHover == 'function') {
      this.dayHover(event, day);
    }

    if (!prevented) {
      day.mdp.hover = event.type === 'mouseover';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log("ngOnChanges",changes)
    if (changes['month']) {
      this.generate();
    }
    if (changes['sundayFirstDay']) {
      this.generate();
    }
    if (changes['weekDaysOff']) {
      this.generate();
    }
  }
}
