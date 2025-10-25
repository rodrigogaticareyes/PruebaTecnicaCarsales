import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EpisodeService } from '../../services/episode.service';
import { CharacterService, Character } from '../../services/character.service';
import { Episode } from '../../interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-episode-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './episode-list.component.html',
  styleUrls: ['./episode-list.component.css']
})
export class EpisodeListComponent implements OnInit, OnDestroy {
  episodes: Episode[] = [];
  filteredEpisodes: Episode[] = [];
  loading = true;
  error: string | null = null;
  currentPage = 1;
  totalPages = 1;
  searchTerm = '';
  
  // Modal properties
  showModal = false;
  modalLoading = false;
  modalError: string | null = null;
  characters: Character[] = [];
  filteredCharacters: Character[] = [];
  selectedEpisodeId: number | null = null;
  selectedEpisodeName = '';
  characterSearchTerm = '';
  
  private subscription?: Subscription;

  constructor(
    private episodeService: EpisodeService,
    private characterService: CharacterService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadEpisodes(1);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadEpisodes(page: number = 1): void {
    this.loading = true;
    this.error = null;
    this.currentPage = page;
    
    this.cdr.detectChanges();

    this.subscription = this.episodeService.getEpisodes(page).subscribe({
      next: (response) => {
        debugger;
        this.episodes = response.results || [];
        this.applyFilter();
        this.totalPages = response.info?.pages || 1;
        this.loading = false;
               
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.error = 'Error al cargar los episodios: ' + (error.message || 'Error desconocido');
        this.loading = false;
        this.episodes = [];
        
        this.cdr.detectChanges();
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.loadEpisodes(page);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    const start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(this.totalPages, start + maxVisible - 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  }

  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm.trim();
    this.applyFilter();
    this.cdr.detectChanges();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilter();
    this.cdr.detectChanges();
  }

  private applyFilter(): void {
    if (!this.searchTerm) {
      this.filteredEpisodes = [...this.episodes];
    } else {
      this.filteredEpisodes = this.episodes.filter(episode =>
        episode.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  getFilteredCount(): number {
    return this.filteredEpisodes.length;
  }

  hasActiveFilter(): boolean {
    return this.searchTerm.length > 0;
  }

  viewEpisodeCharacters(episodeId: number): void {
    const episode = this.episodes.find(ep => ep.id === episodeId);
    this.selectedEpisodeId = episodeId;
    this.selectedEpisodeName = episode?.name || `Episodio ${episodeId}`;
    
    this.showModal = true;
    this.loadCharacters(episodeId);
  }

  private loadCharacters(episodeId: number): void {
    this.modalLoading = true;
    this.modalError = null;
    this.characters = [];

    this.characterService.getCharactersByEpisode(episodeId).subscribe({
      next: (characters) => {
        this.characters = characters;
        this.applyCharacterFilter();
        this.modalLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.modalError = 'Error al cargar los personajes: ' + (error.message || 'Error desconocido');
        this.modalLoading = false;
        this.characters = [];
        this.cdr.detectChanges();
      }
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.characters = [];
    this.filteredCharacters = [];
    this.selectedEpisodeId = null;
    this.selectedEpisodeName = '';
    this.characterSearchTerm = '';
    this.modalError = null;
  }

  retryLoadCharacters(): void {
    if (this.selectedEpisodeId) {
      this.loadCharacters(this.selectedEpisodeId);
    }
  }

  // ===== CHARACTER SEARCH METHODS =====
  onCharacterSearchChange(searchTerm: string): void {
    this.characterSearchTerm = searchTerm.trim();
    this.applyCharacterFilter();
    this.cdr.detectChanges();
  }

  clearCharacterSearch(): void {
    this.characterSearchTerm = '';
    this.applyCharacterFilter();
    this.cdr.detectChanges();
  }

  private applyCharacterFilter(): void {
    if (!this.characterSearchTerm) {
      this.filteredCharacters = [...this.characters];
    } else {
      this.filteredCharacters = this.characters.filter(character =>
        character.name.toLowerCase().includes(this.characterSearchTerm.toLowerCase()) ||
        character.species.toLowerCase().includes(this.characterSearchTerm.toLowerCase()) ||
        character.status.toLowerCase().includes(this.characterSearchTerm.toLowerCase()) ||
        character.gender.toLowerCase().includes(this.characterSearchTerm.toLowerCase()) ||
        character.origin.name.toLowerCase().includes(this.characterSearchTerm.toLowerCase()) ||
        character.location.name.toLowerCase().includes(this.characterSearchTerm.toLowerCase())
      );
    }
  }

  hasCharacterSearchActive(): boolean {
    return this.characterSearchTerm.length > 0;
  }

  getFilteredCharactersCount(): number {
    return this.filteredCharacters.length;
  }

}
