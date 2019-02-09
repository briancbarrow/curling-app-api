import { Strategy: JwtStrategy, ExtractJwt } from "passport-jwt";
import { JWT_SECRET } from "../config";

const options = {
  secretOrKey: JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  algorithms: ['HS256'],
}

const jwtStrategy = new JwtStrategy(options, (payload, done) => done(null, payload.user));

module.exports = jwtStrategy;