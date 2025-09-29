# Prize List - Stamp Collection Rewards

A modern, interactive web application for managing and displaying prizes that can be earned through stamp collection. Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion for smooth animations.

## 🌟 Features

### Main Prize Display Page
- **Beautiful modern UI** with purple gradient background and smooth animations
- **Prize cards** displaying images, descriptions, and required stamps
- **Click-to-redeem functionality** - tap any prize to toggle between available and redeemed states
- **Visual feedback** - redeemed prizes automatically become black & white (grayscale)
- **Smart filtering** with three categories:
  - **All Prizes** - Shows all prizes regardless of status
  - **Available** - Shows only unredeemed prizes
  - **Redeemed** - Shows only claimed prizes
- **Responsive design** that works on all devices

### Admin Management Panel
- **Add new prizes** with form validation
- **Edit existing prizes** with pre-populated data
- **Delete prizes** with confirmation dialog
- **Image upload** with drag & drop support and preview
- **Real-time updates** - changes immediately reflect on the main page

### Technical Features
- **Vercel KV storage** - reliable Redis-based key-value storage for production with file-based fallback for development
- **RESTful API** endpoints for all CRUD operations
- **TypeScript** for type safety and better development experience
- **Smooth animations** powered by Framer Motion
- **Modern responsive design** with Tailwind CSS
- **Vercel-ready** with optimized build configuration

## 🚀 Live Demo

The app is designed to be deployed on Vercel for free hosting. The beautiful purple gradient design with smooth animations provides an excellent user experience.

## 📱 Screenshots

### Main Page - Empty State
![Main Page Empty](https://github.com/user-attachments/assets/5385a935-fc10-403b-b5e9-948602fd99f4)

### Admin Panel - Empty State
![Admin Panel Empty](https://github.com/user-attachments/assets/c49329d3-c56c-4d06-86fe-154d4aea8d07)

### Admin Panel - With Prize
![Admin Panel With Prize](https://github.com/user-attachments/assets/82d15f0b-e4ac-4e60-96c3-6eadeb7dbac3)

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Storage**: Vercel KV (Redis) with file-based fallback for development
- **Deployment**: Vercel-optimized

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/chengmatt416/Prize-list.git
cd Prize-list
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Environment Setup

The application uses Vercel KV for production storage and falls back to file-based storage for local development.

#### Local Development
No environment variables are required for local development. The app will automatically use file-based storage in the `data/` directory.

#### Production Deployment on Vercel
1. Create a new KV database in your Vercel dashboard
2. The environment variables (`KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`) will be automatically set
3. Deploy your application - it will automatically use the KV storage

You can copy `.env.example` to `.env.local` if you want to test with KV storage locally.

### Building for Production

```bash
npm run build
npm start
```

## 🌐 Deployment on Vercel

This app is optimized for Vercel deployment with Vercel KV storage:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Create a new KV database in your Vercel dashboard
4. Deploy with zero configuration needed

The KV environment variables will be automatically configured by Vercel when you add a KV store to your project.

### Storage Architecture

- **Production**: Uses Vercel KV (Redis-based) for reliable, scalable storage
- **Development**: Falls back to local file-based storage for easy development
- **Automatic Detection**: The app automatically detects the environment and uses the appropriate storage method

## 📊 API Endpoints

### Prizes
- `GET /api/prizes` - Get all prizes
- `POST /api/prizes` - Create a new prize
- `GET /api/prizes/[id]` - Get a specific prize
- `PATCH /api/prizes/[id]` - Update a prize (including redeem/restore)
- `DELETE /api/prizes/[id]` - Delete a prize

### Prize Data Structure
```typescript
interface Prize {
  id: string;
  name: string;
  description: string;
  image: string; // base64 encoded image or URL
  requiredStamps: number;
  isRedeemed: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## 🎨 Key Interactions

1. **Main Page**: 
   - Click on any prize card to toggle between available (colored) and redeemed (grayscale) states
   - Use filter tabs to view different categories of prizes
   - Click "Admin" to access management panel

2. **Admin Panel**:
   - Click "Add Prize" to create new prizes
   - Click edit icon (pencil) to modify existing prizes
   - Click delete icon (trash) to remove prizes
   - Drag & drop or click to upload prize images

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### File Structure
```
src/
├── app/                    # Next.js app router
│   ├── admin/             # Admin panel page
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utility functions and storage
└── types/                 # TypeScript type definitions
```

## 🔧 Customization

The app uses a purple gradient theme that can be easily customized by modifying the Tailwind classes in the components. The color scheme uses:
- Primary: Purple gradients (`from-purple-900 via-blue-900 to-indigo-900`)
- Accent: Purple (`purple-600`, `purple-700`)
- Success: Green (`green-500`, `green-600`)
- Warning: Yellow (`yellow-400`, `yellow-300`)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
