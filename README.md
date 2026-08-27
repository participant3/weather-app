# Weather App

A responsive weather application built with Vue 3 and TypeScript. The application allows users to search for locations, save cities, view current weather conditions and forecasts, manage their profile, and share weather information.

Weather data is retrieved from the OpenWeather API.
---

## Features

- Search for cities and locations
- Display live weather data from OpenWeather
- Save weather locations
- Remove saved locations
- View detailed weather information
- View upcoming 3-hour forecasts
- View weekly forecasts
- Refresh weather data
- Dynamic weather icons and backgrounds
- Dynamic day and night backgrounds based on weather icon data
- Navigate between weather locations and detail pages
- Default "My Location" weather card for Bangsar South
- Edit and save user profile information
- Upload a custom profile picture from the user's device
- Form validation for profile information
- Persistent data using browser localStorage
- Share weather information using the Web Share API
- Copy weather summaries to the clipboard when native sharing is unavailable
- Responsive design for mobile, tablet, and desktop
- Accessible keyboard navigation and ARIA labels
- Unit testing with Vitest and Vue Test Utils

---

## Technologies Used

- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia
- SCSS
- OpenWeather API
- Web Share API
- Clipboard API
- Browser localStorage
- Vitest
- Vue Test Utils
- ESLint

---

## Project Architecture

The application follows an Atomic Design-inspired component architecture. The project separates reusable UI components, application pages, state management, API communication, TypeScript types, utility functions, and tests.

```text
src/
│
├── components/
│   │
│   ├── atoms/
│   │   └── BaseInput.vue
│   │
│   ├── molecules/
│   │   ├── DailyForecastRow.vue
│   │   ├── HourlyForecastCard.vue
│   │   ├── SearchBar.vue
│   │   └── WeatherLocationCard.vue
│   │
│   └── organisms/
│       ├── DailyForecast.vue
│       ├── HourlyForecast.vue
│       ├── ProfileForm.vue
│       ├── SearchResultsList.vue
│       ├── WeatherHero.vue
│       └── WeatherLocationList.vue
│
├── pages/
│   ├── ProfilePage.vue
│   ├── WeatherDetailPage.vue
│   └── WeatherListPage.vue
│
├── router/
│   └── index.ts
│
├── services/
│   └── weather.service.ts
│
├── stores/
│   └── weather.store.ts
│
├── types/
│   ├── profile.ts
│   └── weather.ts
│
├── utils/
│   ├── weather.ts
│   └── __tests__/
│       └── ProfileForm.spec.ts
│       └── weather.spec.ts
│       └── WeatherLocationCard.spec.ts
│
└── App.vue
```

Test files are also included for components such as the profile form and weather location card.
---

## Atomic Design Structure

### Atoms:

Example:

- `BaseInput.vue` - provides a reusable input component used by other interface components.

### Molecules

Examples include:

- `SearchBar.vue` - handles location search input
- `WeatherLocationCard.vue` - displays weather information for a saved location
- `HourlyForecastCard.vue` - displays an individual forecast period
- `DailyForecastRow.vue` - displays an individual day in the weekly forecast

### Organisms

Organisms represent larger sections of the interface and may combine multiple molecules or other components.

Examples include:

- `WeatherLocationList.vue` - displays saved weather cards
- `SearchResultsList.vue` - displays location search results
- `WeatherHero.vue` - displays the main current-weather information
- `HourlyForecast.vue` - displays the 3-hour forecast section
- `DailyForecast.vue` - displays the weekly forecast section
- `ProfileForm.vue` - manages profile input and validation

### Pages

The main pages are:

- `WeatherListPage.vue` - main weather dashboard and location search
- `WeatherDetailPage.vue` - detailed weather and forecast information
- `ProfilePage.vue` - user profile management

---

## State Management

Pinia is used to manage shared weather application state.
The main weather store is located at: src/stores/weather.store.ts

The weather store manages:

- Search results
- Saved locations
- Current weather information
- Forecast data
- Loading states
- Error states
- Default location management

Using Pinia keeps shared application state separate from presentation components and provides a central location for weather-related application logic.
---

## Default Location

The application includes Bangsar South, Kuala Lumpur as the default weather location.

It is displayed on the home page as:

```text
My Location
Bangsar South
```

The default location uses predefined latitude and longitude coordinates rather than relying on browser geolocation.

This provides users with an initial weather card immediately while avoiding issues caused by unavailable or denied browser location permissions.

Other locations can still be searched for and added normally.
---

## API Integration

Weather information is retrieved using the OpenWeather API.
API communication is separated from the Vue components and handled through: src/services/weather.service.ts

The service is responsible for:

- Searching for locations
- Retrieving current weather
- Retrieving forecast information
- Checking that the API key is available
- Handling unsuccessful API responses

Keeping API communication in a dedicated service prevents networking logic from being duplicated throughout the Vue components.

---

## Weather Data Flow

Weather information moves through the application using the following general flow:
User Interface
↓
Vue Component
↓
Pinia Weather Store
↓
Weather Service
↓
OpenWeather API
↓
JSON Response
↓
Pinia Store
↓
Vue Components
↓
Updated User Interface

