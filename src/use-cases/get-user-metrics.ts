import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { ICheckInsRepository } from '@/repositories/check-ins-repository';

interface GetUserMetricsUseCaseRequest {
  userId: string;
}

interface GetUserMetricsUseCaseResponse {
  checkInsCount: number;
}

export class GetUserMetricsUseCase {
  constructor(private checkInsRepository: ICheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const checkInsCount = await this.checkInsRepository.checkInCountByUserId(
      userId
    );

    if (!checkInsCount) {
      throw new ResourceNotFoundError();
    }

    return {
      checkInsCount,
    };
  }
}
