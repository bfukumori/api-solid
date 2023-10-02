import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository';
import { describe, it, expect, beforeEach } from 'vitest';
import { AuthenticateUseCase } from './authenticate';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let usersRepository: InMemoryUserRepository;
let sut: AuthenticateUseCase;

describe('Authenticate use case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUserRepository();
    sut = new AuthenticateUseCase(usersRepository);

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    });
  });

  it('should be able to authenticate', async () => {
    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'wrongemail@example.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: 'wrongpassword',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
