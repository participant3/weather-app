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
- View upcoming hourly forecasts
- View weekly forecasts
- Refresh weather data
- Dynamic weather icons and backgrounds
- Navigate between weather locations and detail pages
- Edit and save user profile information
- Upload a profile picture
- Form validation for profile information
- Persistent data using browser localStorage
- Share weather information using the Web Share API
- Clipboard fallback when Web Share is unavailable
- Responsive design for mobile, tablet, and desktop
- Accessible keyboard navigation and ARIA labels
- Unit testing with Vitest

---

## Technologies Used

- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia
- SCSS
- OpenWeather API
- Vitest
- Vue Test Utils
- ESLint

---

## Project Architecture

The application follows an Atomic Design-inspired component architecture.

```text
src/
├── components/
│   ├── atoms/
│   ├── molecules/
│   └── organisms/
├── pages/
├── router/
├── services/
├── stores/
├── types/
├── utils/
└── assets/
```

### Atoms

Atoms are small, reusable UI elements such as basic inputs, buttons, or icons.

### Molecules

Molecules combine smaller elements into reusable interface components.

Examples include:

- Search bar
- Weather location card
- Hourly forecast card
- Daily forecast row

### Organisms

Organisms represent larger sections of the interface and often combine multiple molecules.

Examples include:

- Weather location list
- Search results list
- Weather hero
- Hourly forecast
- Weekly forecast
- Profile form

### Pages

Pages combine the components required to create a complete application screen.

The main pages are:

- Weather List Page
- Weather Detail Page
- Profile Page

---

## State Management

Pinia is used to manage shared weather application state.

The weather store handles functionality such as:

- Search results
- Saved locations
- Current weather
- Forecast data
- Loading states
- Error states

This keeps shared application state separate from the presentation components.

---

## API Integration

Weather information is retrieved using the OpenWeather API.

API communication is separated from the Vue components and handled through:

```text
src/services/weather.service.ts
```

This service is responsible for requests such as:

- Searching for locations
- Retrieving current weather
- Retrieving forecast information

Keeping API communication in a service prevents networking logic from being duplicated throughout the components.

---

## Local Storage

Browser `localStorage` is used to persist user information between sessions.

The application stores:

- Saved weather locations
- User profile information
- Profile picture

Weather measurements such as temperature are not permanently stored. Instead, saved coordinates are used to retrieve updated weather information from OpenWeather when required.

---

## Web APIs

### Web Share API

The Weather Detail page uses the browser Web Share API to allow users to share the current weather information.

If the browser does not support native sharing, the application uses the Clipboard API as a fallback and copies the weather summary to the clipboard.

Because Web Share support varies between browsers and operating systems, feature detection is used before attempting native sharing.

---

## Form Validation

The profile form validates user input before saving changes.

Validation includes:

- Full name is required
- Valid email format
- Phone number must contain exactly 11 digits

Invalid information displays an error message and prevents the profile from being saved.

---

## Environment Variables

The OpenWeather API key is stored in an environment variable and is not committed to Git.

Create a `.env` file in the project root:

```text
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

An example configuration is provided in:

```text
.env.example
```

The `.env` file should remain excluded from version control.

---

## Project Setup

Install dependencies:

```sh
npm install
```

Create your `.env` file and add your OpenWeather API key.

Then start the development server:

```sh
npm run dev
```

The development server will display the local URL used to access the application.

---

## Type Checking

Run TypeScript type checking with:

```sh
npm run type-check
```

---

## Linting

Run ESLint with:

```sh
npm run lint
```

---

## Unit Tests

Unit tests are implemented using Vitest and Vue Test Utils.

Tests currently cover:

- Weather utility functions
- Weather icon URL generation
- Weather background selection
- Profile form validation
- Profile save events
- Weather location card rendering
- Weather location navigation

Run the tests with:

```sh
npm run test:unit
```

---

## Production Build

Create a production build with:

```sh
npm run build
```

The optimized production files will be generated in the `dist` directory.

---

## Accessibility

Accessibility considerations include:

- Semantic HTML
- Form labels
- ARIA labels for icon buttons
- Keyboard-accessible controls
- Visible focus states
- Alternative text for meaningful images
- Error messages for invalid form input

---

## Responsive Design

The application is designed to work across:

- Mobile devices
- Tablets
- Desktop screens

Layouts were tested at multiple viewport widths to ensure weather cards, forecasts, forms, navigation controls, and profile information remain usable.

---

## Error Handling

The application handles common failure scenarios such as:

- Invalid city searches
- Failed API requests
- Unsupported Web Share API
- Invalid profile information
- Invalid route coordinates

Loading and error states are displayed where appropriate so that failures do not prevent the rest of the application from functioning.

---

## Testing and Quality Checks

Before creating a production build, the following commands can be used:

```sh
npm run test:unit
npm run type-check
npm run lint
npm run build
```

These check unit tests, TypeScript correctness, code quality, and production compilation.

---

## Author

Developed as a Vue 3 weather application project.
