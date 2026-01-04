This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Updating Next.js Project

To update your Next.js project to the latest version:

```bash
# Update Next.js and React to the latest versions
pnpm update next eslint-config-next
# or
pnpm dlx @next/codemod@canary upgrade latest
```

**Important steps after updating:**

1. Check the [Next.js upgrade guide](https://nextjs.org/docs/app/building-your-application/upgrading) for breaking changes
2. Update your dependencies that depend on Next.js/React versions
3. Review and update deprecated APIs in your codebase
4. Test thoroughly, especially:
   - Routing and navigation
   - API routes
   - Image optimization
   - Font loading
5. Check TypeScript types if using TypeScript

**Common issues to watch for:**

- Changes in App Router behavior (if using App Router)
- Middleware API changes
- Image component prop changes
- Configuration file updates (next.config.js/ts)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
