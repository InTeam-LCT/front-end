import { Feature } from '@yandex/ymaps3-types/packages/clusterer';
import { Building } from './Building';

export type FeatureWithBuilding = Feature & { building?: Building }