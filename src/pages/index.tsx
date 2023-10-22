import styles from 'styles/Home.module.scss'
import { ThemeToggleButton, ThemeToggleList } from 'components/Theme'
import { useState } from 'react'
import { useNetwork, useSwitchNetwork, useAccount, useBalance } from 'wagmi'
import ConnectWallet from 'components/Connect/ConnectWallet'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useConnectModal, useAccountModal, useChainModal } from '@rainbow-me/rainbowkit'
import { useSignMessage } from 'wagmi'
import { SismoConnect } from 'components/Connect/SismoConnect'
import { sign } from 'crypto'
import { Model } from 'components/Tabs/tabs'

export default function Home() {
  return (
    <div className={styles.container}>
      <Header />
      <Main />
      {/* <Footer /> */}
    </div>
  )
}
function Header() {
  return (
    <header className={styles.header}>
      <div>
        <ThemeToggleList />
      </div>
      <div className="flex items-center">
        <h1>PRIvate DEcentralised app</h1>
      </div>

      <div className="flex items-center">
        <ThemeToggleButton />
      </div>
    </header>
  )
}

function Main() {
  const { address, isConnected, connector } = useAccount()
  const { chain, chains } = useNetwork()
  const { isLoading: isNetworkLoading, pendingChainId, switchNetwork } = useSwitchNetwork()
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address: address,
  })
  const { openConnectModal } = useConnectModal()
  const { openAccountModal } = useAccountModal()
  const { openChainModal } = useChainModal()
  return (
    <main className={styles.main + ' space-y-6'}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          padding: '1 rem',
          justifyContent: 'space-evenlDAO Voter, Minter of specific NFT, etc.',
          // Data Grouy',
        }}
      >
        <ConnectWallet />
        <br></br>
        <Model />
      </div>
    </main>
  )
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        <ThemeToggleList />
      </div>
      <div className="flex items-center">
        <ThemeToggleButton /> footer <ThemeToggleList />
      </div>

      <div className="flex items-center">
        <ThemeToggleButton />
        <ThemeToggleList />
      </div>
    </footer>
  )
}
