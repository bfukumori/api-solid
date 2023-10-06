import { expect, describe, it, beforeEach } from 'vitest';
import { SearchGymsUseCase } from './search-gyms';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe('Search gyms use case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it('should be able to search for gyms by title', async () => {
    await gymsRepository.create({
      title: 'Javascript Gym',
      latitude: -23.51555,
      longitude: -46.4755256,
    });

    await gymsRepository.create({
      title: 'Typescript Gym',
      latitude: -23.51555,
      longitude: -46.4755256,
    });

    const { gyms } = await sut.execute({ query: 'Javascript' });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Javascript Gym' }),
    ]);
  });

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `gym-${i}`,
        latitude: -23.51555,
        longitude: -46.4755256,
      });
    }

    const { gyms } = await sut.execute({
      query: 'gym',
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'gym-21' }),
      expect.objectContaining({ title: 'gym-22' }),
    ]);
  });
});
