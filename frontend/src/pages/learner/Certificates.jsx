import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  CheckCircle,
  ExternalLink,
  Star,
  Medal,
  Trophy,
} from "lucide-react";
import axios from "axios";

const Certificates = () => {
  const [certificates, setCertificates] = useState([
    {
      id: 1,
      title: "Blockchain Fundamentals",
      description:
        "Successfully completed the Blockchain Fundamentals course with distinction, covering consensus mechanisms, cryptography, and distributed systems.",
      image:
        "https://img.freepik.com/free-vector/hand-drawn-blockchain-technology-background_23-2149157862.jpg",
      providerName: "Crypto Academy",
      tokenId: "BCF2023001",
      txHash: "0x123...456",
      ipfsLink: "https://ipfs.io/ipfs/QmXx...",
      issueDate: "2023-01-15",
    },
    {
      id: 2,
      title: "Smart Contract Development",
      description:
        "Mastered Solidity and smart contract deployment on Ethereum, including testing and security best practices.",
      image:
        "https://img.freepik.com/free-vector/smart-contract-concept-illustration_114360-1104.jpg",
      providerName: "Ethereum Foundation",
      tokenId: "SCD2023002",
      txHash: "0x789...012",
      ipfsLink: "https://ipfs.io/ipfs/QmYy...",
      issueDate: "2023-02-20",
    },
    {
      id: 3,
      title: "DeFi Mastery Program",
      description:
        "Completed advanced DeFi protocols including AMMs, lending platforms, and yield farming strategies.",
      image:
        "https://img.freepik.com/free-vector/decentralized-finance-concept-illustration_114360-1233.jpg",
      providerName: "DeFi University",
      tokenId: "DEFI2023003",
      txHash: "0x345...678",
      ipfsLink: "https://ipfs.io/ipfs/QmZz...",
      issueDate: "2023-03-10",
    },
    {
      id: 4,
      title: "NFT Development Pro",
      description:
        "Learned to create, mint, and trade NFTs on various blockchains with metadata standards.",
      image:
        "https://img.freepik.com/free-vector/nft-concept-illustration_114360-1229.jpg",
      providerName: "NFT Art Institute",
      tokenId: "NFTP2023004",
      txHash: "0x901...234",
      ipfsLink: "https://ipfs.io/ipfs/QmNn...",
      issueDate: "2023-04-05",
    },
    {
      id: 5,
      title: "Web3 Security Specialist",
      description:
        "Mastered smart contract security, auditing techniques, and vulnerability prevention in blockchain applications.",
      image:
        "https://img.freepik.com/free-vector/cyber-security-concept-illustration_114360-1685.jpg",
      providerName: "Blockchain Security Labs",
      tokenId: "W3S2023005",
      txHash: "0x567...890",
      ipfsLink: "https://ipfs.io/ipfs/QmQq...",
      issueDate: "2023-05-12",
    },
    {
      id: 6,
      title: "DAOs & Governance",
      description:
        "Learned to design and participate in Decentralized Autonomous Organizations and on-chain governance models.",
      image:
        "https://img.freepik.com/free-vector/teamwork-community-concept-illustration_114360-1484.jpg",
      providerName: "Web3 Collective",
      tokenId: "DAOG2023006",
      txHash: "0x234...567",
      ipfsLink: "https://ipfs.io/ipfs/QmRr...",
      issueDate: "2023-06-18",
    },
    {
      id: 7,
      title: "Layer 2 Solutions",
      description:
        "Mastered scaling solutions including rollups, sidechains, and state channels for Ethereum and other blockchains.",
      image:
        "https://img.freepik.com/free-vector/blockchain-layers-concept-illustration_114360-1537.jpg",
      providerName: "Scaling Labs",
      tokenId: "L2S2023007",
      txHash: "0x890...123",
      ipfsLink: "https://ipfs.io/ipfs/QmSs...",
      issueDate: "2023-07-22",
    },
    {
      id: 8,
      title: "Zero-Knowledge Proofs",
      description:
        "Learned zk-SNARKs, zk-STARKs, and practical implementations of zero-knowledge cryptography.",
      image:
        "https://img.freepik.com/free-vector/cyber-security-concept-illustration_114360-1632.jpg",
      providerName: "ZK Research Lab",
      tokenId: "ZKP2023008",
      txHash: "0x456...789",
      ipfsLink: "https://ipfs.io/ipfs/QmTt...",
      issueDate: "2023-08-30",
    }
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/mockCertificates.json");
        setCertificates(res.data || certificates);
      } catch {
        setCertificates(certificates);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-indigo-950 to-gray-900 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-center text-white mb-3"
        >
          🏆 Your Certificates & Achievements
        </motion.h1>

        <p className="text-center text-gray-300 mb-12">
          Blockchain-verified NFT certificates earned from your learning journey.
        </p>

        {loading && (
          <div className="text-center text-gray-300 text-lg">
            Loading certificates...
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {certificates.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              whileHover={{
                scale: 1.05,
                y: -8,
                boxShadow: "0px 30px 80px rgba(99,102,241,0.35)",
              }}
              className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 rounded-3xl p-[2px]"
            >
              <div className="bg-gray-900 rounded-3xl p-6 h-full">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Award className="text-indigo-400" />
                    <h3 className="text-lg font-semibold text-white">
                      {cert.title}
                    </h3>
                  </div>
                  <span className="text-xs bg-indigo-600/20 text-indigo-300 px-3 py-1 rounded-full">
                    #{cert.tokenId}
                  </span>
                </div>

                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-40 object-cover rounded-xl mb-4"
                />

                <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                  {cert.description}
                </p>

                <p className="text-sm text-gray-400 mb-4">
                  Issued by <b className="text-gray-200">{cert.providerName}</b>
                </p>

                <div className="flex justify-between text-xs text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <CheckCircle size={12} className="text-emerald-400" />
                    Verified on-chain
                  </div>
                  <a
                    href={`https://mumbai.polygonscan.com/tx/${cert.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-indigo-400 hover:underline"
                  >
                    <ExternalLink size={12} />
                    TX
                  </a>
                </div>

                <div className="flex justify-between items-center">
                  <a
                    href={cert.ipfsLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 text-sm hover:underline"
                  >
                    View on IPFS
                  </a>
                  <span className="text-xs text-gray-500">
                    {new Date(cert.issueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 rounded-3xl p-10 shadow-2xl"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-10 flex justify-center gap-2">
            <Medal className="text-yellow-400" />
            Achievements Unlocked
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Trophy, title: "Consistent Learner", color: "text-indigo-400" },
              { icon: Star, title: "Top Rated Feedback", color: "text-yellow-400" },
              { icon: Award, title: "Blockchain Pioneer", color: "text-emerald-400" },
              { icon: Award, title: "DeFi Expert", color: "text-purple-400" },
              { icon: Star, title: "Security Specialist", color: "text-red-400" },
              { icon: Trophy, title: "DAO Contributor", color: "text-blue-400" },
              { icon: Award, title: "Scaling Solutions Pro", color: "text-pink-400" },
              { icon: Star, title: "Privacy Champion", color: "text-green-400" },
            ].map((a, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.08, y: -6 }}
                className="bg-gray-900 rounded-2xl p-6 text-center shadow-xl"
              >
                <a.icon className={`mx-auto mb-4 ${a.color}`} size={42} />
                <h3 className="text-white font-semibold">{a.title}</h3>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Certificates;
