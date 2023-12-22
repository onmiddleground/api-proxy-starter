import { strict as assert } from "assert";
import { Logger } from "@nestjs/common";
import * as jwt from 'jsonwebtoken';

export class TokenUtil {
    private static readonly logger = new Logger(TokenUtil.name);

    /**
     * Accepts the token as Cognito format, we use the ID Token to set the username settings required by downstream services.
     *
     * We generate a new access token for the downstream microservices.
     *
     * @param token
     * @protected
     */
    public static async generateDownstreamToken(token: string): Promise<string> {
        let downstreamToken: string;

        try {
            if (token) {
                const parsed = TokenUtil.parseCognitoIdToken(token);
                if (parsed["cognito:username"]) {
                    // TODO: We need to get the Role out of the token in order to set it below (0=Anonymous, 1=Member, 99=Admin)
                    downstreamToken = TokenService.generateToken(parsed["cognito:username"], parsed["cognito:username"], [1]);
                }
            }
        } catch (err) {
            TokenUtil.logger.error("Problem with token", err);
            throw new Error("Token is an invalid format");
        }

        return downstreamToken;
    }

    /**
     * Expected ID Token Form:
       {
          "at_hash": "3GVTKy8ow0HJFavk-h5ITQ",
          "sub": "3bba9bab-812a-4b79-911c-17b027d07a40",
          "email_verified": true,
          "iss": "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_KpnLjPVh0",
          "cognito:username": "3bba9bab-812a-4b79-911c-17b027d07a40",
          "origin_jti": "4622fa75-3a51-4ef4-ad3c-bd8b3ac035a2",
          "aud": "1pdbbcnkca5pc5ht60rcp7uksf",
          "event_id": "a53babe4-c6fb-484c-b9c9-cc5b1c6afe21",
          "token_use": "id",
          "auth_time": 1670334225,
          "exp": 1670337825,
          "iat": 1670334225,
          "jti": "9c38fe8a-0efa-4e65-9bd6-7cbc62464e77",
          "email": "someemail@example.com"
        }
     */
    static getCognitoToken(token: string) {
        const unparsedToken = TokenUtil.parseAuthheader(token);
        this.logger.log("Bearer Token is",unparsedToken);
        let tokenObj = unparsedToken;
        if (typeof unparsedToken === "string") {
            this.logger.log("Token is a string, parsing");
            // Try to parse the token as a String based Cognito Token
            tokenObj = JSON.parse(unparsedToken);
        } else {
            this.logger.log("Token is already an object");
        }
        return tokenObj;
    }

    static getIdToken(token: string) {
        const tokenObj = TokenUtil.getCognitoToken(token);
        return tokenObj.id_token;
    }

    static getAccessToken(token: string) {
        const tokenObj = TokenUtil.getCognitoToken(token);
        return tokenObj.access_token;
    }

    static parseCognitoIdToken(token: string) {
        // return TokenService.decodeToken(this.getIdToken(token));
        return TokenService.decodeToken(token);
    }

    static hasExpired(accessToken: string) {
        try {
            const decoded = TokenService.decodeToken(accessToken);
            return Date.now() > decoded['exp'] * 1000;
        } catch (err) {
            throw new Error("Token is invalid and cannot be decoded");
        }
    }

    static parseAuthheader(authHeader: string) {
        const tokenParts = authHeader.split(" ");
        let token;
        if (tokenParts.length === 2) {
            token = tokenParts[1];
        }

        return token;
    }
}

export class AWSStatement {
    Action: string = "execute-api:Invoke";
    Effect: AWSEffect;
    Resource: string;
}

export class AWSPolicy {
    Version: string = '2012-10-17';
    Statement: AWSStatement[] = [];
}

export enum AWSEffect {
    ALLOW = "Allow", DENY = "Deny"
}

export class AWSPolicyResponse {
    principalId: string;
    policyDocument: AWSPolicy;
    context: any;
}

