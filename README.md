# CrowdFund

A Solidity/Next.JS app bult for startups to raise and spend funds in a transparent manner.

## Screen Capture

<img src="https://github.com/JawadHossain/CrowdFund/blob/main/public/CrowdFund.gif" width="800" height="379"/>

## Usage

Create and place a `.env` file in the root directory with the follwing contents for example:

```
MNEMONIC=Your 12 Word Test Wallet Seed Phrase
PROVIDER=https://rinkeby.infura.io/v3/4ebe404c764c4fffb98bfbae43d6c9ee
```

Run `npm run deplyContract` to deploy the Ethereum contract.\
Find the deployed contract address from the console and update line 6 in `ethereum/factory.js` with it.
Run `npm run dev` to interact with your deployed contract.
