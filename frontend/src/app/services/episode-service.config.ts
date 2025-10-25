import { Provider } from '@angular/core';
import { IApiResponseMapper, IUrlParser } from '../interfaces';
import { ApiResponseMapper, UrlParser } from './episode.service';
import { ConfigService } from './config.service';

export const EPISODE_SERVICE_PROVIDERS: Provider[] = [
  ConfigService,
  ApiResponseMapper,
  UrlParser,
  {
    provide: 'IApiResponseMapper',
    useClass: ApiResponseMapper
  },
  {
    provide: 'IUrlParser',
    useClass: UrlParser
  }
];