export class JWTOptions {
    tokenExpiry?: string = "1d";
}

export class TokenAuthorizer {
    public static generatePolicy(effect: AWSEffect, resource: string): AWSPolicy {
        assert(resource != undefined, "Resource ARN is a required parameter");

        const policy: AWSPolicy = new AWSPolicy();
        const statement: AWSStatement = new AWSStatement();
        statement.Effect = effect;
        statement.Resource = resource;
        policy.Statement.push(statement);
        return policy;
    }

    public static generatePolicyResponse(effect: AWSEffect, resource: string, payload: any, principalId: string): AWSPolicyResponse {
        assert(principalId != null, "Principal ID is a required parameter");

        const result = new AWSPolicyResponse();
        result.principalId = principalId;
        result.policyDocument = this.generatePolicy(effect, resource);
        result.context = payload;

        return result;
    }
}

export class TokenService {
    private claims: any;
    private readonly logger = new Logger(TokenService.name);

    constructor(private jwtOptions: JWTOptions) {
        this.claims = {
            issuer: "The Clemson Insider",
            algorithm: "RS256",
            subject: "info@theclemsoninsider.com"
        }
    }

    private getClaims(): any {
        this.claims.expiresIn = this.jwtOptions.tokenExpiry || '1d';
        return this.claims;
    }

    public createToken(payload: any, secret: string): string {
        const claims = this.getClaims();
        return jwt.sign(payload, secret, claims);
    }

    public verifyToken(token: string, publicKey: string): any {
        return jwt.verify(token, publicKey, this.claims);
    }

    /**
     * Validates a bearer token that is typically passed in a header.
     *
     * @param auth In the format Bearer <<token>>
     * @param publicKey Public Key needed to validate the token
     */
    public isValidToken(auth: string, publicKey: string): boolean {
        return this.verifyToken(TokenService.splitToken(auth), publicKey);
    }

    public static decodeToken(auth: string): any {
        return jwt.decode(TokenService.splitToken(auth));
    }

    public canAccessApi(token: string, secret: string, resource: string, payload: any = {}, principalId: string): AWSPolicyResponse {
        try {
            const verified = this.verifyToken(token, secret);
            if (verified) {
                return TokenAuthorizer.generatePolicyResponse(AWSEffect.ALLOW, resource, payload, principalId);
            } else {
                return TokenAuthorizer.generatePolicyResponse(AWSEffect.DENY, resource, payload, principalId);
            }
        } catch (err) {
            this.logger.error("User cannot access API resource because of an exception (most likely a public/private key mismatch)", err);
            return TokenAuthorizer.generatePolicyResponse(AWSEffect.DENY, resource, payload, principalId);
        }
    }

    /**
     * @param auth Can come in as a token, a Bearer Token or an Auth token etc
     */
    public static splitToken(auth: string): string {
        if (!auth) {
            throw new Error(`Auth is a required parameter when splitting a token`);
        }

        let token: string = undefined;
        const authParts = auth.split(" ");
        if (authParts.length === 1) {
            token = auth;   // Assume the token is coming in as is
        } else if (authParts.length === 2) {
            token = authParts[1];   // Coming in either as Authorization or as Bearer
        } else {
            throw new Error(`Could not parse the auth string. Passed in as [auth] but must be in the format [Bearer token-here]`);
        }
        return token;
    }

    /**
     * Generate a token based on an anonymous role typically used by Public services
     *
     * @param userId
     * @param userName
     * @param permissions
     */
    public static generateToken = (userId, userName, permissions: number[] = [0]) => {
        const privateKey = process.env['DOWNSTREAM_PRIVATE_KEY'];

        let tokenService: TokenService = new TokenService(new JWTOptions());
        const payload: any = {
            userId: userId,
            userName: userName,
            p: JSON.stringify(permissions)  // anonymous role or no permissions is 0 by default
        };
        return tokenService.createToken(payload, privateKey);
    }
}
