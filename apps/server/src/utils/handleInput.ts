import { DomAndSanitizeServices } from "@/server/packages/utils/domAndSanitize";
import { MyContext } from "../server/trpc/context";
import { ServerResponseDto } from "@/server/packages/types/constants/interface";
import { TRPCErrorServices } from "./handleTRPCError";
import { TRPCError } from "@trpc/server";

interface InputDto {
    ctx: MyContext;
    input: any;
}

export const handleSanitizeInputValue = async ({ ctx, input }: InputDto, callback: (ctx: MyContext) => Promise<ServerResponseDto>) => {
    try {
        if (input && Object.keys(input).length > 0) {
            const sanitizedBody = DomAndSanitizeServices.object(input);
            ctx.bodyInfo = sanitizedBody;
        } else {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Input value is required or Input value is not empty"
            });
        }
        return await callback(ctx);
    } catch (error) {
        throw TRPCErrorServices.TRPCError(error);
    }
}