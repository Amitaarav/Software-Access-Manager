import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import type { User } from "./user-entity.js";
import type { Software } from "./software-entity.js";

export type AccessType = "Read" | "Write" | "Admin";
export type RequestStatus = "Pending" | "Approved" | "Rejected";

@Entity("requests")
export class Request {
  @PrimaryGeneratedColumn({type : "int"})
  id!: number;

  @ManyToOne("User", "requests")
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column({type : 'int'})
  userId!: number;

  @ManyToOne("Software", "requests")
  @JoinColumn({ name: "softwareId" })
  software!: Software;

  @Column({type : 'int'})
  softwareId!: number;

  @Column({
    type: "enum",
    enum: ["Read", "Write", "Admin"],
    default: "Read"
  })
  accessType!: AccessType;

  @Column({type : "text"})
  reason!: string;

  @Column({
    type: "enum",
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  })
  status!: RequestStatus;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "timestamp", nullable: true })
  updatedAt!: Date;
}