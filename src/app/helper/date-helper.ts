export class DateHelper {
  static transformDate(date: unknown): string {
    return date.toString().substring(6, 8) + '/' + date.toString().substring(4, 6) + '/' + date.toString().substring(0, 4);
  }

  static getTodayDatePlusDays(numOfDays: number): string {
    const laterDate = new Date();
    laterDate.setDate(laterDate.getDate() + numOfDays);
    const dd = String(laterDate.getDate()).padStart(2, '0');
    const mm = String(laterDate.getMonth() + 1).padStart(2, '0'); // January starts from 0.
    const yyyy = laterDate.getFullYear();

    return yyyy + mm + dd;
  }
}
