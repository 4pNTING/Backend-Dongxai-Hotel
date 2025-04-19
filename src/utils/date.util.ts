export class DateUtils {
    static formatDate(date: Date): string {
      return date.toISOString().split('T')[0];
    }
  
    static addDays(date: Date, days: number): Date {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    }
    
    static calculateNights(checkIn: Date, checkOut: Date): number {
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  }