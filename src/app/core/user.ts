export interface Roles { 
    subscriber?: boolean;
    hr?: boolean;
    admin?: boolean;
 }
  
export interface User {
    uid: string;
    email?: string | null;
    photoURL?: string;
    displayName?: string;
    timerStatus?: boolean;
    roles: Roles;
}