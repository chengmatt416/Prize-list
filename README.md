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
- **File-based storage** - prizes are saved to local JSON file
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
- **Storage**: File-based JSON storage
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

### Building for Production

```bash
npm run build
npm start
```

## 🌐 Deployment on Vercel

This app is optimized for Vercel deployment:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration needed

The `vercel.json` file is already configured with optimal settings.

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
