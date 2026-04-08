import { Hono, MiddlewareHandler } from 'hono';
import { trpcServer } from '@hono/trpc-server';
import { logger } from 'hono/logger'
import { appRouter } from './router';
import { createdTRPCContext } from './context';
import { header } from '../../config/env';
import type { Context as HonoContext } from "hono";
import { RefreshTokenMiddleware } from '@/server/middleware/refreshToken';
import { generateUser } from '@/server/script/generateUser';

const app = new Hono();

app.use("/*", logger());

// refresh user session
app.use("/*", async (c, next) => {
    await RefreshTokenMiddleware.refreshUserToken(c);
    await next();
});

// Enable CORS for all routes

header.setupCORS(app);

header.setupSecurityHeaders(app);

app.use('/trpc/*', trpcServer({
    router: appRouter,
    createContext: async (req, c) => {
        const context = await createdTRPCContext(c as unknown as HonoContext);
        return typeof context === 'object' ? context : {};
    },
}) as unknown as MiddlewareHandler);

// Test route
app.get('/generate-user', async (c) => {
    await generateUser();
    return c.json({
        message: "Hello Hono + trpc",
    });
});

export default app;

