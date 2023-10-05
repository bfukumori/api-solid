import { expect, describe, it, beforeEach } from 'vitest';
import { CreateGymUseCase } from './create-gym';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

let inMemoryGymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;
let requestBody: {
  title: string;
  description?: string;
  phone?: string;
  latitude: number;
  longitude: number;
};

describe('Create gym use case', () => {
  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(inMemoryGymsRepository);

    requestBody = {
      title: 'Gym Ignite',
      latitude: -23.5153507,
      longitude: -46.3468447,
    };
  });

  it('should be able to register', async () => {
    const { gym } = await sut.execute(requestBody);

    expect(gym.id).toEqual(expect.any(String));
  });
});
