import { accountPath, depositPath, transferPath } from './bank_account.paths'

const accountPaths = {
  '/accounts': accountPath,
  '/accounts/transfer': transferPath,
  '/accounts/deposit': depositPath
}

export default {
  ...accountPaths
}
