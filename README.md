# Decentralized Learning Platform (BlockMarket)

A blockchain-based decentralized learning platform that connects learners with educators in a secure, transparent, and efficient manner.

## 🚀 Features

### For Learners
- Browse and search for courses and educators
- Enroll in courses
- Attend live sessions
- Earn and manage certificates
- Rate and review educators
- Manage wallet and payments

### For Educators/Providers
- Create and manage courses
- Conduct live sessions
- Manage student enrollments
- Track earnings and analytics
- Handle disputes (admin)
- View ratings and feedback

### For Administrators
- Manage users and roles
- Handle disputes
- Review and approve educator applications
- Generate reports
- Monitor platform analytics

## 🛠 Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Web3.js / Ethers.js
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- WebSockets (for real-time features)

### Blockchain
- Solidity (Smart Contracts)
- Hardhat (Development Environment)
- IPFS (for decentralized file storage)
- MetaMask (Wallet Integration)

## 📦 Installation

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- MetaMask browser extension
- Hardhat (for local development)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Tusharsingh7705/Decentralized-Learning.git
   cd Decentralized-Learning/BlockMarket
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   - Create a `.env` file in the backend directory with:
     ```
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     PORT=5000
     ```
   - Create a `.env` file in the frontend directory with:
     ```
     VITE_API_URL=http://localhost:5000
     VITE_CONTRACT_ADDRESS=your_smart_contract_address
     ```

4. **Run the development servers**
   ```bash
   # Start backend server
   cd backend
   npm run dev
   
   # In a new terminal, start frontend
   cd frontend
   npm run dev
   ```

## 🔗 Smart Contracts

### Key Contracts
1. **LearningToken.sol** - ERC20 token for platform transactions
2. **CourseMarketplace.sol** - Manages course creation, enrollment, and payments
3. **CertificateNFT.sol** - ERC721 for issuing verifiable certificates

### Deployment
```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost

# Deploy to testnet/mainnet
npx hardhat run scripts/deploy.js --network <network_name>
```

## 📝 Project Structure

```
BlockMarket/
├── backend/               # Backend server
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── server.js         # Server entry point
│
├── contracts/            # Smart contracts
│   ├── CourseMarketplace.sol
│   ├── LearningToken.sol
│   └── CertificateNFT.sol
│
├── frontend/             # Frontend React application
│   ├── public/           # Static files
│   └── src/
│       ├── components/   # Reusable components
│       ├── pages/        # Page components
│       ├── context/      # React context
│       ├── services/     # API services
│       └── App.jsx       # Main App component
│
└── README.md             # This file
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create a new course
- `GET /api/courses/:id` - Get course details
- `PUT /api/courses/:id` - Update course

### Enrollments
- `POST /api/enroll` - Enroll in a course
- `GET /api/enrollments` - Get user enrollments
- `GET /api/enrollments/:id` - Get enrollment details

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenZeppelin](https://openzeppelin.com/) for secure smart contract templates
- [Web3.js](https://web3js.org/) for blockchain interactions
- [React](https://reactjs.org/) for the frontend framework
- [Vite](https://vitejs.dev/) for fast development experience

---

Made with ❤️ by [Your Name] | [Your Website]
