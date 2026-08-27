/*
  weather.ts

  Purpose:
  Provides reusable utility functions for weather-related display logic.
  It generates OpenWeather icon URLs and determines which background
  style should be used based on the weather condition and whether
  the location is experiencing daytime or nighttime.
*/

// Creates the OpenWeather image URL for a given weather icon code.
// For example, "01d" produces the daytime clear-sky weather icon.
export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@4x.png`
}

// Determines which background style should be displayed
// based on the OpenWeather icon code.
export function getWeatherBackground(iconCode: string): string {
  // Extracts the first two characters of the icon code.
  // These numbers identify the weather condition.
  const condition = iconCode.slice(0, 2)

  // OpenWeather icon codes ending in "n" represent nighttime,
  // while codes ending in "d" represent daytime.
  const isNight = iconCode.endsWith('n')

  // All nighttime conditions use the dark night background.
  if (isNight) {
    return 'night'
  }

  // Selects the appropriate daytime background
  // based on the OpenWeather condition code.
  switch (condition) {
    // Clear sky
    case '01':
      return 'clear'

    // Few clouds, scattered clouds, and broken clouds
    case '02':
    case '03':
    case '04':
      return 'cloudy'

    // Shower rain and rain
    case '09':
    case '10':
      return 'rain'

    // Thunderstorm
    case '11':
      return 'storm'

    // Snow
    case '13':
      return 'snow'

    // Mist / fog
    case '50':
      return 'mist'

    // Uses the cloudy background as a safe fallback
    // if an unexpected icon code is received.
    default:
      return 'cloudy'
  }
}
