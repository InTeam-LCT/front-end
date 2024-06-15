import {
  YMap,
  YMapDefaultSchemeLayer,
  YMapDefaultFeaturesLayer,
} from "../../ymaps/index";
import { Building } from "../../types/Building";
import { PolygonsComponent } from "./PolygonsComponent";
import { MarkersComponent } from "./MarkersComponent";
import { memo } from "react";

const START_LOCATION = { center: [37.629762, 55.689311], zoom: 10 };

type Props = {
  buildingsList: Building[];
};

const MapComponent = memo(function ({ buildingsList }: Props) {
  return (
    <>
      <YMap location={START_LOCATION} mode="vector">
        <YMapDefaultSchemeLayer />
        <YMapDefaultFeaturesLayer />
        <PolygonsComponent />
        <MarkersComponent buildingsList={buildingsList} />
      </YMap>
    </>
  );
});

export default MapComponent;
