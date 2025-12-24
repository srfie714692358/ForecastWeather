export interface Weather {
	time: string;
	temperature: number;
	feels_like: number;
	humidity: number;
	wind_speed: number;
	wind_direction: number;
	weathercode: number;
	[key: string]: unknown;
}

export interface DayWeather {
  time: string;
  temp_max: number;
  temp_min: number;
  feels_like_max: number;
  feels_like_min: number;
  weathercode: number;
}

export interface WeatherResponse {
	status: number;
	current: Weather;
	nextHours: Weather[];
	nextDays: DayWeather[];
	error?: string;
}