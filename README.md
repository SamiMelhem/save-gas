# SaveGas - Find the Best Gas Prices Near You 🚗⛽

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-success.svg)](https://save-gas.vercel.app)
[![Built with Convex](https://img.shields.io/badge/Built%20with-Convex-blue.svg)](https://convex.dev)
[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB.svg)](https://reactjs.org)
[![Built with Tailwind CSS](https://img.shields.io/badge/Built%20with-Tailwind%20CSS-38B2AC.svg)](https://tailwindcss.com)

SaveGas is a modern web application that helps users find the most affordable gas prices in their area. With real-time price updates, interactive maps, and turn-by-turn directions, SaveGas makes it easy to save money on fuel.

🌐 **[Try it now: save-gas.vercel.app](https://save-gas.vercel.app)**

![SaveGas Screenshot](./src/assets/logo.svg)

## 🌟 Features

- **Real-time Price Updates**: Get the latest gas prices from stations in your area
- **Interactive Maps**: Visual representation of gas stations with price information
- **Smart Sorting**: Sort by price, distance, or rating to find the best option
- **Turn-by-turn Directions**: Get directions to your chosen gas station
- **Multiple Fuel Types**: Support for Regular, Midgrade, Premium, and Diesel
- **User Authentication**: Secure access with Auth0 integration
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Technologies

- **Frontend**: React with Vite, Tailwind CSS
- **Backend**: [Convex](https://convex.dev) for real-time data and state management
- **Authentication**: Auth0
- **Maps**: Google Maps API
- **State Management**: React Hooks
- **Styling**: Tailwind CSS with custom gradients

## 🛠️ Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Maps API key
- Auth0 account
- Convex account

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_AUTH0_DOMAIN=your_auth0_domain
VITE_AUTH0_CLIENT_ID=your_auth0_client_id
VITE_CONVEX_URL=your_convex_deployment_url
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/save-gas.git
cd save-gas
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📱 Usage

1. Sign in using your account
2. Allow location access when prompted
3. View gas prices in your area on the interactive map
4. Sort stations by price, distance, or rating
5. Select a station to view details and get directions
6. Refresh prices as needed (with cooldown timer)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Convex](https://convex.dev)
- Maps powered by Google Maps Platform
- Authentication by Auth0
- Icons and UI components from Tailwind CSS

## 📞 Support

If you have any questions or run into issues, please open an issue in the GitHub repository.
