import { User } from '@service/domain/entities/user';

export interface UserRepository {
  create(user: User): Promise<User>
  findById(userId: string): Promise<User | null>
  findByPersonalEmail(personalEmail: string): Promise<User | null>
  findByLineLinkToken(token: string): Promise<User | null>
  findByLineUserId(lineUserId: string): Promise<User | null>
  findAll(): Promise<User[]>
  update(user: User): Promise<User>
  delete(userId: string): Promise<void>
}