export class UserNotFound extends Error {
  constructor(userId: number, location?: string) {
    super(`${location} User ID ${userId} not found!`.trim());
  }
}
