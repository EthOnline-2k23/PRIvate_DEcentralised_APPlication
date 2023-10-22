import { SismoConnectButton, SismoConnectResponse, SismoConnectVerifiedResult } from '@sismo-core/sismo-connect-react'
import { CONFIG, AUTHS, SIGNATURE_REQUEST, AuthType } from '../../sismo-connect-config'
import { useEffect, useState } from 'react'
import { useNetwork, useSwitchNetwork, useAccount, useBalance } from 'wagmi'
import { ethers } from 'ethers'
import { ABI } from '../../../abi'
import { State } from '@popperjs/core'
import { getFromLocalStorage } from 'utils/localStorage'
import { useWalletAuth } from '../../modules/wallet/hooks/useWalletAuth'
import { RelayTransactionResponse } from '@cometh/connect-sdk'
import { TransactionReceipt } from '@ethersproject/providers'
import { Database } from '@tableland/sdk'
import { Wallet, getDefaultProvider } from 'ethers'
import notiF from '../../../push_notification.mjs';

interface TransactionProps {
  transactionSuccess: boolean
  setTransactionSuccess: React.Dispatch<React.SetStateAction<boolean>>
}

export function SismoConnect() {
  const { address, isConnected, connector } = useAccount()
  const [sismoConnectVerifiedResult, setSismoConnectVerifiedResult] = useState<SismoConnectVerifiedResult>()
  const [sismoConnectResponse, setSismoConnectResponse] = useState<SismoConnectResponse>()
  const [pageState, setPageState] = useState<string>('init')
  const [error, setError] = useState<string>('')
  const [transactionSended, setTransactionSended] = useState<RelayTransactionResponse | null>(null)
  const [transactionResponse, setTransactionResponse] = useState<TransactionReceipt | null>(null)
  const [nftBalance, setNftBalance] = useState<number>(0)

  useEffect(() => {
    if (wallet) {
      ;(async () => {
        const balance = await counterContract!.counters(wallet.getAddress())
        setNftBalance(Number(balance))
      })()
    }
  }, [])
  const { wallet, counterContract } = useWalletAuth()
  async function sendTransaction() {
    setTransactionSended(null)
    setTransactionResponse(null)

    try {
      if (!wallet) throw new Error('No wallet instance')

      const tx: RelayTransactionResponse = await counterContract!.count()
      setTransactionSended(tx)

      const txResponse = await tx.wait()

      const balance = await counterContract!.counters(wallet.getAddress())
      setNftBalance(Number(balance))

      setTransactionResponse(txResponse)
    } catch (e) {
      console.log('Error:', e)
    }
  }

  return (
    <>
      <main className="main">
        {pageState == 'init' ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {Boolean(isConnected) ? (
              <SismoConnectButton
                config={CONFIG}
                // Auths = Data Source Ownership Requests. (e.g Wallets, Github, Twitter, Github)
                auths={[{ authType: AuthType.EVM_ACCOUNT, userId: `${address}` }]}
                // Claims = prove group membership of a Data Source in a specific Data Group.
                // (e.g ENS DAO Voter, Minter of specific NFT, etc.)
                // Data Groups = [{[dataSource1]: value1}, {[dataSource1]: value1}, .. {[dataSource]: value}]
                // Existing Data Groups and how to create one: https://factory.sismo.io/groups-explorer
                // Signature = user can sign a message embedded in their zk proof
                // signature={SIGNATURE_REQUEST}
                text="Continue With Sismo"
                // Triggered when received Sismo Connect response from user data vault
                // onResponse={async (response: SismoConnectResponse) => {
                //   setSismoConnectResponse(response);
                //   setPageState("verifying");
                //   const verifiedResult = await fetch("/api/verify", {
                //     method: "POST",
                //     body: JSON.stringify(response),
                //   });
                //   const data = await verifiedResult.json();
                //   if (verifiedResult.ok) {
                //     setSismoConnectVerifiedResult(data);
                //     setPageState("verified");
                //   } else {
                //     setPageState("error");
                //     setError(data);
                //   }
                // }}
                onResponseBytes={async (responseBytes: string) => {
                  const state = getFromLocalStorage('category')
                  const amount = getFromLocalStorage('amount')
                  const toaddress = getFromLocalStorage('address')

                  // my code begin from her
                  // declare let window:any
                  if (state == 'Withdraw') {
                    console.log('withdraw')
                    if (window?.ethereum) {
                      let amountInWei = ethers.utils.parseEther(amount)
                      const accounts = await window.ethereum.request({
                        method: 'eth_requestAccounts',
                      })
                      console.log('Using account: ', accounts[0])
                      const provider = new ethers.providers.Web3Provider(window.ethereum)
                      console.log('provider:', provider)
                      const { chainId } = await provider.getNetwork()
                      console.log('chainId:', chainId)
                      if (chainId !== 80001) {
                        // switch to the mumbai testnet
                        await window.ethereum.request({
                          method: 'wallet_switchEthereumChain',
                          params: [{ chainId: '0x80001' }],
                        })
                      }
                      console.log('chainId:', chainId)
                      const signer = provider.getSigner(accounts[0])
                      console.log(signer)
                      const mastercontract = new ethers.Contract(
                        '0x99Fd39C456C8BF40b954f0c7AA72Df42FBE54705',
                        ABI,
                        provider
                      )
                      console.log('responseBytes in withdraw', responseBytes)
                      console.log('amount in withdraw', amount)
                      await mastercontract
                        .connect(signer)
                        .withdraw(amountInWei.toString(), responseBytes)
                        .then(function (tx) {
                          
                          console.log('withdraw called')
                          console.log(tx)
                        })
                      mastercontract.on('Withdrawal', (withdrawer, amount, event) => {
                        // Handle the event data here
                        const message = `${amount.toString()} is successfully withdrawn`;
                        notiF(message)
                        .catch((e) => console.error(e));
                        console.log('Withdrawal event received:')
                        console.log('Withdrawer:', withdrawer)
                        console.log('Amount:', amount.toString())
                      })
                    } else {
                      console.warn('Please use web3 enabled browser')
                    }
                  } else if (state == 'Transfer') {
                    console.log('transfer')
                    if (window?.ethereum) {
                      let amountInWei = ethers.utils.parseEther(amount)
                      const accounts = await window.ethereum.request({
                        method: 'eth_requestAccounts',
                      })
                      console.log('Using account: ', accounts[0])
                      const provider = new ethers.providers.Web3Provider(window.ethereum)
                      console.log('provider:', provider)
                      const { chainId } = await provider.getNetwork()
                      console.log('chainId:', chainId)
                      if (chainId !== 80001) {
                        // switch to the mumbai testnet
                        await window.ethereum.request({
                          method: 'wallet_switchEthereumChain',
                          params: [{ chainId: '0x80001' }],
                        })
                      }
                      console.log('chainId:', chainId)
                      const signer = provider.getSigner(accounts[0])
                      console.log(signer)
                      const mastercontract = new ethers.Contract(
                        '0x99Fd39C456C8BF40b954f0c7AA72Df42FBE54705',
                        ABI,
                        provider
                      )
                      console.log('responseBytes in transfer', responseBytes)
                      console.log('amount in transfer', amount)
                      console.log('toaddress in transfer', toaddress)
                      await mastercontract
                        .connect(signer)
                        .privateTransfer(amountInWei.toString(), toaddress, responseBytes)
                        .then(function (tx) {
                          console.log('privateTransfer called')
                          console.log(tx)
                          sendTransaction()
                        })
                      mastercontract.on('Transfer', (sender, recipient, amount, event) => {
                        const message = `${amount.toString()} is successfully transerfered!`;
                          notiF(message)
                          .catch((e) => console.error(e));
                        // Handle the event data here
                        console.log('Transfer event received:')
                        console.log('Sender:', sender)
                        console.log('Recipient:', recipient)
                        console.log('Amount:', amount.toString())
                      })
                    } else {
                      console.warn('Please use web3 enabled browser')
                    }
                  } else if (state == 'Balance') {
                    console.log('balance')
                    if (window?.ethereum) {
                      const accounts = await window.ethereum.request({
                        method: 'eth_requestAccounts',
                      })
                      console.log('Using account: ', accounts[0])
                      const provider = new ethers.providers.Web3Provider(window.ethereum)
                      console.log('provider:', provider)
                      const { chainId } = await provider.getNetwork()
                      console.log('chainId:', chainId)
                      if (chainId !== 80001) {
                        // switch to the mumbai testnet
                        await window.ethereum.request({
                          method: 'wallet_switchEthereumChain',
                          params: [{ chainId: '0x80001' }],
                        })
                      }
                      console.log('chainId:', chainId)
                      const signer = provider.getSigner(accounts[0])
                      console.log(signer)
                      const mastercontract = new ethers.Contract(
                        '0x99Fd39C456C8BF40b954f0c7AA72Df42FBE54705',
                        ABI,
                        provider
                      )
                      console.log('responseBytes in balance', responseBytes)
                      await mastercontract
                        .connect(signer)
                        .getBalance(responseBytes)
                        .then(function (tx) {
                          
                          console.log('getBalance called')
                          console.log(tx)
                        })
                      mastercontract.on('Balance', balance => {
                        const message = `${(balance / 1e18).toString()} is successfully withdrawn`;
                        notiF(message)
                        .catch((e) => console.error(e));
                        console.log('Value of balances[evmAccountIds[0]]/1e18: ', balance.toString())
                        var res = document.getElementById('result')
                        res.innerText = 'Value of balance: ' + (balance / 1e18).toString()
                      })
                    } else {
                      console.warn('Please use web3 enabled browser')
                    }
                  }
                }}
              />
            ) : (
              <SismoConnectButton
                disabled
                config={CONFIG}
                // Auths = Data Source Ownership Requests. (e.g Wallets, Github, Twitter, Github)
                auths={[{ authType: AuthType.EVM_ACCOUNT, userId: `${address}` }]}
                // Claims = prove group membership of a Data Source in a specific Data Group.
                // (e.g ENS DAO Voter, Minter of specific NFT, etc.)
                // Data Groups = [{[dataSource1]: value1}, {[dataSource1]: value1}, .. {[dataSource]: value}]
                // Existing Data Groups and how to create one: https://factory.sismo.io/groups-explorer
                // Signature = user can sign a message embedded in their zk proof
                signature={SIGNATURE_REQUEST}
                text="Verify With Sismo"
                // Triggered when received Sismo Connect response from user data vault
                // onResponse={async (response: SismoConnectResponse) => {
                //   setSismoConnectResponse(response);
                //   setPageState("verifying");
                //   const verifiedResult = await fetch("/api/verify", {
                //     method: "POST",
                //     body: JSON.stringify(response),
                //   });
                //   const data = await verifiedResult.json();
                //   if (verifiedResult.ok) {
                //     setSismoConnectVerifiedResult(data);
                //     setPageState("verified");
                //   } else {
                //     setPageState("error");
                //     setError(data);
                //   }
                // }}
                onResponseBytes={async (bytes: string) => {
                  console.log(bytes)
                }}
              />
            )}
          </div>
        ) : (
          <>
            <button
              onClick={() => {
                window.location.href = '/'
              }}
            >
              {' '}
              RESET{' '}
            </button>
            <br></br>
            <div className="status-wrapper">
              {pageState == 'verifying' ? (
                <span className="verifying"> Verifying ZK Proofs... </span>
              ) : (
                <>
                  {Boolean(error) ? (
                    <span className="error"> Error verifying ZK Proofs: {error} </span>
                  ) : (
                    <span className="verified"> ZK Proofs verified!</span>
                  )}
                </>
              )}
            </div>
          </>
        )}

        {/* Table for Verified Auths */}
        {sismoConnectVerifiedResult && (
          <>
            <h3>Verified Auths</h3>
            <table>
              <thead>
                <tr>
                  <th>AuthType</th>
                  <th>Verified UserId</th>
                </tr>
              </thead>
              <tbody>
                {sismoConnectVerifiedResult.auths.map((auth, index) => (
                  <tr key={index}>
                    <td>{AuthType[auth.authType]}</td>
                    <td>{auth.userId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <br />

        <br />
      </main>
    </>
  )
}
