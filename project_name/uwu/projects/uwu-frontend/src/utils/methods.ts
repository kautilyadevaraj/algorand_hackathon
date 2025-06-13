import { AlgorandClient, Config, algo } from '@algorandfoundation/algokit-utils'
import { secretKeyToMnemonic, Account } from 'algosdk';

const algorand = AlgorandClient.defaultLocalNet()


/**
 * Creates a new random Algorand account.
 * In a production environment, ensure the mnemonic is securely stored and managed,
 * as it provides full control over the account.
 * Also, remember to fund this account with at least 0.1 Algo (100,000 microAlgos)
 * before it can participate in transactions.
 */
export const createRandomAccount = () => {
  const randomAccount = algorand.account.random();
  const mnemonic = secretKeyToMnemonic(randomAccount.account.sk);
  console.log('Random Account Address:', randomAccount.addr);
  console.log('Random Account Mnemonic (KEEP THIS SAFE!):', mnemonic);
  return randomAccount;
};

export const createAsset = async () => {
  const localNetDispenser = await algorand.account.localNetDispenser()
  const randomAccount = algorand.account.random()
  await algorand.account.ensureFunded(randomAccount.addr, localNetDispenser, algo(1))
  // Basic example
  const result = await algorand.send.assetCreate({ sender: randomAccount.addr, total: 100n })

  console.log(result)

  // // Advanced example
  // const result2 = await algorand.send.assetCreate({
  //   sender: randomAccount.addr,
  //   total: 100n,
  //   decimals: 2,
  //   assetName: 'asset',
  //   unitName: 'unit',
  //   url: 'url',
  //   metadataHash: 'metadataHash',
  //   defaultFrozen: false,
  //   manager: 'MANAGERADDRESS',
  //   reserve: 'RESERVEADDRESS',
  //   freeze: 'FREEZEADDRESS',
  //   clawback: 'CLAWBACKADDRESS',
  //   lease: 'lease',
  //   note: 'note',
  //   // You wouldn't normally set this field
  //   firstValidRound: 1000n,
  //   validityWindow: 10,
  //   extraFee: (1000).microAlgo(),
  //   staticFee: (1000).microAlgo(),
  //   // Max fee doesn't make sense with extraFee AND staticFee
  //   //  already specified, but here for completeness
  //   maxFee: (3000).microAlgo(),
  //   // Signer only needed if you want to provide one,
  //   //  generally you'd register it with AlgorandClient
  //   //  against the sender and not need to pass it in
  //   maxRoundsToWaitForConfirmation: 5,
  //   suppressLog: true,
  // })

  // console.log(result2)
}

/**
 * Recovers an Algorand account from a 25-word mnemonic phrase.
 * This is useful for restoring access to an existing account.
 */
export const recoverAccountFromMnemonic = (mnemonic: string) => {
  try {
    const account = algorand.account.fromMnemonic(mnemonic);
    console.log('Recovered Account Address:', account.addr);
    return account;
  } catch (error) {
    console.error('Error recovering account from mnemonic:', error);
    throw error;
  }
};
