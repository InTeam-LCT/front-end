import { Building } from "../types/Building";

export const parseHouseNumber = (building: Building) => {
  if (!building.numberHouse) {
    return;
  }
  return `, дом ${building.numberHouse}${building.enclosure ? `, корпус ${building.enclosure}` : ""}${building.structure ? `, строение ${building.structure}` : ""}`;
};
