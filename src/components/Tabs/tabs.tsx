import { useState } from 'react'
import { Tab } from '@headlessui/react'
import InputAdornment from '@mui/material/InputAdornment'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import FilledInput from '@mui/material/FilledInput'
import TextField from '@mui/material/TextField'
import { SismoConnect } from 'components/Connect/SismoConnect'
import * as React from 'react'
import Button from '@mui/material/Button'
import { ethers } from 'ethers'
import { ABI } from '../../../abi'
import { saveToLocalStorage } from 'utils/localStorage'
import notiF from '../../../push_notification.mjs';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const DepositButton = ({ amount }: { amount: string }) => {
  async function onClick() {
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
      const mastercontract = new ethers.Contract('0x99Fd39C456C8BF40b954f0c7AA72Df42FBE54705', ABI, provider)
      const amountToSend = ethers.utils.parseEther(amount) // Adjust the amount as needed
      const overrides = {
        value: amountToSend,
      }

      const transaction = await mastercontract.connect(signer).deposit(overrides)
      await transaction.wait()
      const message = `The balance is ${ethers.utils.formatEther(amountToSend)}`;
      notiF(message)
      .catch((e) => console.error(e));
      console.log('Deposit successful')
    } else {
      console.warn('Please use web3 enabled browser')
    }
  }

  return (
    <div
      style={{
        paddingBlockEnd: '2.5rem',
      }}
    >
      <Button
        variant="contained"
        size="large"
        onClick={onClick}
        style={{
          backgroundColor: 'rgb(28,40,71)',
          paddingLeft: '1rem',
          borderRadius: '0.5rem',
          textTransform: 'unset',
          fontSize: '1rem',
          fontWeight: '600',
        }}
      >
        Deposit
      </Button>
      <br></br>
    </div>
  )
}

export function Model() {
  const [address, setAddress] = useState('')
  const [amount, setAmount] = useState('')
  function onChangeAddress(e) {
    setAddress(e.target.value)
    saveToLocalStorage('address', e.target.value)
    console.log(address)
  }
  function onChangeAmount(event: React.ChangeEvent<HTMLInputElement>) {
    setAmount(event.target.value)
    saveToLocalStorage('amount', event.target.value)
    console.log(amount)
  }
  function SaveCategory(props) {
    if (props.category != 'Deposit') {
      console.log(props.category)
      saveToLocalStorage('category', props.category)
    }
    return <div></div>
  }

  let [categories] = useState({
    Deposit: {
      address: false,
      amount: false,
      sismo: false,
    },
    Withdraw: {
      address: false,
      amount: true,
      sismo: true,
    },
    Transfer: {
      address: true,
      amount: true,
      sismo: true,
    },
    Balance: {
      address: false,
      amount: false,
      sismo: true,
    },
  })

  return (
    <div className="min-w-full max-w-screen-lg px-2 py-16 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {Object.keys(categories).map(category => (
            <Tab
              key={category}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 px-2.5 text-sm font-medium leading-5 text-blue-700',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2 text-center">
          {Object.keys(categories).map((category, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                'rounded-xl bg-white p-3',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
              )}
            >
              {categories[category].address ? (
                <TextField
                  label="EVM Account Address"
                  id="filled-start-adornment"
                  sx={{ m: 1, width: '25ch' }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">0x</InputAdornment>,
                  }}
                  variant="filled"
                  onChange={onChangeAddress}
                />
              ) : (
                <br></br>
              )}
              {categories[category].amount ? (
                <FormControl sx={{ m: 1, width: '25ch' }} variant="filled">
                  <FilledInput
                    id="filled-adornment-weight"
                    endAdornment={<InputAdornment position="end">ETH</InputAdornment>}
                    aria-describedby="filled-weight-helper-text"
                    inputProps={{}}
                    onChange={onChangeAmount}
                    name="amount"
                    value={amount}
                  />
                  <FormHelperText id="filled-weight-helper-text">Amount</FormHelperText>
                </FormControl>
              ) : (
                <br></br>
              )}
              <SaveCategory category={Object.keys(categories)[idx]} />
              <div id="result" style={{ color: 'black' }}></div>
              {categories[category].sismo ? <SismoConnect /> : <DepositButton amount={amount} />}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}
