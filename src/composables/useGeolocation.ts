export interface Coordinates {
  lat: number
  lon: number
}

export function useGeolocation() {
  function getCurrentPosition(): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          })
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject(new Error('Location permission was denied.'))
              break

            case error.POSITION_UNAVAILABLE:
              reject(new Error('Your location is currently unavailable.'))
              break

            case error.TIMEOUT:
              reject(new Error('Location request timed out.'))
              break

            default:
              reject(new Error('Unable to retrieve your location.'))
          }
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000,
        },
      )
    })
  }

  return {
    getCurrentPosition,
  }
}
