import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Request } from "./request-entity.js";
import { User } from "./user-entity.js";
import type { RequestStatus } from "./request-entity.js";

@Entity("request_history")
export class RequestHistory {
  @PrimaryGeneratedColumn({ type: "int" })
  id!: number;

  @ManyToOne(() => Request)
  @JoinColumn({ name: "requestId" })
  request!: Request;

  @Column({ type: "int" })
  requestId!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "changedById" })
  changedBy!: User;

  @Column({ type: "int" })
  changedById!: number;

  @Column({
    type: "enum",
    enum: ["Pending", "Approved", "Rejected"]
  })
  oldStatus!: RequestStatus;

  @Column({
    type: "enum",
    enum: ["Pending", "Approved", "Rejected"]
  })
  newStatus!: RequestStatus;

  @Column({
    type: "text",
    nullable: true
  })
  comment!: string | null;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP"
  })
  changedAt!: Date;
} 