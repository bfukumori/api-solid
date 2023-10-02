import { expect, describe, it, beforeEach } from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

let inMemoryUsersRepository: InMemoryUserRepository;
let sut: RegisterUseCase;
let requestBody: {
  name: string;
  email: string;
  password: string;
};

describe('Register use case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUserRepository();
    sut = new RegisterUseCase(inMemoryUsersRepository);
    requestBody = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    };
  });

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute(requestBody);

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to register with same email twice', async () => {
    await sut.execute(requestBody);

    await expect(() => sut.execute(requestBody)).rejects.toBeInstanceOf(
      UserAlreadyExistsError
    );
  });

  it('Should be able to register', async () => {
    const { user } = await sut.execute(requestBody);

    expect(user.id).toEqual(expect.any(String));
  });
});