For example, when a user selects a location, its latitude and longitude are used to retrieve current weather and forecast information from OpenWeather.
---

## Dynamic Weather Backgrounds

The application changes weather backgrounds according to OpenWeather weather icon codes.
Background categories include:

- Clear
- Cloudy
- Rain
- Storm
- Snow
- Mist
- Night

OpenWeather icon codes ending in `n` indicate nighttime conditions.
For example:
01d → Clear daytime background
01n → Night background
10d → Rain background
10n → Night background

The background logic is contained in: src/utils/weather.ts
This allows the same logic to be reused by multiple components, including weather location cards and the detailed weather display.

---

## Local Storage

Browser `localStorage` is used to persist user information between sessions.
The application stores:

- Saved weather locations
- User profile information
- Uploaded profile picture

Weather measurements such as temperature are not permanently stored.

Instead, the application stores the coordinates of saved locations and uses them to retrieve updated weather information from OpenWeather when required.

This means saved locations remain available after the browser is refreshed or reopened.

---

## Advanced Browser Features

The application uses browser APIs to provide additional functionality beyond basic weather display.

### Web Share API

The Weather Detail page uses the Web Share API to allow users to share current weather information.

When supported by the user's browser or device, selecting the share button opens the native sharing interface.

A weather summary can contain information such as: Weather in Milan: 25°C, clear sky.

Before using native sharing, the application checks whether: navigator.share is available.
This is necessary because Web Share API support varies between browsers, devices, and operating systems.

### Copy to Clipboard

The application also implements a copy-to-clipboard feature using the browser Clipboard API.
This acts as a fallback when the Web Share API is unavailable.
If native sharing is not supported, the application uses: navigator.clipboard.writeText()
to copy the generated weather summary to the user's clipboard.

The user receives confirmation that the weather information has been copied and can then paste it into another application, such as:

- Messaging applications
- Email
- Documents
- Notes
- Social platforms

This provides progressive enhancement: devices that support native sharing receive the full Web Share experience, while unsupported browsers can still share the information using the clipboard.
---

## User Profile

The application includes a profile page where users can manage personal profile information.

Users can:

- View their current profile
- Edit their full name
- Edit their email address
- Edit their phone number
- Upload a profile picture
- Save profile changes

Profile information is stored in browser localStorage so that it remains available between sessions.

---

## Profile Picture Upload

Users can select a custom profile picture from their device.
The upload functionality:

- Accepts image files
- Supports PNG, JPEG, and WebP
- Rejects non-image files
- Limits image size to 2 MB
- Displays the selected image as the profile avatar
- Stores the image locally with the user's profile information

The uploaded profile picture is processed using the browser `FileReader` API.
---

## Form Validation

The profile form validates user input before saving changes.
Validation includes:

- Full name is required
- Full name must contain at least 2 characters
- Email is required
- Email must use a valid format
- Phone number is required
- Phone number must contain exactly 11 digits

Invalid information displays an appropriate error message and prevents the profile from being saved until the input is corrected.

---

## Routing

Vue Router is used to navigate between application pages.
The main routes are:
/ → Weather List Page
/weather/:lat/:lon → Weather Detail Page
/profile → Profile Page

The weather detail route uses dynamic latitude and longitude parameters.
For example: /weather/45.4642/9.19
These coordinates allow the Weather Detail page to determine which location's weather information should be retrieved.

---

## Type Checking

TypeScript is used throughout the application to improve type safety.
Run TypeScript type checking with:

```sh
npm run type-check
```

This helps identify problems such as incorrect property types, invalid component props, and incompatible data structures.
---

## Linting

ESLint is used to help maintain consistent code quality.
Run ESLint with:

```sh
npm run lint
```

---

## Unit Testing

Unit and component tests are implemented using Vitest and Vue Test Utils.
Tests currently cover:

- Weather utility functions
- Weather icon URL generation
- Weather background selection
- Day and night background detection
- Unknown weather icon fallback behaviour
- Profile information rendering
- Profile form validation
- Invalid email handling
- Invalid phone number handling
- Profile save events
- Weather location card rendering
- Weather location navigation
- Weather icon rendering
  Run the tests with:

```sh
npm run test:unit
```

---

## Run Code

Web application can be run with the following code: npm run dev
---

## Error Handling

The application handles common failure scenarios such as:

- Empty location searches
- Locations that cannot be found
- Failed API requests
- Missing OpenWeather API key
- Unsupported Web Share API
- Invalid profile information
- Invalid route coordinates
- Invalid profile image files
- Profile images that exceed the allowed file size

Loading and error states are displayed where appropriate so that failures do not prevent the rest of the application from functioning.

---

## Testing and Quality Checks

Before creating a final production build, the following commands can be run:

```sh
npm run test:unit
npm run type-check
npm run lint
npm run build
```

These commands check:

1. Unit and component tests
2. TypeScript correctness
3. Code quality
4. Production compilation

Running these checks before committing or submitting the project helps ensure that the application remains stable.

---

## Author

Developed as a Vue 3 and TypeScript weather application project.
