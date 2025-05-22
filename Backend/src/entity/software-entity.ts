import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import type { Request } from "./request-entity.js"

@Entity("software")
export class Software {
  @PrimaryGeneratedColumn({type: "int"})
  id!: number;

  @Column({type: 'varchar', nullable: false})
  name!: string;

  @Column({type:'varchar', nullable: false, default: "text"})
  description!: string;

  @Column({type : 'simple-array'})
  accessLevels!: string[]; // e.g., ["Read", "Write", "Admin"]

  @Column({
    type: "timestamp",
    default:() => "CURRENT_TIMESTAMP"
  })
  createdAt!: Date

  @OneToMany("Request", "software")
  requests!: Request[]
}
