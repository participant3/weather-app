import { describe, expect, it } from 'vitest'

import { getWeatherBackground, getWeatherIconUrl } from '../weather'

describe('weather utilities', () => {
  describe('getWeatherBackground', () => {
    it('returns clear for clear weather icons', () => {
      expect(getWeatherBackground('01d')).toBe('clear')
      expect(getWeatherBackground('01n')).toBe('clear')
    })

    it('returns cloudy for cloud weather icons', () => {
      expect(getWeatherBackground('02d')).toBe('cloudy')
      expect(getWeatherBackground('03d')).toBe('cloudy')
      expect(getWeatherBackground('04d')).toBe('cloudy')
    })

    it('returns rain for rain weather icons', () => {
      expect(getWeatherBackground('09d')).toBe('rain')
      expect(getWeatherBackground('10d')).toBe('rain')
    })

    it('returns storm for thunderstorm icons', () => {
      expect(getWeatherBackground('11d')).toBe('storm')
    })

    it('returns snow for snow icons', () => {
      expect(getWeatherBackground('13d')).toBe('snow')
    })

    it('returns mist for mist icons', () => {
      expect(getWeatherBackground('50d')).toBe('mist')
    })

    it('returns cloudy for an unknown icon code', () => {
      expect(getWeatherBackground('99d')).toBe('cloudy')
    })
  })

  describe('getWeatherIconUrl', () => {
    it('creates the correct OpenWeather icon URL', () => {
      expect(getWeatherIconUrl('01d')).toBe('https://openweathermap.org/img/wn/01d@4x.png')
    })
  })
})
