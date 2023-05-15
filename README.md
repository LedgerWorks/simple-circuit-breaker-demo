# Simple Circuit-Breaker Demo

## Initial Setup
The following environment variables need to be added to your `.env` file:

- `RPC_HOST`
- `COINFLIP_CONTRACT_ADDRESS`
- `COINFLIP_ADMIN_ADDRESS`
- `COINFLIP_ADMIN_KEY`
- `COINFLIP_PLAYER_ADDRESS`
- `COINFLIP_PLAYER_KEY`

## /cli
A CLI wrapper around the CoinFlip exploitable smart contract

| Command     | Args                       | Access | Payable | View |
| ----------- | -------------------------- | :----: | :-----: | :--: |
| deposit     | `<amount>`                 |  all   |   ✅    |  ❌  |
| withdraw    | `<amount>`                 | owner  |   ❌    |  ❌  |
| disable     |                            | owner  |   ❌    |  ❌  |
| enable      |                            | owner  |   ❌    |  ❌  |
| ban         |                            | owner  |   ❌    |  ❌  |
| unban       |                            | owner  |   ❌    |  ❌  |
| wager       | `<called_side>` `<amount>` | player |   ✅    |  ❌  |
| flip        | `<timestamp>`              | player |   ❌    |  ❌  |
| collect     |                            | player |   ❌    |  ❌  |
| get-balance |                            |  all   |   ❌    |  ✅  |
| get-flip    | `[flip_index]`             |  all   |   ❌    |  ✅  |
| is-banned   |                            |  all   |   ❌    |  ✅  |
| is-disabled |                            |  all   |   ❌    |  ✅  |
| is-winner   |                            |  all   |   ❌    |  ✅  |
|             |                            |        |         |      |

## /contracts
The Solidity code for the CoinFlip exploitable smart contract

## /lambdas
The Node.js Lambda code for the circuit breaker switch

## /src
The static website code for the CoinFlip demo game
