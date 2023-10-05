import { expect, describe, it, beforeEach } from 'vitest';
import { CreateGymUseCase } from './create-gym';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

let inMemoryGymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe('Create gym use case', () => {
  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(inMemoryGymsRepository);
  });

  it('should be able to register', async () => {
    const { gym } = await sut.execute({
      title: 'Gym Ignite',
      latitude: -23.5153507,
      longitude: -46.3468447,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
