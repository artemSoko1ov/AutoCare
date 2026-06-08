export const carBrandValues = [
  'Audi',
  'BMW',
  'Chevrolet',
  'Ford',
  'Honda',
  'Hyundai',
  'Kia',
  'Lexus',
  'Mazda',
  'Mercedes-Benz',
  'Mitsubishi',
  'Nissan',
  'Renault',
  'Skoda',
  'Toyota',
  'Volkswagen',
  'Volvo',
] as const;

export type CarBrand = (typeof carBrandValues)[number];

export const carCatalog: Record<CarBrand, readonly string[]> = {
  Audi: ['A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q5', 'Q7', 'Q8'],
  BMW: ['1 Series', '3 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5', 'X6'],
  Chevrolet: ['Aveo', 'Captiva', 'Cruze', 'Lacetti', 'Niva', 'Tahoe'],
  Ford: ['Fiesta', 'Focus', 'Kuga', 'Mondeo', 'Mustang'],
  Honda: ['Accord', 'CR-V', 'Civic', 'Fit', 'Pilot'],
  Hyundai: ['Creta', 'Elantra', 'Santa Fe', 'Solaris', 'Sonata', 'Tucson'],
  Kia: ['Ceed', 'Cerato', 'K5', 'Rio', 'Sorento', 'Sportage'],
  Lexus: ['ES', 'GX', 'IS', 'LX', 'NX', 'RX'],
  Mazda: ['CX-5', 'CX-9', 'Mazda3', 'Mazda6'],
  'Mercedes-Benz': ['A-Class', 'C-Class', 'CLA', 'E-Class', 'GLC', 'GLE', 'S-Class'],
  Mitsubishi: ['ASX', 'L200', 'Outlander', 'Pajero', 'Pajero Sport'],
  Nissan: ['Almera', 'Murano', 'Qashqai', 'Teana', 'X-Trail'],
  Renault: ['Arkana', 'Duster', 'Kaptur', 'Logan', 'Sandero'],
  Skoda: ['Fabia', 'Kamiq', 'Karoq', 'Kodiaq', 'Octavia', 'Rapid', 'Superb'],
  Toyota: ['Camry', 'Corolla', 'Highlander', 'Land Cruiser', 'RAV4'],
  Volkswagen: ['Golf', 'Passat', 'Polo', 'Tiguan', 'Touareg'],
  Volvo: ['S60', 'S90', 'XC40', 'XC60', 'XC90'],
};

export const isCarBrand = (brand: string): brand is CarBrand => {
  return carBrandValues.includes(brand as CarBrand);
};

export const getCarModelsByBrand = (brand: string) => {
  if (!isCarBrand(brand)) {
    return [];
  }

  return [...carCatalog[brand]];
};

export const isCarModelForBrand = (brand: string, model: string) => {
  return getCarModelsByBrand(brand).includes(model);
};
