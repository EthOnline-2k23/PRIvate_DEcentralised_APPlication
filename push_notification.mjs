import { PushAPI } from '@pushprotocol/restapi'
import { ENV } from '@pushprotocol/restapi/src/lib/constants.js'
import { ethers } from 'ethers'
import * as dotenv from 'dotenv'
dotenv.config();

async function notiF(bodyData) {
    const env = ENV.STAGING
    console.log(env)
    const channelSigner = new ethers.Wallet(process.env.PRIVATE_KEY)
    console.log("private key")
    console.log(channelSigner)
    const channelUser = await PushAPI.initialize(channelSigner, { env })
    console.log("channelUser")

    const channelInfo = await channelUser.channel.info()
    console.log("channelInfo")
    const subscribers = await channelUser.channel.subscribers()

    await channelUser.channel.send(['0x447fa0120F0E9b454bBe0Fd0EF971782AAD080aB'], {
        notification: {
            title: bodyData ,
            body: bodyData ,
        },
    })
    console.log("success")
}

export default notiF;
