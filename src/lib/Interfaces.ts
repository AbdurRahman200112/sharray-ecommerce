export interface Business {
  buid: string;
  title_ar: string;
  title_en: string;
  email: string;
  phone: string;
  address: string;
  descr_ar: string;
  descr_en: string;
  instructions: string;
  mainColor: string;
  secColor: string;
  textColor: string;
  logo: string;
}
export interface Product {
  uuid: string;
  buid: string;
  title: string;
  price: number;
  brand: string;
  collection: string;
  units: string;
  barcode: string;
  description: string;
  image: string;
}

export interface Collection {
  collection: string;
}

export interface CartItem {
  item_uuid: string;
  buid: string;
  title: string;
  price: number;
  brand: string;
  collection: string;
  units: string;
  barcode: string;
  description: string;
  image: string;
  quan: number;
  notes: string;
}

export interface FavoriteItem extends Product {
  isFavorite?: boolean;
}

export interface CollectionItem {
  collection: string;
}
