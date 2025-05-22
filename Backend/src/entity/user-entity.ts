import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import type { Request } from "./request-entity.js"

export type UserRole  = "Employee" | "Manager" | "Admin";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn({ type: "int"})
  id!: number;

  @Column({ type:'varchar', unique: true })
  username!: string;

  @Column({ type:'varchar', unique: true })
  email!: string;

  @Column({type: "varchar"})
  password!: string;

  @Column({ type: "enum", enum: ["Employee", "Manager", "Admin"] })
  role!: UserRole;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @Column({ type: "varchar", nullable: true })
  refreshToken!: string | null;

  @Column({
    type:"timestamp",
    default:()=> "CURRENT_TIMESTAMP"
  })
  createdAt!: Date;

  @OneToMany("Request", "user")
  requests!: Request[]

}
