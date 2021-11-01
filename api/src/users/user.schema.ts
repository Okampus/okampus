import { Prop, Schema } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import type { CallbackError } from 'mongoose';
import { Document } from 'mongoose';
import { PreHook } from '../shared/decorators/mongoose-hooks.decorator';
import { createSchemaForClass } from '../shared/utils/createSchemaForClass';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  // TODO: Add full 'reputation' support
  @Prop({ default: 0 })
  reputation: number;

  // TODO: Add full 'avatar' support
  @Prop({ default: null, type: String })
  avatar: string | null;

  createdAt: Date;
  updatedAt: Date;

  @PreHook('save')
  public async saveHook(next: (err?: CallbackError) => void): Promise<void> {
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
  }

  public async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password ?? '');
  }
}

export const UserSchema = createSchemaForClass(User);
