import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { ConfigService } from './config.service';
import { 
  Episode, 
  PaginationInfo, 
  PaginatedResponse, 
  IApiResponseMapper, 
  IUrlParser, 
  IEpisodeRepository 
} from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiResponseMapper implements IApiResponseMapper {
  mapResponse(response: any): PaginatedResponse {

    if (response.info && response.results) {
      return {
        info: {
          count: response.info.count || 0,
          pages: response.info.pages || 1,
          next: response.info.next || null,
          prev: response.info.prev || null
        },
        results: response.results
      };
    }
    
    if (Array.isArray(response)) {
      return {
        info: {
          count: response.length,
          pages: 1,
          next: null,
          prev: null
        },
        results: response
      };
    }
    
    return {
      info: response.info || { count: 0, pages: 1, next: null, prev: null },
      results: response.results || response.data || response.episodes || []
    };
  }
}

@Injectable({
  providedIn: 'root'
})
export class UrlParser implements IUrlParser {
  extractPageFromUrl(url: string | null): number | null {
    if (!url) return null;
    
    try {
      const urlObj = new URL(url);
      const pageParam = urlObj.searchParams.get('page');
      return pageParam ? parseInt(pageParam, 10) : null;
    } catch (error) {
      console.error('Error parsing URL:', error);
      return null;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class EpisodeService implements IEpisodeRepository {
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    @Inject('IApiResponseMapper') private responseMapper: IApiResponseMapper,
    @Inject('IUrlParser') private urlParser: IUrlParser
  ) { }

  getEpisodes(page: number = 1): Observable<PaginatedResponse> {
    const params = this.createHttpParams(page);
    const apiUrl = this.configService.getEpisodeEndpoint();
    
    return this.http.get<any>(apiUrl, { params }).pipe(
      map((response: any) => this.responseMapper.mapResponse(response)),
      catchError((error) => this.handleError(error))
    );
  }

  extractPageFromUrl(url: string | null): number | null {
    return this.urlParser.extractPageFromUrl(url);
  }

  private createHttpParams(page: number): HttpParams {
    return new HttpParams().set('page', page.toString());
  }

  private handleError(error: any): Observable<PaginatedResponse> {
    console.error('Error fetching episodes:', error);
    return of({
      info: { count: 0, pages: 1, next: null, prev: null },
      results: []
    });
  }
}
