export function getCountryISO(countryName: string): string {
  const map: Record<string, string> = {
    'United States': 'us',
    'USA': 'us',
    'United Kingdom': 'gb',
    'UK': 'gb',
    'Canada': 'ca',
    'Puerto Rico': 'pr',
    'Colombia': 'co',
    'Spain': 'es',
    'Barbados': 'bb',
    'South Korea': 'kr',
    'Nigeria': 'ng',
    'India': 'in',
    'Mexico': 'mx',
    'Jamaica': 'jm',
    'France': 'fr',
    'Germany': 'de',
    'Australia': 'au',
    'Brazil': 'br',
    'South Africa': 'za',
    'Argentina': 'ar',
    'Italy': 'it',
    'Sweden': 'se',
    'Japan': 'jp',
    'New Zealand': 'nz'
  };

  return map[countryName] || 'us'; // Default to US if not found
}
