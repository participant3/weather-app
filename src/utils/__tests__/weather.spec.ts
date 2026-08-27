/*
  weather.spec.ts

  Purpose:
  Contains unit tests for the weather utility functions.
  These tests verify that OpenWeather icon codes are correctly
  converted into application background styles and that the
  correct OpenWeather icon URL is generated.
*/

import { describe, expect, it } from 'vitest'

import { getWeatherBackground, getWeatherIconUrl } from '../weather'

// Groups all tests related to the weather utility functions.
describe('weather utilities', () => {
  // Tests the function responsible for selecting a background
  // based on the OpenWeather weather icon code.
  describe('getWeatherBackground', () => {
    // Checks the background returned for clear weather.
    // A daytime clear icon should use the clear background,
    // while the nighttime version should use the night background.
    it('returns clear for clear weather icons', () => {
      expect(getWeatherBackground('01d')).toBe('clear')
      expect(getWeatherBackground('01n')).toBe('night')
    })

    // Checks that weather icons ending in "n"
    // are recognised as nighttime conditions.
    it('returns night for nighttime weather icons', () => {
      expect(getWeatherBackground('01n')).toBe('night')

      expect(getWeatherBackground('02n')).toBe('night')

      expect(getWeatherBackground('10n')).toBe('night')
    })

    // Checks that daytime cloud weather codes
    // use the cloudy background.
    it('returns cloudy for cloud weather icons', () => {
      expect(getWeatherBackground('02d')).toBe('cloudy')
      expect(getWeatherBackground('03d')).toBe('cloudy')
      expect(getWeatherBackground('04d')).toBe('cloudy')
    })

    // Checks that daytime rain weather codes
    // use the rain background.
    it('returns rain for rain weather icons', () => {
      expect(getWeatherBackground('09d')).toBe('rain')
      expect(getWeatherBackground('10d')).toBe('rain')
    })

    // Checks that thunderstorm weather
    // uses the storm background.
    it('returns storm for thunderstorm icons', () => {
      expect(getWeatherBackground('11d')).toBe('storm')
    })

    // Checks that snow weather uses the snow background.
    it('returns snow for snow icons', () => {
      expect(getWeatherBackground('13d')).toBe('snow')
    })

    // Checks that mist or fog weather
    // uses the mist background.
    it('returns mist for mist icons', () => {
      expect(getWeatherBackground('50d')).toBe('mist')
    })

    // Checks the fallback behaviour when an unknown
    // OpenWeather icon code is received.
    it('returns cloudy for an unknown icon code', () => {
      expect(getWeatherBackground('99d')).toBe('cloudy')
    })
  })

  // Tests the utility responsible for creating
  // OpenWeather weather icon URLs.
  describe('getWeatherIconUrl', () => {
    // Checks that an icon code is converted into
    // the expected OpenWeather image URL.
    it('creates the correct OpenWeather icon URL', () => {
      expect(getWeatherIconUrl('01d')).toBe('https://openweathermap.org/img/wn/01d@4x.png')
    })
  })
})
