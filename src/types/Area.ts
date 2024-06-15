import { LngLat } from "@yandex/ymaps3-types";

type PolygonCoordinates = LngLat[];
/** @description [`Координаты полигона`, `Координаты внутренней зоны, для вырезания из полигона`] */
export type Coordinates = [PolygonCoordinates, PolygonCoordinates?];

export type Area = {
  nameRegRu: string;
  nameRegEng: string;
  coordinates: {
    type: "MultiPolygon";
    coordinates: Coordinates[];
  };
};

export type District = {
  nameDisRu: string;
  nameDisEng: string;
  coordinates: {
    type: "MultiPolygon";
    coordinates: Coordinates[];
  };
}