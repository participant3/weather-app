import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'

import WeatherLocationCard from '@/components/molecules/WeatherLocationCard.vue'
const testLocation = {
  id: 123,
  city: 'Milan',
  subtitle: 'Lombardy, IT',
  temperature: 25,
  high: 28,
  low: 19,
  description: 'clear sky',
  weatherIcon: '01d',
  backgroundImage: '',
  lat: 45.4642,
  lon: 9.19,
}

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),

    routes: [
      {
        path: '/',
        name: 'home',
        component: {
          template: '<div>Home</div>',
        },
      },
      {
        path: '/weather/:lat/:lon',
        name: 'weather-detail',
        component: {
          template: '<div>Weather Detail</div>',
        },
      },
    ],
  })
}

describe('WeatherLocationCard', () => {
  it('displays the location weather information', async () => {
    const router = createTestRouter()

    await router.push('/')
    await router.isReady()

    const wrapper = mount(WeatherLocationCard, {
      props: {
        location: testLocation,
      },

      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('Milan')
    expect(wrapper.text()).toContain('25°')
    expect(wrapper.text()).toContain('clear sky')
    expect(wrapper.text()).toContain('H:28°')
    expect(wrapper.text()).toContain('L:19°')
  })

  it('links to the correct weather detail page', async () => {
    const router = createTestRouter()

    await router.push('/')
    await router.isReady()

    const wrapper = mount(WeatherLocationCard, {
      props: {
        location: testLocation,
      },

      global: {
        plugins: [router],
      },
    })

    const link = wrapper.get('a')

    expect(link.attributes('href')).toBe('/weather/45.4642/9.19')
  })

  it('displays the correct weather icon', async () => {
    const router = createTestRouter()

    await router.push('/')
    await router.isReady()

    const wrapper = mount(WeatherLocationCard, {
      props: {
        location: testLocation,
      },

      global: {
        plugins: [router],
      },
    })

    const image = wrapper.get('.weather-card__icon')

    expect(image.attributes('src')).toBe('https://openweathermap.org/img/wn/01d@4x.png')

    expect(image.attributes('alt')).toBe('clear sky')
  })
})
