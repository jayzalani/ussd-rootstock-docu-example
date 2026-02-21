import express, { Request, Response } from 'express';
import { ethers } from 'ethers';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: false }));

// Provider & Signer (The Relayer)
const provider = new ethers.JsonRpcProvider(process.env.RSK_TESTNET_RPC);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);

const CONTRACT_ADDRESS = "0x636Cd39bE612d78019C534aA168B9c5969c0c966";
const ABI = [
    "function getBalance(address user) view returns (uint256)",
    "function transfer(address to, uint256 amount)",
    "function applyForLoan()"
];

const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

app.post('/ussd', async (req: Request, res: Response) => {
    const { text, phoneNumber } = req.body;
    let response = "";
    const input = text.split('*');

    if (text === "") {
        response = `CON Rootstock DeFi (${phoneNumber})
        1. My Balance
        2. Send Money (P2P)
        3. Request Micro-Loan`;
    } else if (input[0] === "1") {
        const bal = await contract.getBalance(wallet.address);
        response = `END Your Balance: ${ethers.formatEther(bal)} tRBTC`;
    } else if (input[0] === "2") {
        if (!input[1]) {
            response = "CON Enter Recipient Address:";
        } else if (!input[2]) {
            response = "CON Enter Amount:";
        } else {
            const tx = await contract.transfer(input[1], ethers.parseEther(input[2]));
            await tx.wait();
            response = `END Transfer Sent! Hash: ${tx.hash.substring(0, 10)}`;
        }
    } else if (input[0] === "3") {
        const tx = await contract.applyForLoan();
        await tx.wait();
        response = `END Loan of 0.01 tRBTC approved and deposited!`;
    }

    res.header('Content-Type', 'text/plain');
    res.send(response);
});

app.listen(3000, () => console.log("RSK-USSD Bridge running on port 3000"));