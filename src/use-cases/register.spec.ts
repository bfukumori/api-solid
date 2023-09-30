import { expect, describe, it } from 'vitest';
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

describe('Register use case', () => {
  it('should hash user password upon registration', async () => {
    const inMemoryUsersRepository = new InMemoryUserRepository();
    const registerUseCase = new RegisterUseCase(inMemoryUsersRepository);

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to register with same email twice', async () => {
    const inMemoryUsersRepository = new InMemoryUserRepository();
    const registerUseCase = new RegisterUseCase(inMemoryUsersRepository);

    const requestBody = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    };

    await registerUseCase.execute(requestBody);

    expect(() => registerUseCase.execute(requestBody)).rejects.toBeInstanceOf(
      UserAlreadyExistsError
    );
  });

  it('Should be able to register', async () => {
    const inMemoryUsersRepository = new InMemoryUserRepository();
    const registerUseCase = new RegisterUseCase(inMemoryUsersRepository);

    const requestBody = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    };

    const { user } = await registerUseCase.execute(requestBody);

    expect(user.id).toEqual(expect.any(String));
  });
});
