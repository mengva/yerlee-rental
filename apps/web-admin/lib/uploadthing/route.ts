import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./cors";

// Export cov handlers rau GET thiab POST
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});