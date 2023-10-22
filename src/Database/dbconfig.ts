import { Database } from "@tableland/sdk";
import { Wallet, getDefaultProvider } from "ethers";

const privateKey = (process.env.PRIVATE_KEY).toString();
const wallet = new Wallet(privateKey);
const apiKey = process.env.API_KEY

// To avoid connecting to the browser wallet (locally, port 8545).
// For example: "https://polygon-mumbai.g.alchemy.com/v2/YOUR_ALCHEMY_KEY"
const provider = getDefaultProvider(`https://chaotic-serene-wildflower.matic-testnet.quiknode.pro/5b88c6414525faa5d7511e65179be420459fa103/`);
const signer = wallet.connect(provider);
// Connect to the database
// Default to grabbing a wallet connection in a browser
const db = new Database({ signer });

// This is the table's `prefix`--a custom table value prefixed as part of the table's name
const prefix = "status";
const { meta: create } = await db
  .prepare(`CREATE TABLE ${prefix} (address blob not null  primary key unique, amount blob not null, state text not null);`)
  .run();

// The table's `name` is in the format `{prefix}_{chainId}_{tableId}`
const tableName = create.txn?.name ?? ""; // e.g., my_table_31337_2

await create.txn?.wait();

// Insert a row into the table
const { meta: insert } = await db
  .prepare(`INSERT INTO ${tableName} (address, amount, state) VALUES (?, ?, ?);`)
  .bind("0xA3Fd6B8C0f48e651619f90087BeECb3b57787c39", 0.0002, "Transfer")
  .bind("0x1AbCdEfGhIjKlMnOpQrStUvWxYz1234567890", 0.001, "Withdraw")
  .run();

// Wait for transaction finality
await insert.txn?.wait();

const { results } = await db.prepare(`SELECT * FROM ${tableName};`).all();
console.log(results);