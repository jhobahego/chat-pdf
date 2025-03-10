# Chat PDF
A simple chat application that allows users to upload PDF files and ask questions about the content.

## Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/chat-pdf.git
   ```
2. Navigate to the project directory:
   ```bash
   cd chat-pdf
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Configuration
1. Create a `.env` file in the root directory:
   - Linux/Mac:
   ```bash
   touch .env
   ```
   - Windows:
   ```cmd
   type nul > .env
   ```
2. Add the following environment variables:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_CLOUDINARY_API_KEY=your_cloudinary_api_key_here
   VITE_CLOUDINARY_SECRET=your_cloudinary_secret_here
   ```

## Running the Project
Start the development server:
```bash
npm run dev
```

## Testing
Run the test suite:
```bash
npm test
```
