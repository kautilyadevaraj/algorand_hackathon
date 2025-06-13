import { AlgorandClient, Config } from '@algorandfoundation/algokit-utils'
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
