import React from "react";
import ReactDOM from "react-dom";

const ymaps3Reactify = await ymaps3.import("@yandex/ymaps3-reactify");
const ymaps3Clusterer = await ymaps3.import("@yandex/ymaps3-clusterer@0.0.1");

const reactify = ymaps3Reactify.reactify.bindTo(React, ReactDOM);

const {
  YMap,
  YMapDefaultSchemeLayer,
  YMapDefaultFeaturesLayer,
  YMapListener,
  YMapMarker,
  YMapFeature,
  YMapFeatureDataSource,
  YMapLayer,
} = reactify.module(ymaps3);

const { YMapClusterer, clusterByGrid } = reactify.module(ymaps3Clusterer);

export {
  YMap,
  YMapDefaultSchemeLayer,
  YMapDefaultFeaturesLayer,
  YMapLayer,
  YMapMarker,
  YMapFeature,
  YMapFeatureDataSource,
  YMapListener,
  YMapClusterer,
  clusterByGrid,
};
