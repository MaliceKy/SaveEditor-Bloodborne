import express from "express";
import { UserLoginModel } from "./security.models";
import { MongoDBService } from "../database/mongodb.service";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SecuritySettings } from "./security.settings";

/* SecurityController
    * @class: SecurityController
    * @remarks: A class that contains the controller functions for the security module
    * 			  postLogin: a function that handles the login request
    * 			  postRegister: a function that handles the register request
    * 			  getTest: a function that handles the test request
    */
export class SecurityController {

    private mongoDBService: MongoDBService = new MongoDBService(
        process.env.MONGO_CONNECTION_STRING || ""
    );
    private settings:SecuritySettings=new SecuritySettings();

    /* makeToken(user: UserLoginModel): string
        @param {UserLoginModel}: The user to encode
        @returns {string}: The token
        @remarks: Creates a token from the user
    */
    private makeToken(user: UserLoginModel): string {

        var token = jwt.sign(user, process.env.SECRET || "secret");
        return token;
    }

    /* encryptPassword(password: string): Promise<string>
        @param {string}: password - The password to encrypt
        @returns {Promise<string>}: The encrypted password
        @remarks: Encrypts the password
        @async
    */
    private encryptPassword(password: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const saltRounds = 10;
            let hashval: string = "";
            bcrypt.genSalt(saltRounds, (err, salt) => {
                if (err) throw err;
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) throw err;
                    resolve(hash);
                });
            });
        });
    }

    public getAuthorize = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
        //renew the token.
        res.send({ token: this.makeToken(req.body.user) });
    }
    
    public getUser = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
        //send the user
        res.send(req.body.user);
    }

    /* postLogin(req: express.Request, res: express.Response): Promise<void>
        @param {express.Request} req: The request object
                expects username and password in body of request
        @param {express.Response} res: The response object
        @returns {Promise<void>}:
        @remarks: Handles the login request
        @async
    */
    public postLogin = async (req: express.Request, res: express.Response): Promise<void> => {
        let connection = false;
        try {
            if (!req.body.username || !req.body.password || 
                req.body.username.trim().length === 0 || 
                req.body.password.trim().length === 0) {
                res.status(400).send({ message: "Username and password are required" });
                return;
            }

            connection = await this.mongoDBService.connect();
            if (!connection) {
                res.status(500).send({ message: "Database connection failed" });
                return;
            }

            const dbUser = await this.mongoDBService.findOne<UserLoginModel>(
                this.settings.database, 
                this.settings.collection, 
                { username: req.body.username.toLowerCase() }
            );

            // User not found or wrong password - return same message for both
            if (!dbUser || !(await bcrypt.compare(req.body.password, dbUser.password))) {
                res.status(401).send({ message: "Invalid credentials" });
                return;
            }

            const userForToken = { ...dbUser, password: "****" };
            res.status(200).send({ token: this.makeToken(userForToken) });

        } catch (err) {
            console.error("Login error:", err);
            res.status(500).send({ message: "An unexpected error occurred" });
        } finally {
            if (connection) {
                await this.mongoDBService.close();
            }
        }
    }

    /* postRegister(req: express.Request, res: express.Response): Promise<void>
        @param {express.Request} req: The request object
            expects username and password in body of request
        @param {express.Response} res: The response object
        @returns {Promise<void>}:
        @remarks: Handles the register request on post
        @async
    */
    public postRegister = async (req: express.Request, res: express.Response): Promise<void> => {
        const user: UserLoginModel = { 
            username: req.body.username.toLowerCase(), // Convert to lowercase for consistency
            password: req.body.password,
            roles: this.settings.defaultRoles 
        };

        if (!user.username || !user.password || user.username.trim().length === 0 || user.password.trim().length === 0) {
            res.status(400).send({ error: "Username and password are required" });
            return;
        }

        // Add basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user.username)) {
            res.status(400).send({ error: "Invalid email format" });
            return;
        }

        try {
            let result = await this.mongoDBService.connect();
            if (!result) {
                res.status(500).send({ error: "Database connection failed" });
                return;
            }

            let dbUser: UserLoginModel | null = await this.mongoDBService.findOne(
                this.settings.database, 
                this.settings.collection, 
                { username: user.username }
            );

            if (dbUser) {
                res.status(409).send({ error: "User already exists" }); // Use 409 Conflict for duplicate
                return;
            }

            user.password = await this.encryptPassword(user.password);
            result = await this.mongoDBService.insertOne(this.settings.database, this.settings.collection, user);
            if (!result) {
                throw { error: "Database insert failed" };
            }
            dbUser = await this.mongoDBService.findOne(this.settings.database, this.settings.collection, { username: user.username });
            if (!dbUser) {
                throw { error: "Database insert failed" };
            }
            dbUser.password = "****";
            res.send({ token: this.makeToken(dbUser) });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        } finally {
            this.mongoDBService.close();
        }
    }

}