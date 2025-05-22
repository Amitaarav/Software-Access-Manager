import dotenv from "dotenv";

dotenv.config();

export const serverConfig = {
    PORT: parseInt(process.env.PORT || "3000", 10)
};
