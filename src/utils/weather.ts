export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@4x.png`
}

export function getWeatherBackground(iconCode: string): string {
  const condition = iconCode.slice(0, 2)

  switch (condition) {
    case '01':
      return 'clear'

    case '02':
    case '03':
    case '04':
      return 'cloudy'

    case '09':
    case '10':
      return 'rain'

    case '11':
      return 'storm'

    case '13':
      return 'snow'

    case '50':
      return 'mist'

    default:
      return 'cloudy'
  }
}
