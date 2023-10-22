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

interface TransactionProps {
  transactionSuccess: boolean
  setTransactionSuccess: React.Dispatch<React.SetStateAction<boolean>>
}

export function SismoConnect({ transactionSuccess, setTransactionSuccess }: TransactionProps) {
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
                auths={[{ authType: AuthType.EVM_ACCOUNT, userId: `${address}` }]}
                signature={SIGNATURE_REQUEST}
                text="Continue With Sismo"
                onResponseBytes={async (responseBytes: string) => {
                  const state = getFromLocalStorage('category')
                  const amount = getFromLocalStorage('amount')
                  const toaddress = getFromLocalStorage('address')
                  if (state == 'Withdraw') {
                    console.log('withdraw')
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
                        await window.ethereum.request({
                          method: 'wallet_switchEthereumChain',
                          params: [{ chainId: '0x80001' }],
                        })
                      }
                      console.log('chainId:', chainId)
                      const signer = provider.getSigner(accounts[0])
                      console.log(signer)
                      const mastercontract = new ethers.Contract(
                        '0xF1874Bf95AD065038C841593F155bE255495B961',
                        ABI,
                        provider
                      )
                      console.log(responseBytes)
                      await mastercontract
                        .connect(signer)
                        .withdraw(amount, ethers.utils.toUtf8Bytes(responseBytes))
                        .then(function (tx) {
                          console.log('withdraw called')
                          console.log(tx)
                        })
                    } else {
                      console.warn('Please use web3 enabled browser')
                    }
                  } else if (state == 'Transfer') {
                    console.log('transfer')
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
                        await window.ethereum.request({
                          method: 'wallet_switchEthereumChain',
                          params: [{ chainId: '0x80001' }],
                        })
                      }
                      console.log('chainId:', chainId)
                      const signer = provider.getSigner(accounts[0])
                      console.log(signer)
                      const mastercontract = new ethers.Contract(
                        '0xF1874Bf95AD065038C841593F155bE255495B961',
                        ABI,
                        provider
                      )

                      await mastercontract
                        .connect(signer)
                        .privateTransfer(amount, toaddress, responseBytes)
                        .then(function (tx) {
                          console.log('privateTransfer called')
                          console.log(tx)
                          sendTransaction()
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
                        '0xF1874Bf95AD065038C841593F155bE255495B961',
                        ABI,
                        provider
                      )

                      await mastercontract
                        .connect(signer)
                        .getBalance(responseBytes)
                        .then(function (tx) {
                          console.log('getBalance called')
                          console.log(tx)
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
                auths={[{ authType: AuthType.EVM_ACCOUNT, userId: `${address}` }]}
                signature={SIGNATURE_REQUEST}
                text="Verify With Sismo"
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
