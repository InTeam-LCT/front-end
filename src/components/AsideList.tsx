import {
  Button,
  Card,
  DatePicker,
  DatePickerProps,
  Input,
  List,
  Slider,
  Spin,
} from "antd";
import { debounce } from "radash";
import { BaseSyntheticEvent, memo, useEffect, useMemo, useState } from "react";
import { Building } from "../types/Building";
import UploadButton from "./UploadButton";
import dayjs from "dayjs";
import { BUILDING_TYPES } from "../constants/buildingTypes";
import BuildingDetailsModal from "./BuildingDetailsModal";
import { parseHouseNumber } from "../utils/parseHouseNumber";

type Props = {
  buildingsList: Building[];
  setFilterValue: (value: string) => void;
  setSliderValue: (value: number[]) => void;
  setDateChange: DatePickerProps["onChange"];
  initialDate: string
};

const AsideList = memo(function ({
  buildingsList,
  setFilterValue: setFilter,
  setSliderValue,
  setDateChange,
  initialDate
}: Props) {
  const [pagination, setPagination] = useState(1);
  const [filterIsLoading, setFilterIsLoading] = useState(false);
  const [showLoadMore, setShowLoadMore] = useState(true);
  const [modalData, setModalData] = useState<Building | null>(null);

  const debouncedFilter = useMemo(
    () =>
      debounce({ delay: 500 }, (value) => {
        setFilter(value);
        setFilterIsLoading(false);
      }),
    [setFilter]
  );

  const debouncedSlider = useMemo(
    () =>
      debounce({ delay: 200 }, () => {
        setFilterIsLoading(false);
      }),
    []
  );
  const handleSliderChange = (value: number[]) => {
    setFilterIsLoading(true);
    setSliderValue(value);
    setPagination(1);
    debouncedSlider();
  };

  const paginatedData = useMemo(
    () => buildingsList.slice(0, 5 * pagination),
    [buildingsList, pagination]
  );

  const handleFilterChange = (e: BaseSyntheticEvent) => {
    setFilterIsLoading(true);
    setPagination(1);
    debouncedFilter(e.target.value);
  };

  const incrementPagination = () => setPagination((prev) => prev + 1);

  useEffect(() => {
    if (buildingsList.length > 5 * pagination) {
      setShowLoadMore(true);
    } else {
      setShowLoadMore(false);
    }
  }, [buildingsList, pagination]);

  return (
    <div className="flex flex-col px-[10px] gap-[10px] h-full">
      <UploadButton />
      <Input onChange={handleFilterChange} placeholder="Фильтр" allowClear />
      <Slider
        range
        defaultValue={[1, 5]}
        min={1}
        max={5}
        onChange={handleSliderChange}
      />
      <DatePicker
        allowClear={false}
        defaultValue={dayjs(initialDate, "YYYY-MM-DD")}
        onChange={setDateChange}
      />
      <div className="flex flex-col overflow-auto min-h-[200px]">
        {filterIsLoading ? (
          <Spin style={{ marginTop: 12 }} />
        ) : (
          <List
            dataSource={paginatedData}
            split={false}
            loadMore={
              paginatedData.length &&
              showLoadMore && (
                <Button
                  style={{
                    textAlign: "center",
                    marginTop: 12,
                    height: 32,
                    lineHeight: "32px",
                  }}
                  onClick={incrementPagination}
                >
                  Загрузить ещё
                </Button>
              )
            }
            renderItem={(item: Building) => (
              <List.Item key={item.unom}>
                <Card
                  style={{ width: "100%", marginRight: 5, cursor: "pointer" }}
                  title={item.unom}
                  key={item.unom}
                  onClick={() => setModalData(item)}
                >
                  <div className="flex flex-col">
                    <div>
                      {item.city}, {item.area}, {item.street || item.village}
                      {parseHouseNumber(item)}
                    </div>
                    <div>
                      Прогнозируемая опасность: {item.predication.prediction}
                    </div>
                    <div>
                      Тип объекта:{" "}
                      {BUILDING_TYPES[item.predication.usage_priority_type]}
                    </div>
                  </div>
                </Card>
              </List.Item>
            )}
          ></List>
        )}
      </div>

      <BuildingDetailsModal
        modalData={modalData}
        isModalOpen={Boolean(modalData)}
        setModalData={setModalData}
      />
    </div>
  );
});

export default AsideList;
