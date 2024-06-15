import { useState } from "react";
import {
  YMapListener,
  YMapFeatureDataSource,
  YMapLayer,
} from "../../ymaps/index";
import AREAS from "../../assets/json/areas.json";
import DISTRICTS from "../../assets/json/districts.json";
import type { Area, District, Coordinates } from "../../types/Area";
import { YMapFeature } from "../../ymaps/index";
import type { MapEvents } from "@yandex/ymaps3-types";

const polygonsList: Coordinates[] = [];
(AREAS as Area[]).forEach((area) => {
  const entityOfCoordinates = area.coordinates.coordinates;
  polygonsList.push(...entityOfCoordinates);
});

const districtPolygonList: Coordinates[] = [];
(DISTRICTS as District[]).forEach((district) => {
  const entityOfCoordinates = district.coordinates.coordinates;
  districtPolygonList.push(...entityOfCoordinates);
});

const getPolygon = function (
  [inside, outside = []]: Coordinates,
  opacity = 0.1,
  source: string,
  id: string
) {
  return (
    <YMapFeature
      id={id}
      key={id}
      geometry={{
        type: "Polygon",
        coordinates: [inside, outside],
      }}
      style={{
        stroke: [{ width: 1, color: "#00A500" }],
        fill: `rgba(56, 56, 219, ${opacity})`,
      }}
      source={source}
    />
  );
};

const areasComponents = polygonsList.map((polygon, i) =>
  getPolygon(polygon, undefined, "areas-source", `area-${i}`)
);
const districtComponents = districtPolygonList.map((polygon, i) =>
  getPolygon(polygon, 0, "district-source", `district-${i}`)
);

export const PolygonsComponent = function () {
  const [showDistricts, setShowDistricts] = useState(false);

  const handleZoomChange: MapEvents["onUpdate"] = (event) => {
    const newZoomLevel = event?.location?.zoom;
    if (newZoomLevel) {
      const newShowDistricts = newZoomLevel > 12;
      if (showDistricts !== newShowDistricts) {
        setShowDistricts(newShowDistricts);
      }
    }
  };

  return (
    <>
      <YMapFeatureDataSource id={"areas-source"} />
      <YMapFeatureDataSource id={"district-source"} />
      <YMapLayer
        id={"areas-layer"}
        type={"feature"}
        source="areas-source"
        zIndex={1800}
      />
      <YMapLayer
        id={"district-layer"}
        type={"feature"}
        source="district-source"
        zIndex={1801}
      />
      {areasComponents}
      {showDistricts && districtComponents}
      <YMapListener onUpdate={handleZoomChange} />
      <YMapListener layer="district-layer" />
      <YMapListener layer="areas-layer" />
    </>
  );
};
