import type { LngLat } from "@yandex/ymaps3-types";

export type Weather =
  | "Ясно"
  | "В основном ясно"
  | "Переменная облачность"
  | "Пасмурно"
  | "Снегопад"
  | "Дождь"
  | "Туман"
  | "Ливень"
  | "Град";

export type Building = {
  unom: number;
  city: string | null;
  area: string | null;
  district: string | null;
  street: string | null;
  numberHouse: string;
  enclosure: string;
  structure: string;
  snt: string | null;
  village: string | null;
  coordinate: {
    coordinates: LngLat;
    type: "Point";
  };
  predication: {
    usage_priority_type: number;
    prediction_date: string;
    n_flats: number | null;
    unom: number;
    prediction: number;
    square: number | null;
    weather: Weather;
    temp_mean_day: number;
    material: string | null;
    distance_to_moscow_center: number | null;
    assignment_structure: string | null;
  };
};
