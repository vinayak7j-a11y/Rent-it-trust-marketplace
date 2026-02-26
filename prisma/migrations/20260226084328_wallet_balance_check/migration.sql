-ALTER TABLE "Wallet"
ADD CONSTRAINT wallet_balance_non_negative CHECK ("balance" >= 0);- This is an empty migration.