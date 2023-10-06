import { Gym, Prisma } from '@prisma/client';
import { FindManyNearbyParams, IGymsRepository } from '../gyms-repository';
import { randomUUID } from 'node:crypto';
import { Decimal } from '@prisma/client/runtime/library';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';

export class InMemoryGymsRepository implements IGymsRepository {
  public items: Gym[] = [];

  async findById(id: string) {
    const gym = this.items.find((item) => item.id === id);

    if (!gym) {
      return null;
    }

    return gym;
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
    };

    this.items.push(gym);

    return gym;
  }

  async searchMany(query: string, page: number) {
    return this.items
      .filter((gym) => gym.title.toLowerCase().includes(query.toLowerCase()))
      .slice((page - 1) * 20, page * 20);
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    return this.items.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude,
          longitude,
        },
        {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        }
      );
      return distance < 10;
    });
  }
}
