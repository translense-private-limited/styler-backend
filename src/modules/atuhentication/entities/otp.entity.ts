import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { OtpRecipientEnum } from '../enums/otp-recipient.enum';

@Entity('otp')
export class OtpEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  recipient: string; // Email or contact number where OTP is sent

  @Column({ type: 'enum', enum: OtpRecipientEnum, nullable: true })
  type: OtpRecipientEnum; // Enum to specify the type of recipient (email or contact number)

  @Column({ type: 'int', nullable: false })
  otp: number; // The OTP code

  @Column({ type: 'boolean', default: false })
  isUsed: boolean; // Whether the OTP has been used

  @Column({ type: 'timestamp', nullable: false })
  expirationTime: Date; // OTP validity expiration time

  @Column({ type: 'int', default: 0 })
  resendAttempts: number; // Number of times the OTP has been resent
}
