import { useCallback, useMemo } from "react";
import { useState } from "react";
import {
  YMapMarker,
  YMapFeatureDataSource,
  YMapLayer,
  YMapClusterer,
  clusterByGrid,
} from "../../ymaps/index";
import { Building } from "../../types/Building";
import { Feature } from "@yandex/ymaps3-types/packages/clusterer";
import { FeatureWithBuilding } from "../../types/FeatureWithBuilding";
import type { LngLat } from "@yandex/ymaps3-types";
import BuildingDetailsModal from "../BuildingDetailsModal";

const BUILDING_CLASS: Record<number, string> = {
  1: "social",
  2: "industrial",
  3: "house",
  4: "other",
};

type Props = {
  buildingsList: Building[];
};

export const MarkersComponent = function ({ buildingsList }: Props) {
  const markers = useMemo(
    () =>
      buildingsList.map(
        (building): FeatureWithBuilding => ({
          type: "Feature",
          id: String(building.unom),
          geometry: {
            type: "Point",
            coordinates: building?.coordinate?.coordinates || [],
          },
          building,
        })
      ),
    [buildingsList]
  );

  // @ts-expect-error We declare a render function. For the clustering method, we pass and store the size of one grid division in pixels
  const gridSizedMethod = useMemo(() => clusterByGrid({ gridSize: 128 }), []);

  const marker = useCallback(
    (feature: FeatureWithBuilding) => (
      <YMapMarker
        key={feature.id}
        coordinates={feature.geometry.coordinates}
        source="clusterer-source"
      >
        <div
          className={`marker marker--${
            BUILDING_CLASS[feature?.building!.predication.usage_priority_type]
          } marker--predict-${feature?.building!.predication.prediction}`}
          onClick={() => setModalData(feature.building as Building)}
        />
      </YMapMarker>
    ),
    []
  );

  const cluster = useCallback(
    (coordinates: LngLat, features: Feature[]) => (
      <YMapMarker
        key={`${features[0].id}-${features.length}`}
        coordinates={coordinates}
        source="clusterer-source"
      >
        <div className="circle">
          <div className="circle-content">
            <span className="circle-text">
              {features.length > 1000
                ? Math.floor(features.length / 1000) + "k"
                : features.length}
            </span>
          </div>
        </div>
      </YMapMarker>
    ),
    []
  );

  const [modalData, setModalData] = useState<Building | null>(null);
  const MAX_ZOOM = 17.3;

  return (
    <>
      <YMapFeatureDataSource id="clusterer-source" />
      <YMapLayer source="clusterer-source" type="markers" zIndex={1804} />
      <YMapClusterer
        marker={marker}
        cluster={cluster}
        method={gridSizedMethod}
        features={markers}
        maxZoom={MAX_ZOOM}
      />
      <BuildingDetailsModal
        modalData={modalData}
        setModalData={setModalData}
      />
    </>
  );
};
