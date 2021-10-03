import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  password?: string;

  @Prop()
  googleId?: string;

  createdAt: Date;
  updatedAt: Date;
  validatePassword: (password: string) => Promise<boolean>;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password ?? '');
};

// Update password into a hashed one.
UserSchema.pre('save', async function (this: User, next) {
  if (!this.isModified('password') || !this.password) {
    next();
    return;
  }

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error: unknown) {
    next(error as Error);
  }
});
