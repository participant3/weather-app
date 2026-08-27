/*
  profile.ts

  Purpose:
  Defines the TypeScript structure used for user profile data
  throughout the application.
*/

// Defines the properties that every user profile can contain.
export interface UserProfile {
  // User's full name.
  fullName: string

  // User's email address.
  email: string

  // User's phone number.
  phone: string

  // Optional profile picture stored as an image data string.
  avatar?: string
}
