import { PushAPI } from '@pushprotocol/restapi'
import { ENV } from '@pushprotocol/restapi/src/lib/constants.js'
import { ethers } from 'ethers'
import * as dotenv from 'dotenv'
dotenv.config();
const env = ENV.STAGING
const firstSigner = new ethers.Wallet(process.env.PRIVATE_KEY)
const secondSigner = new ethers.Wallet(process.env.PRIVATE_KEY1)
const main = async () => {
    const firstUser = await PushAPI.initialize(firstSigner, {env})
    const secondUser = await PushAPI.initialize(secondSigner, {env})
    await firstUser.chat.send(secondSigner.address, {content: 'jjelooo', type: 'Text'})
    await secondUser.chat.accept(firstSigner.address)
    await secondUser.chat.send(firstSigner.address, {content: 'jjelooo somya', type: 'Text'})
    await secondUser.chat.send(firstSigner.address, {content: 'jjelooo lakshay', type: 'Text'})
    const myChats = await firstUser.chat.list('CHATS')
    myChats.map((chat) => console.log(`Last message from chat use ${chat.msg.fromCAIP10}: ${chat.msg.messageContent}`))

console.log("success")
}

main().catch((e) => console.error(e))