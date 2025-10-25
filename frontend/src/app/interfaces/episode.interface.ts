export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string;
}

export interface PaginationInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface PaginatedResponse {
  info: PaginationInfo;
  results: Episode[];
}

export interface IApiResponseMapper {
  mapResponse(response: any): PaginatedResponse;
}

export interface IUrlParser {
  extractPageFromUrl(url: string | null): number | null;
}

export interface IEpisodeRepository {
  getEpisodes(page: number): import('rxjs').Observable<PaginatedResponse>;
}
