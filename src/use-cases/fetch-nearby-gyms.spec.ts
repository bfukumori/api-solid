import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('Fetch nearby gyms use case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      latitude: -23.5639382,
      longitude: -46.6608968,
    });

    await gymsRepository.create({
      title: 'Nearest Gym',
      latitude: -23.5639381,
      longitude: -46.6608969,
    });

    await gymsRepository.create({
      title: 'Far Gym',
      latitude: -23.5435193,
      longitude: -46.7596935,
    });

    const { gyms } = await sut.execute({
      userLatitude: -23.5639385,
      userLongitude: -46.6608969,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Near Gym' }),
      expect.objectContaining({ title: 'Nearest Gym' }),
    ]);
  });
});
