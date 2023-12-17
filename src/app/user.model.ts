import { Observable } from 'rxjs';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  profileImageUrl?: string; // Add this line
  profileImageUrl$?: Observable<string | undefined>; // Add this line
}