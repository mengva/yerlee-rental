import { zodValidationSignUp } from "@/server/packages/validations";
import db from "../config/db";
import { userCredentials, users } from "../db";
import { Helper } from "../utils";
import { ErrorHandler } from "@/server/packages/utils";

export const generateUser = async () => {
    try {
        const email = "yerleeRental09@gmail.com";

        const userInfo = await db.query.users.findFirst({
            where: (users, { eq, and }) => and(
                eq(users.email, email),
                eq(users.isActive, true),
            ),
        });

        if (userInfo) {
            console.log("User already exists.");
            return;
        }

        const password = "yerleeRental09@&.com";

        const hashedPassword = await Helper.bcryptHash(password);

        const validationUserInfo = zodValidationSignUp.parse({
            email,
            password,
            confirmPassword: password,
            firstName: "Yer",
            lastName: "Lee",
            gender: "male",
            birthDay: "1990/01/01",
            phoneNumber: "2012345678",
        });

        if (!validationUserInfo) {
            const message = ErrorHandler.getErrorMessage(validationUserInfo);
            console.error("Validation failed for user info:", message);
            return;
        }

        const [newUser] = await db.insert(users).values({
            firstName: validationUserInfo.firstName,
            lastName: validationUserInfo.lastName,
            email: validationUserInfo.email,
            gender: validationUserInfo.gender,
            birthDay: validationUserInfo.birthDay,
            phoneNumber: validationUserInfo.phoneNumber,
            role: "owner",
        }).returning();

        if(!newUser) {
            console.error("Failed to create new user.");
            return;
        }

        await db.insert(userCredentials).values({
            passwordHash: hashedPassword,
            userId: newUser.id,
        }).onConflictDoNothing().execute();

        console.log("User generated successfully.");

        // You can also add logic here to generate an access token for the new user if needed
        // const token = await Helper.generateToken({ userId: newUserId, role: "owner" });
        // console.log("Generated token for new user:", token);

        // logic to auto signup users
    } catch (error) {
        console.error("Error occurred while generating user:", error);
    }
}