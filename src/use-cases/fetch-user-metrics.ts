import { ResourceNotFoundError } from './errors/resource-not-found-error';
import { ICheckInsRepository } from '@/repositories/check-ins-repository';

interface FetchUserMetricsUseCaseRequest {
  userId: string;
}

interface FetchUserMetricsUseCaseResponse {
  checkInsCount: number;
}

export class FetchUserMetricsUseCase {
  constructor(private checkInsRepository: ICheckInsRepository) {}

  async execute({
    userId,
  }: FetchUserMetricsUseCaseRequest): Promise<FetchUserMetricsUseCaseResponse> {
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
