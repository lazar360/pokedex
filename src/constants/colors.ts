// couleurs pastel inspirées des couleurs officielles de chaque type
export const colorsByType: Record<string, string> = {
  normal: '#D9D5C3',
  fire: '#FFB38A',
  water: '#9DC3F5',
  electric: '#FFE680',
  grass: '#A8E0A0',
  ice: '#B8EAE6',
  fighting: '#E8A09A',
  poison: '#D3A6DB',
  ground: '#EBD3A0',
  flying: '#C9BDF5',
  psychic: '#FFA8C5',
  bug: '#CFE08A',
  rock: '#D9C98F',
  ghost: '#B3A6CC',
  dragon: '#A99BF5',
  dark: '#B5A699',
  steel: '#CFCFDE',
  fairy: '#F5C2DC',
};

export function getTypeColor(type: string | undefined): string {
  return (type && colorsByType[type]) || '#E0E0E0';
}
