import "./App.css";
import MapComponent from "./components/YandexMap/MapComponent";
import AsideList from "./components/AsideList";
import { Spin, Tooltip, message } from "antd";
import type { DatePickerProps } from "antd";
import { Api } from "./api";
import { useEffect, useMemo, useState } from "react";
import type { Building, Weather } from "./types/Building";
import dayjs from "dayjs";
import { WEATHER_ICONS } from "./constants/weatherIcons";

const CURRENT_DATE = dayjs().format("YYYY-MM-DD");

const REGEXP_PUNCTUATION = /[,.?!]/g;
const FILTER_PRIORITY_TYPES: Record<number, string[]> = {
  1: ["соц", "знач"],
  2: ["пром"],
  3: ["мкд"],
};
const EXCLUDED_WRODS = ["дом", "корпус", "строение"];
const filterPriorityType = (word: string, type: number) =>
  FILTER_PRIORITY_TYPES[type].some((value) => word.includes(value));

function App() {
  const [buildingsList, setBuildingsList] = useState<Building[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [sliderValue, setSliderValue] = useState([1, 5]);
  const [dateValue, setDateValue] = useState(CURRENT_DATE);
  const [weather, setWeather] = useState<{
    temp: number | null;
    type: Weather | null;
  }>({ temp: null, type: null });

  const filtredData = useMemo(() => {
    const filterWords = filterValue
      .split(" ")
      .map((word) => word.toLocaleLowerCase().replace(REGEXP_PUNCTUATION, ""))
      .filter((word) => !EXCLUDED_WRODS.includes(word));
    return buildingsList
      .filter(
        (building) =>
          building?.predication.prediction >= sliderValue[0] &&
          building?.predication.prediction <= sliderValue[1]
      )
      .filter((building) =>
        filterWords.every(
          (word) =>
            filterPriorityType(
              word,
              building.predication.usage_priority_type
            ) ||
            Object.values(building).some((value) =>
              String(value).toLocaleLowerCase().includes(word)
            )
        )
      );
  }, [buildingsList, filterValue, sliderValue]);

  const [loadingBuildings, setLoadingBuildings] = useState(false)

  useEffect(() => {
    async function getBuildingsList() {
      let response;
      try {
        setLoadingBuildings(true)
        if (dateValue !== dayjs().format("YYYY-MM-DD")) {
          response = await Api.getAreaBuildingsByDate(dateValue);
        } else {
          response = await Api.getAreaBuildings();
        }


        setWeather({
          temp: response[0].predication.temp_mean_day,
          type: response[0].predication.weather,
        });

        setBuildingsList(
          response.toSorted((a: Building, b: Building) => {
            if (
              a.predication.usage_priority_type ===
              b.predication.usage_priority_type
            ) {
              return b.predication.prediction - a.predication.prediction;
            } else {
              return (
                a.predication.usage_priority_type -
                b.predication.usage_priority_type
              );
            }
          })
        );
      } catch {
        message.error("Ошибка при загрузке данных");
      } finally {
        setLoadingBuildings(false)
      }
    }
    getBuildingsList();
  }, [dateValue]);

  const setDateChange: DatePickerProps["onChange"] = (date) => {
    setDateValue(date.format("YYYY-MM-DD"));
  };

  if (!buildingsList.length || loadingBuildings) return <Spin size="large" fullscreen />;
  return (
    <>
      <div className="flex w-[100%] h-[100%]">
        <aside className="flex flex-col gap-[10px] w-[400px] my-1 bg-gray-100">
          <AsideList
            initialDate={dateValue}
            buildingsList={filtredData}
            setFilterValue={setFilterValue}
            setSliderValue={setSliderValue}
            setDateChange={setDateChange}
          />
        </aside>
        <main className="flex w-[100%] h-[100%]">
          <MapComponent buildingsList={filtredData} />
        </main>
        {weather.type && (
          <Tooltip
            title={
              <section>
                <p>Средние показатели за день</p>
                <p>Температура: {weather.temp}°C</p>
                <p>Погода: {weather.type}</p>
              </section>
            }
          >
            <div className="flex shadow-xl items-center gap-2 min-w-[40px] min-h-[40px] absolute right-2 top-2 bg-white rounded-xl p-1">
              <p className="from-neutral-600 font-semibold">{weather.temp}°C</p>
              <img
                src={`weather/${WEATHER_ICONS[weather.type]}.png`}
                width={30}
                alt={weather.type}
              />
            </div>
          </Tooltip>
        )}
      </div>
    </>
  );
}

export default App;
