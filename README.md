# UPN to EPC QR Converter

A web application that converts Slovenian UPN (Universal Payment Order) QR codes into European EPC (European Payments Council) QR codes, enabling payment through modern European banking apps like Revolut, N26, and others that don't natively support the UPN format.

🌐 **Live App:** [https://fklezin.github.io/qr.upn/](https://fklezin.github.io/qr.upn/)

## Features

- **Scan QR codes** using your device's camera with flashlight support
- **Upload images** with QR codes and crop them for better recognition
- **Instant conversion** from UPN to EPC format
- **Multi-language support** (English and Slovenian)
- **Mobile-friendly** interface optimized for smartphones
- **Share converted QR codes** with a simple URL

## Why This Tool?

Slovenian bills use the local UPN QR format, while modern European neobanks only support the international EPC standard. This tool bridges the gap, allowing you to pay Slovenian bills fee-free using apps like Revolut and N26.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deploy to GitHub Pages

The project is already configured for GitHub Pages deployment:

```bash
npm run deploy
```

Then enable GitHub Pages in your repository settings (Settings → Pages → Source: `gh-pages` branch).

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- jsQR for QR code scanning
- qrcode for QR code generation

## Built With

This project was vibecoded using [Google AI Studio](https://aistudio.google.com/) and [Cursor](https://cursor.sh/).

## License

MIT
