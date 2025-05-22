import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source.js";
import { User } from "../entity/user-entity.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { ILike } from "typeorm";

const userRepository = AppDataSource.getRepository(User);

const generateTokens = (user: User) => {
  const accessToken = jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      email: user.email,
      role: user.role 
    },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret-key",
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "All fields are required" });
      return;
    }

    // Check if user already exists (both username and email)
    const existingUser = await userRepository.findOne({ 
      where: [
        { username },
        { email }
      ]
    });
    
    if (existingUser) {
      const field = existingUser.username === username ? "Username" : "Email";
      res.status(StatusCodes.BAD_REQUEST).json({ message: `${field} already exists` });
      return;
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = userRepository.create({
      username,
      email,
      password: hashedPassword,
      role: role || "Employee"
    });

    await userRepository.save(user);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.status(StatusCodes.CREATED).json(userWithoutPassword);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error during registration" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "Username/Email and password are required" });
      return;
    }

    const user = await userRepository.findOne({
      where: [
        { username: ILike(usernameOrEmail) },
        { email: ILike(usernameOrEmail) }
      ]
    });

    if (!user) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid credentials" });
      return;
    }

    if (!user.isActive) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "Account is deactivated. Please contact administrator." });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid credentials" });
      return;
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Store refresh token in database
    user.refreshToken = refreshToken;
    await userRepository.save(user);

    const { password: _, refreshToken: __, ...userWithoutSensitiveInfo } = user;
    res.status(StatusCodes.OK).json({
      ...userWithoutSensitiveInfo,
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error during login" });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "Refresh token is required" });
      return;
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret-key"
    ) as { id: number };

    // Find user with this refresh token
    const user = await userRepository.findOne({
      where: { 
        id: decoded.id,
        refreshToken
      }
    });

    if (!user) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid refresh token" });
      return;
    }

    // Generate new tokens
    const tokens = generateTokens(user);

    // Update refresh token in database
    user.refreshToken = tokens.refreshToken;
    await userRepository.save(user);

    res.status(StatusCodes.OK).json(tokens);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "Refresh token expired" });
      return;
    }
    console.error("Refresh token error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error during token refresh" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "Refresh token is required" });
      return;
    }


    const user = await userRepository.findOne({
      where: { refreshToken }
    });

    if (user) {
      user.refreshToken = null;
      await userRepository.save(user);
    }

    res.status(StatusCodes.OK).json({ message: "Successfully logged out" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error during logout" });
  }
};