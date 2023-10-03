import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository';
import { describe, it, expect, beforeEach } from 'vitest';
import { hash } from 'bcryptjs';
import { GetUserProfileUseCase } from './get-user-profile';
import { ResourceNotFoundError } from './errors/resource-not-found-error';

let usersRepository: InMemoryUserRepository;
let sut: GetUserProfileUseCase;
let userId: string;

describe('Get user profile use case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUserRepository();
    sut = new GetUserProfileUseCase(usersRepository);

    const { id } = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    });
    userId = id;
  });

  it('should be able to get user profile', async () => {
    const { user } = await sut.execute({
      userId,
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toEqual('John Doe');
  });

  it('should not be able to get user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existing-id',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
