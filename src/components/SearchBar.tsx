import { useEffect, useRef, useState } from 'react';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { fetchCitySuggestions } from '../lib/api';
import type { CitySuggestion } from '../types/weather';
import { LocationIcon, SearchIcon } from './icons';

interface SearchBarProps {
  onSearchCity: (city: string, country?: string) => void;
  onUseLocation: () => void;
}

export function SearchBar({ onSearchCity, onUseLocation }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebouncedValue(query, 300);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    // Mínimo de 3 caracteres: com 2, o Nominatim devolve ruído e a gente gasta
    // requisição num serviço público de graça — ver ADR-0004.
    if (debouncedQuery.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    fetchCitySuggestions(debouncedQuery.trim()).then((results) => {
      if (!cancelled) {
        setSuggestions(results);
        // Só abre se o usuário ainda estiver digitando no campo.
        setOpen(results.length > 0 && document.activeElement === inputRef.current);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  function submit() {
    const trimmed = query.trim();
    if (!trimmed) return;
    const [city, country] = trimmed.split(',').map((part) => part.trim());
    onSearchCity(city, country);
    setSuggestions([]);
    setOpen(false);
    inputRef.current?.blur();
  }

  function pick(suggestion: CitySuggestion) {
    setQuery(suggestion.state ? `${suggestion.name}, ${suggestion.state}` : suggestion.name);
    onSearchCity(suggestion.name, suggestion.country);
    setSuggestions([]);
    setOpen(false);
  }

  return (
    <div className="search" ref={containerRef}>
      <button
        type="button"
        className="search-locate"
        title="Usar minha localização"
        aria-label="Usar minha localização"
        onClick={onUseLocation}
      >
        <LocationIcon />
      </button>
      <input
        ref={inputRef}
        type="text"
        className="search-input"
        placeholder="Buscar cidade…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit();
          if (e.key === 'Escape') setOpen(false);
        }}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        aria-label="Buscar cidade"
      />
      <button type="button" className="search-submit" title="Pesquisar" aria-label="Pesquisar" onClick={submit}>
        <SearchIcon />
      </button>

      {open && (
        <ul className="search-suggestions" role="listbox">
          {suggestions.map((s, index) => (
            <li key={`${s.displayName}-${index}`}>
              <button type="button" onClick={() => pick(s)} title={s.displayName}>
                <span className="suggestion-city">{s.name}</span>
                <span className="suggestion-region">
                  {[s.state, s.country].filter(Boolean).join(', ')}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
