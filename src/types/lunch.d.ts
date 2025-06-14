export interface LunchData {
  name: string;
  link: string | null;
  image: string | null;
  info: LunchInfo;
  menu: LunchMenuSection[];
}

export interface LunchInfo {
  address: string | null;
  lunch_time: string | null;
}

export interface LunchMenuSection {
  name: string;
  children: LunchMenuItem[];
}

export interface LunchMenuItem {
  name: string;
  price: number | null;
}
