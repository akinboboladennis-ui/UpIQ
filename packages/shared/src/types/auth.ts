export interface UserProfile {
  id: string
  userId: string
  displayName: string | null
  firstName: string | null
  lastName: string | null
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface AuthUser {
  id: string
  email: string
  profile: UserProfile | null
}
