import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { ConfigService } from './config.service';

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface ICharacterRepository {
  getCharactersByEpisode(episodeId: number): Observable<Character[]>;
}

@Injectable({
  providedIn: 'root'
})
export class CharacterService implements ICharacterRepository {
  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  getCharactersByEpisode(episodeId: number): Observable<Character[]> {
    const apiUrl = `${this.configService.getApiBaseUrl()}/episode/${episodeId}/characters`;
    
    return this.http.get<Character[]>(apiUrl).pipe(
      map((response: any) => {

        let characters: any[] = [];
        
        if (Array.isArray(response)) {
          characters = response;
        } else if (response.characters && Array.isArray(response.characters)) {
          characters = response.characters;
        } else if (response.data && Array.isArray(response.data)) {
          characters = response.data;
        } else if (response.results && Array.isArray(response.results)) {
          characters = response.results;
        }

        const validatedCharacters = characters.map((char) => {
          return {
            id: char?.id || null,
            name: char?.name || 'Sin nombre',
            status: char?.status || 'unknown',
            species: char?.species || 'unknown',
            type: char?.type || '',
            gender: char?.gender || 'unknown',
            origin: char?.origin ? {
              name: char.origin.name || 'Desconocido',
              url: char.origin.url || ''
            } : {
              name: 'Desconocido',
              url: ''
            },
            location: char?.location ? {
              name: char.location.name || 'Desconocido',
              url: char.location.url || ''
            } : {
              name: 'Desconocido',
              url: ''
            },
            image: char?.image || '',
            episode: char?.episode || [],
            url: char?.url || '',
            created: char?.created || ''
          };
        });

        return validatedCharacters;
      }),
      catchError((error) => {
        console.error('Error fetching characters:', error);
        return of([]);
      })
    );
  }
}
