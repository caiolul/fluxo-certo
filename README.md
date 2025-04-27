# Fluxo Certo - Expense Tracker

A modern expense tracking app built with Next.js, TypeScript, and Prisma.

## 🚀 Tech Stack

- [Next.js](https://nextjs.org/) - React framework for web development
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with superpowers (static typing)
- [Prisma](https://www.prisma.io/) - Modern ORM for Node.js and TypeScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Accessible UI components
- [React Hook Form](https://react-hook-form.com/) - Form management made easy
- [Zod](https://zod.dev/) - TypeScript schema validation
- [Recharts](https://recharts.org/) - React charting library

## 📋 What You'll Need

- Node.js (version 18 or higher)
- Docker (optional, for containerized development)
- PostgreSQL (if you're not using Docker)

## 🛠️ Getting Started

1. Clone the repo:
```bash
git clone [REPO_URL]
cd fluxo_certo
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/fluxo_certo"
```

4. Run Prisma migrations:
```bash
npm run prisma:generate
npm run prisma:push
```

## 🚀 Running the Project

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Using Docker
```bash
docker-compose up
```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm start` - Start production server
- `npm run lint` - Run linter
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:push` - Sync database with schema

## 🏗️ Project Structure

```
fluxo_certo/
├── app/              # Pages and routes
├── components/       # Reusable React components
├── lib/             # Utilities and configs
├── prisma/          # Database schema and migrations
├── public/          # Static files
└── ...
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is under the MIT License. Check out the [LICENSE](LICENSE) file for more details. 