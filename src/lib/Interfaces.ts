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
  find(arg0: (p: any) => boolean): unknown;
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
  item?: any;  // Keeping it optional since it may be used for nested item properties.
}

export interface CartItem extends Product {
  quan: number;
  notes: string;
}

export interface FavoriteItem extends Product {
  uuid: string;  // You can keep this separate from `uuid` if it represents a different identifier.
  isFavorite?: boolean;
}

export interface CollectionItem {
  collection: string;
}
