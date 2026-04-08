
import { UserRoleDto } from "@/server/packages/types/constants/variables";
import type { Context as HonoContext } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

type ResHeaderDto = HonoContext['res']['headers'];

const getIPHeader = (headers: ResHeaderDto) => {
  return headers.get('x-real-ip') || headers.get('x-forwarded-for') || headers.get('cf-connecting-ip') || headers.get("ip") || '';
}

export const getIPInHonoRequest = (c: HonoContext) => {
  const headers = c.req.raw.headers;
  const ipAddress = getIPHeader(headers);
  return ipAddress;
}

export const getIPInHonoResponse = (c: HonoContext) => {
  const headers = c.res.headers;
  const ipAddress = getIPHeader(headers);
  return ipAddress;
}

export const getIPAddress = (c: HonoContext) => {
  return getIPInHonoRequest(c) || getIPInHonoResponse(c);
}

export const getUserAgent = (c: HonoContext) => {
  return c.req.header('User-Agent') || '';
}

// Update your context creation
export const createdTRPCContext = async (c: HonoContext) => {
  const userAgent = getUserAgent(c);
  const ipAddress = getIPAddress(c);
  
  return {
    req: c.req.raw,
    res: c.res,
    c,
    ip: ipAddress,
    userInfo: {
      userId: '',
      role: '' as UserRoleDto,
    },
    bodyInfo: {} as any,
    userAgent,
    setCookie: (name: string, value: string, option: any) => setCookie(c, name, value, option) as void,
    getCookie: (name: string) => getCookie(c, name) as string,
    deleteCookie: (name: string) => deleteCookie(c, name) as string,
  };
};

export type MyContext = Awaited<ReturnType<typeof createdTRPCContext>>