import "dotenv/config";
import { Schema, model } from "mongoose";
import { isEmail } from "validator";
import jwt from "jsonwebtoken";
import { compareHashPasswords, hashPassword } from "../bcrypt/bcrypt";

interface userModel {
  name: string;
  email: string;
  password: string;
  photoUrl: string;
  message: string;
  status: "active" | "inactive";
  lastSeen: {
    status: boolean;
    date: Date;
  };
  preferLanguage: {
    language: string;
    isoCode: string;
  };
}

const userSchema = new Schema<userModel>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      reqquired: true,
      trim: true,
      unique: true,
      validate(value: string) {
        if (!isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      trim: true,
      validate(value: string) {
        if (value.toLowerCase().includes("password")) {
          throw new Error('Password cannot contain "password"');
        }
      },
    },
    photoUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      trim: true,
      required: false,
      enum: ["active", "inactive"],
      default: "active",
    },
    message: {
      type: String,
      default: "Available",
    },
    lastSeen: {
      status: {
        type: Boolean,
        default: false,
      },
      date: {
        type: Date,
      },
    },
    preferLanguage: {
      language: {
        type: String,
        default: "",
      },
      isoCode: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true }
);

/**
 * Method for hidden unnecessary field
 */
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;

  return userObject;
};

/**
 * Authentification token with JWT
 */
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    status: user.status,
  };
  const token = jwt.sign(payload, `${process.env.JWT_ACCESS_SECRET}`, {
    // expiresIn: `${process.env.JWT_ACCESS_EXPIRY_TIME}`,
  });
  await user.save();
  return token;
};

/**
 * Login user credentials
 */
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw { mesage: "Unauthorized", status: 404 };
  }

  const isMatch = await compareHashPasswords(password, user.password);

  if (!isMatch) {
    throw new Error("Unauthorized");
  }

  if (user.status !== "active") {
    throw new Error("Unauthorized");
  }

  return user;
};

/**
 * middleware
 * Hash the plan text password
 */
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await hashPassword(user.password);
  }
  next();
});

/**
 * middleware
 * Delete user - cascade from other table
 */

// userSchema.pre("remove", async function (next) {
//   const user = this;
//   // await DocumentBank.deleteMany({ user: user._id });
//   // await UserAreaOfLaw.deleteMany({ user: user._id });
//   next();
// });

const User = model("User", userSchema);
export default User;
