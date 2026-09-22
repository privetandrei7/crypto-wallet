# USDT TRC20 Wallet · GasFree

Некастодиальный браузерный кошелёк только для USDT TRC20 с интеграцией GasFree.

## Что изменено
- отправка USDT через GasFree вместо обычного TronWeb transfer;
- комиссия GasFree отображается и оплачивается в USDT;
- пользовательский перевод не требует держать TRX для сетевой комиссии;
- GasFree-адрес показывается отдельно от EOA-адреса управления;
- seed-фраза и подпись GasFree-разрешения выполняются локально в браузере;
- история/TRONSCAN удалены из интерфейса.

GasFree по своей документации использует GasFree account, который контролируется EOA. Пользователь подписывает TIP-712 разрешение, а Service Provider отправляет операцию в сеть и оплачивает сетевые расходы. Для первого перевода может взиматься activation fee, далее transfer fee; обе комиссии выражаются в переводимом токене. См. официальную документацию GasFree.

## Важно про депозиты

Для отправки через GasFree USDT должны находиться на показанном **GasFree-адресе**, а не просто на EOA. Перед первым реальным переводом обязательно протестировать малой суммой и проверить актуальные комиссии провайдера.

## Vercel

Файл `api/gasfree.js` является серверной функцией Vercel. Vercel автоматически разворачивает функции из каталога `/api`.

Добавьте в Vercel Environment Variables:

- `GASFREE_API_KEY`
- `GASFREE_API_SECRET`

**API Secret нельзя помещать в `index.html` или любой клиентский JavaScript.**

Получить API Key можно в GasFree Developer Center.

## Сеть

Интеграция настроена на **TRON Mainnet GasFree**:
- GasFree endpoint: `https://open.gasfree.io/tron/`
- GasFree Controller: `TFFAMQLZybALaLb4uxHA9RBE7pxhUAjF3U`
- USDT TRC20: `TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj`

## Безопасность

Это всё ещё MVP. Не храните реальные средства, пока не проведены аудит кода, проверка GasFree-потока, безопасное хранение seed-фразы и независимая проверка зависимостей.

## Источники

GasFree: https://docs.gasfree.io/
TRON: https://developers.tron.network/docs/trc20-contract-interaction
Repository: https://github.com/privetandrei7/crypto-wallet
