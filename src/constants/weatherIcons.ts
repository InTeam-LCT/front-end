import { Weather } from "../types/Building";

export const WEATHER_ICONS: Record<Weather, string> = {
    "Ясно": "clear",
    "В основном ясно": "mainly_clear",
    "Переменная облачность": "partly_cloudy",
    "Пасмурно": "mainly_cloudy",
    "Снегопад": "snow",
    "Дождь": "rain",
    "Туман": "fog",
    "Ливень": "shower",
    "Град": "hail",
}