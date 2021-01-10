export class SecurityHelper {
  static base64Encode(str: string): string {
    return btoa(str);
  }
}
