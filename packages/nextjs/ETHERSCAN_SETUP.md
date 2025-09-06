# Etherscan API Setup

To enable transaction history fetching, you need to set up an Etherscan API key.

## Steps:

1. Go to [Etherscan.io](https://etherscan.io/apis) and create a free account
2. Get your API key from the dashboard
3. Add the following to your existing `.env.example` file in `packages/nextjs/`:

```bash
# Etherscan API Key
# Get your free API key from https://etherscan.io/apis
ETHERSCAN_API_KEY=YourApiKeyToken
```

4. Create a `.env.local` file in the `packages/nextjs/` directory (this file should be in your `.gitignore`)
5. Add your actual API key to `.env.local`:

```bash
ETHERSCAN_API_KEY=your_actual_api_key_here
```

## Alternative: Use without API key

The system will work with a default token, but you'll have rate limits. For production use, get a proper API key.

## Testing

After setting up the API key:
1. Restart your development server (`yarn start`)
2. Navigate to an NGO page
3. Check the browser console for transaction data
4. The transaction history should now load properly

## File Structure

- `.env.example` - Template file with placeholder values (committed to git)
- `.env.local` - Your actual environment variables (not committed to git)
